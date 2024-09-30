import encryptedRequest from './encryptedRequest';

type SubMallRequestData = {
  /* 요청 데이터 타입 정의 */
};

type SubMallResponseData = {
  /* 응답 데이터 타입 정의 */
};

type PayoutRequestData = {
  /* 지급대행 요청 데이터 타입 정의 */
};

type PayoutResponseData = {
  /* 지급대행 응답 데이터 타입 정의 */
};

/**
 * 잔액 정보를 나타내는 객체
 * @see https://docs.tosspayments.com/reference#balance-%EA%B0%9D%EC%B2%B4
 */
export type BananceV2 = {
  /** 셀러에게 지급할 수 없는 잔액 정보입니다. */
  pendingAmount: {
    /** 통화 (현재는 'KRW'만 지원) */
    currency: string;
    /** 잔액 */
    value: number;
  };
  /** 셀러에게 지급할 수 있는 잔액 정보입니다. */
  availableAmount: {
    /** 통화 (현재는 'KRW'만 지원) */
    currency: string;
    /** 잔액 */
    value: number;
  };
};

export enum SubMallSellerV2Status {
  /** 지급대행이 불가능한 상태입니다. 개인 및 개인사업자 셀러 등록 직후의 상태이며, 본인인증이 필요합니다. */
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',

  /** 일주일 동안 1천만원까지 지급대행이 가능한 상태입니다. 등록 직후의 법인사업자 셀러 또는 본인인증을 완료한 개인 및 개인사업자 셀러의 상태입니다. */
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',

  /** 지급대행이 불가능한 상태입니다. 일주일 동안 1천만원을 초과하는 금액을 지급 요청하면 셀러는 해당 상태로 변경됩니다. 셀러가 KYC 심사를 완료해야 합니다. */
  KYC_REQUIRED = 'KYC_REQUIRED',

  /** 금액 제한 없이 지급대행이 가능한 상태입니다. KYC 심사가 정상적으로 완료된 셀러의 상태입니다. */
  APPROVED = 'APPROVED',
}

/**
 * 셀러 정보를 나타내는 객체
 * @see https://docs.tosspayments.com/reference#seller-%EA%B0%9D%EC%B2%B4
 */
export type SubMallSellerV2 = {
  /** 토스페이먼츠에서 발급하는 셀러의 고유 식별자입니다.
   * 셀러 조회, 삭제, 지급대행 요청에 사용됩니다.
   *
   * 셀러의 상태 및 지급대행 상태가 바뀌어도 id는 바뀌지 않고, 삭제된 id는 다시 발급되지 않습니다.*/
  id: string;
  /** 오픈마켓 상점에서 직접 등록하는 셀러의 고유 식별자입니다.
   * 연동 중에 참고할 수 있는 값입니다.
   *
   * 등록 이후에 수정할 수 없고, 삭제된 셀러의 refSellerId는 다시 사용할 수 없습니다.
   */
  refSellerId: string | null;
  /** 사업자 유형 */
  businessType: 'INDIVIDUAL' | 'INDIVIDUAL_BUSINESS' | 'CORPORATE';
  /** 법인사업자 또는 개인사업자 셀러 정보 */
  company?: {
    /** 사업자명 */
    name: string;
    /** 대표자명 */
    representativeName: string;
    /** 사업자번호 */
    businessRegistrationNumber: string;
    /** 사업자 이메일입니다. 최대 길이는 100자입니다. 해당 이메일로 KYC 심사 안내가 전송됩니다. */
    email: string;
    /** 사업자 전화번호 */
    phone: string;
  } | null;
  /** 개인 셀러 정보 */
  individual?: {
    /** 개인의 이름 */
    name: string;
    /** 개인 이메일입니다. 최대 길이는 100자입니다. 해당 이메일로 KYC 심사 안내가 전송됩니다. */
    email: string;
    /** 개인 전화번호 */
    phone: string;
  } | null;
  /** 셀러 상태 */
  status: SubMallSellerV2Status | string;
  /** 계좌 정보 */
  account: {
    /** 은행 두 자리 코드입니다. 은행 코드와 증권사 코드를 참고하세요. */
    bankCode: string;
    /** 계좌번호입니다. 최대 길이는 20자입니다. */
    accountNumber: string;
    /** 예금주입니다. 최대 길이는 공백을 포함한 한글 30자, 영문 60자입니다. */
    holderName: string;
  };
  /**
   * 셀러와 관련된 추가 정보를 key-value 쌍으로 담고 있는 JSON 객체입니다.
   * 최대 5개의 키-값(key-value) 쌍입니다. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.
   */
  metadata: Record<string, string> | null;
};

/**
 * 서브몰 등록
 *
 * 오픈마켓에 입점해있는 셀러의 정보를 토스페이먼츠에 등록합니다. 셀러의 사업자번호, 계좌 유효성를 검증합니다.
 */
export const createSubMall = async (data: SubMallRequestData, secretKey: string) => {
  const response = await encryptedRequest<SubMallSellerV2>({
    method: 'POST',
    url: '/v2/sellers',
    data,
    secretkey: secretKey,
  });

  return response.data;
};

/**
 * 단일 서브몰 셀러 조회
 * 토스페이먼츠에 등록한 하나의 셀러를 조회합니다. 삭제되지 않은 셀러만 조회할 수 있어요.
 */
export const getSubMall = async (sellerId: string, secretKey: string) => {
  const response = await encryptedRequest<SubMallSellerV2>({
    method: 'GET',
    url: `/v2/sellers/${sellerId}`,
    secretkey: secretKey,
  });

  return response.data as SubMallResponseData;
};

/**
 * 서브몰 수정 API 호출 함수
 *
 * 등록된 서브믈 정보를 수정합니다. 수정하고 싶은 필드만 Request Body 파라미터로 보내주세요. 파라미터를 보내지 않으면 정보가 바뀌지 않습니다. 데이터를 삭제하고 싶다면 파라미터의 값을 null로 보내주세요. 등록할 때 필수 값이었던 필드는 삭제할 수 없습니다.
 */
export const updateSubMall = async (
  sellerId: string,
  data: Partial<SubMallRequestData>,
  secretKey: string,
) => {
  const response = await encryptedRequest<SubMallSellerV2>({
    method: 'POST',
    url: `/v2/sellers/${sellerId}`,
    data,
    secretkey: secretKey,
  });

  return response.data as SubMallResponseData;
};

/**
 * 서브몰 삭제
 *
 * 등록된 셀러를 삭제합니다. 삭제한 셀러의 id 식별자는 다시 발급되지 않고 조회가 불가능합니다.
 */
export const deleteSubMall = async (sellerId: string, secretKey: string): Promise<void> => {
  await encryptedRequest<void>({
    method: 'DELETE',
    url: `/v2/sellers/${sellerId}`,
    secretkey: secretKey,
  });
};

type PayoutListParams = {
  startDate: string;
  endDate: string;
  page?: number;
  size?: number;
  /* 기타 필요한 파라미터 */
};

/**
 * 지급대행 요청
 *
 * 지급 대상 셀러에게 정산 금액을 이체합니다. 요청 시점에 잔액이 부족하면 지급이 실패합니다.
 * @see https://docs.tosspayments.com/reference#%EC%A7%80%EA%B8%89%EB%8C%80%ED%96%89-%EC%9A%94%EC%B2%AD
 */
export const createPayout = async (
  data: PayoutRequestData,
  secretKey: string,
): Promise<PayoutResponseData> => {
  const response = await encryptedRequest<PayoutResponseData>({
    method: 'POST',
    url: '/v2/payouts',
    data,
    secretkey: secretKey,
  });

  return response.data as PayoutResponseData;
};

/**
 * 지급대행 요청 취소
 * 
 * REQUESTED 상태의 지급대행 요청 건을 취소합니다. 이미 처리 중이거나 완료된 지급대행 요청 건은 취소할 수 없습니다.

 */
export const cancelPayout = async (payoutId: string, secretKey: string): Promise<void> => {
  await encryptedRequest<void>({
    method: 'POST',
    url: `/v2/payouts/${payoutId}/cancel`,
    secretkey: secretKey,
  });
};

/**
 * 지급 요청 단건 조회
 *
 * 지급 요청 한 건을 조회합니다.
 */
export const getPayout = async (
  payoutId: string,
  secretKey: string,
): Promise<PayoutResponseData> => {
  const response = await encryptedRequest<PayoutResponseData>({
    method: 'GET',
    url: `/v2/payouts/${payoutId}`,
    secretkey: secretKey,
  });

  return response.data as PayoutResponseData;
};

/**
 * 지급 요청 목록 조회
 *
 * 지급 요청 목록을 조회합니다.
 */
export const getPayoutList = async (
  params: PayoutListParams,
  secretKey: string,
): Promise<PayoutResponseData[]> => {
  const response = await encryptedRequest<PayoutResponseData[]>({
    method: 'GET',
    url: '/v2/payouts',
    params,
    secretkey: secretKey,
  });

  return response.data as PayoutResponseData[];
};
