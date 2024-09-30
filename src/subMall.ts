import TPApiRequest from '../utils/TPApiRequest';

const V1_SUBMALL_URL = '/v1/payouts/sub-malls';

/**
 * 서브몰의 지급 가능 상태를 나타내는 enum입니다.
 */
export enum SubMallStatus {
  /** 1천만원 이하의 금액을 지급대행할 수 있는 상태입니다. 서브몰 등록 이후 최초 상태입니다. */
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',

  /** 지급대행이 보류된 상태입니다. 1천만원 이상의 금액을 지급대행 요청하면 지급대행이 실패하고 KYC 심사가 진행됩니다. */
  KYC_REQUIRED = 'KYC_REQUIRED',

  /** 지급대행 금액에 제한이 없는 상태입니다. 서브몰이 KYC 심사를 통과했기 때문입니다. */
  APPROVED = 'APPROVED',
}

/**
 * https://docs.tosspayments.com/reference#submall-%EA%B0%9D%EC%B2%B4
 * 지급받을 서브몰 정보를 가지고 있는 객체입니다.
 *
 * 정산 지급을 위해 필요한 서브몰의 계좌 정보를 포함하고 있습니다.
 */
export type SubMallType = {
  /** 서브몰의 ID입니다. 최대 길이는 20자입니다. */
  subMallId: string;

  /** 서브몰의 타입입니다. 'CORPORATE'(사업자) 또는 'INDIVIDUAL'(개인) 중 하나입니다. */
  type: 'CORPORATE' | 'INDIVIDUAL';

  /**
   * 서브몰의 지급 가능 상태입니다.
   * 'PARTIALLY_APPROVED': 1천만원 이하의 금액을 지급대행할 수 있는 상태입니다. 서브몰 등록 이후 최초 상태입니다.
   * 'KYC_REQUIRED': 지급대행이 보류된 상태입니다. 1천만원 이상의 금액을 지급대행 요청하면 지급대행이 실패하고 KYC 심사가 진행됩니다.
   * 'APPROVED': 지급대행 금액에 제한이 없는 상태입니다. 서브몰이 KYC 심사를 통과했기 때문입니다.
   */
  status: SubMallStatus;

  /** 서브몰의 상호명입니다. 최대 길이는 공백을 포함한 한글 30자, 영문 60자입니다. type이 'CORPORATE'일 때만 사용됩니다. */
  companyName?: string;

  /** 서브몰의 대표자명입니다. 최대 길이는 40자입니다. type이 'CORPORATE'일 때만 사용됩니다. */
  representativeName?: string;

  /** 서브몰의 사업자등록번호입니다. 길이는 10자입니다. type이 'CORPORATE'일 때만 사용됩니다. */
  businessNumber?: string;

  /** 서브몰에서 정산 금액을 지급받을 계좌 정보를 담은 객체입니다. */
  account: {
    /** 은행 두 자리 코드입니다. 은행 코드와 증권사 코드를 참고하세요. */
    bankCode: string;
    /** 계좌번호입니다. 최대 길이는 20자입니다. */
    accountNumber: string;
    /** 지급받을 계좌의 예금주입니다. 최대 길이는 공백을 포함한 한글 30자, 영문 60자입니다. */
    holderName?: string;
  };

  /** 서브몰 이메일 주소입니다. */
  email?: string;

  /** 서브몰 연락처입니다. '-' 없이 숫자만 넣어야 합니다. 길이는 8자 이상 11자 이하여야 합니다. */
  phoneNumber?: string;

  /**
   * 셀러와 관련된 추가 정보를 key-value 쌍으로 담고 있는 JSON 객체입니다. 
   * 최대 5개의 키-값(key-value) 쌍입니다. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.
   */
  metadata?: Record<string, string>;
};

export const getSubMalls = async (options: { secretkey: string }) =>
  TPApiRequest<SubMallType>({
    method: 'GET',
    url: V1_SUBMALL_URL,
    secretkey: options.secretkey,
  });

export const createSubMall = async (data: SubMallType, options: { secretkey: string }) =>
  TPApiRequest<SubMallType>({
    method: 'POST',
    url: V1_SUBMALL_URL,
    data,
    secretkey: options.secretkey,
  });

export const updateSubMall = async (data: SubMallType, options: { secretkey: string }) =>
  TPApiRequest<SubMallType>({
    method: 'POST',
    url: `${V1_SUBMALL_URL}/${data.subMallId}`,
    data: { ...data, subMallId: undefined },
    secretkey: options.secretkey,
  });

export const deleteSubMall = async (subMallId: string, options: { secretkey: string }) =>
  TPApiRequest<string>({
    method: 'POST',
    url: `${V1_SUBMALL_URL}/${subMallId}/delete`,
    secretkey: options.secretkey,
  });

export const getSubMallSettlementBalance = async (options: { secretkey: string }) =>
  TPApiRequest<{ balance: number }>({
    method: 'GET',
    url: V1_SUBMALL_URL,
    secretkey: options.secretkey,
  });

export const payoutSubMallSettlements = async (
  data: {
    /** 서브몰의 ID입니다. */
    subMallId: string;
    /**
     * 정산한 금액을 지급할 날짜 정보입니다.
     * @example 2023-03-02
     */
    payoutDate: string;
    /** 정산할 금액입니다. */
    payoutAmount: number;
  }[],
  options: { secretkey: string },
) =>
  TPApiRequest<{ balance: number }>({
    method: 'POST',
    url: V1_SUBMALL_URL + '/settlements',
    data,
    secretkey: options.secretkey,
  });
