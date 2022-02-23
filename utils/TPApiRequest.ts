import axios, { AxiosPromise } from 'axios';

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
};

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    if (process.env.NODE_ENV === 'development') console.log(response);

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.error('TPApiRequest Response ERROR:', error);

    return Promise.reject(error);
  },
);

export const TPApiRequest = <T>({
  url,
  params,
  data,
  method,
  ...rest
}: OptionsType & (BearerAuthType | BasicAuthType)): AxiosPromise<T> =>
  axios({
    method,
    baseURL: TOSS_PAYMENT_HOST,
    url,
    params,
    data,
    auth: (rest as BasicAuthType).secretkey
      ? {
          username: (rest as BasicAuthType).secretkey,
          password: '',
        }
      : undefined,
    headers: (rest as BearerAuthType).accessToken
      ? { Authorization: `Bearer ${(rest as BearerAuthType).accessToken}` }
      : undefined,
    validateStatus: function (status) {
      return status >= 200 && status < 500;
    },
  });

export default TPApiRequest;
