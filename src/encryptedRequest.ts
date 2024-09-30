import axios, { AxiosPromise } from 'axios';
import * as jose from 'jose';
import { TextDecoder, TextEncoder } from 'util';
import { v4 as uuidv4 } from 'uuid';

export const TOSS_PAYMENT_HOST = 'https://api.tosspayments.com';

type BasicAuthType = {
  secretkey: string;
};

type BearerAuthType = {
  accessToken: string;
};

type OptionsType = {
  method: 'GET' | 'POST' | 'DELETE';
  url: string;
  params?: { [key: string]: any };
  data?: { [key: string]: any };

  checkStatusValidation?: boolean;
};

type TPErrorType = {
  message: string;
  code: string;
};

const encryptRequestBody = async <T = Record<string, any>>(data: T, secretKey: string) => {
  const key = await jose.importJWK(
    { kty: 'oct', k: Buffer.from(secretKey, 'hex').toString('base64') },
    'A256GCM',
  );

  const encoder = new TextEncoder();
  const jwe = await new jose.CompactEncrypt(encoder.encode(JSON.stringify(data)))
    .setProtectedHeader({
      alg: 'dir',
      enc: 'A256GCM',
      iat: new Date().toISOString(),
      nonce: uuidv4(),
    })
    .encrypt(key);

  return jwe;
};

const decryptResponseBody = async (jwe: string, secretKey: string) => {
  const key = await jose.importJWK(
    { kty: 'oct', k: Buffer.from(secretKey, 'hex').toString('base64') },
    'A256GCM',
  );

  const { plaintext } = await jose.compactDecrypt(jwe, key);
  return JSON.parse(new TextDecoder().decode(plaintext));
};

axios.interceptors.response.use(
  function (response) {
    if (process.env.NODE_ENV === 'development') console.log('TPApiRequest Response', response);
    return response;
  },
  function (error) {
    console.error('TPApiRequest ERROR:', error);
    if (error.response) {
      console.error('TPApiRequest ERROR Response:', error.response);
    }
    return Promise.reject(error);
  },
);

export const encryptedRequest = async <T>({
  url,
  params,
  data,
  method,
  checkStatusValidation = true,
  ...rest
}: OptionsType & (BearerAuthType | BasicAuthType)): Promise<AxiosPromise<T | TPErrorType>> => {
  let encryptedData;
  if (data && (rest as BasicAuthType).secretkey) {
    encryptedData = await encryptRequestBody(data, (rest as BasicAuthType).secretkey);
  }

  const response = await axios({
    method,
    baseURL: TOSS_PAYMENT_HOST,
    url,
    params,
    data: encryptedData,
    auth: (rest as BasicAuthType).secretkey
      ? {
          username: (rest as BasicAuthType).secretkey,
          password: '',
        }
      : undefined,
    headers: {
      ...((rest as BearerAuthType).accessToken
        ? { Authorization: `Bearer ${(rest as BearerAuthType).accessToken}` }
        : undefined),
      'TossPayments-api-security-mode': 'ENCRYPTION',
    },
    validateStatus: function (status) {
      return checkStatusValidation || (status >= 200 && status < 500);
    },
  });

  if (response.data && (rest as BasicAuthType).secretkey) {
    response.data = await decryptResponseBody(response.data, (rest as BasicAuthType).secretkey);
  }

  return response;
};

export default encryptedRequest;
