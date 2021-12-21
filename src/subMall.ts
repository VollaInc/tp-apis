import TPCommonRequest from './TPCommonRequest';

const V1_SUBMALL_URL = '/v1/payouts/sub-malls';

/**
 * 지급받을 서브몰 정보를 가지고 있는 객체입니다.
 *
 * 정산 지급을 위해 필요한 서브몰의 계좌 정보를 포함하고 있습니다.
 */
export type SubMallType = {
  /** 서브몰의 ID입니다. */
  subMallId: string;

  /** 서브몰의 상호명입니다. */
  companyName: string;

  /** 서브몰의 대표자명입니다. */
  representativeName: string;

  /** 서브몰의 사업자등록번호 입니다. */
  businessNumber: string;

  /** 서브몰에서 정산금액을 지급받을 계좌 정보를 담은 객체입니다. */
  account: {
    /** 지급받을 계좌의 은행 코드입니다. 은행 코드를 참고하세요. */
    bank: string;
    /**계좌번호입니다. */
    accountNumber: string;
  };
};

export const getSubMalls = async (options: { secretkey: string }) =>
  TPCommonRequest<SubMallType>({
    method: 'GET',
    url: V1_SUBMALL_URL,
    secretkey: options.secretkey,
  });

export const createSubMall = async (data: SubMallType, options: { secretkey: string }) =>
  TPCommonRequest<SubMallType>({
    method: 'POST',
    url: V1_SUBMALL_URL,
    data,
    secretkey: options.secretkey,
  });

export const updateSubMall = async (data: SubMallType, options: { secretkey: string }) =>
  TPCommonRequest<SubMallType>({
    method: 'POST',
    url: `${V1_SUBMALL_URL}/${data.subMallId}`,
    data: { ...data, subMallId: undefined },
    secretkey: options.secretkey,
  });

export const deleteSubMall = async (subMallId: string, options: { secretkey: string }) =>
  TPCommonRequest<string>({
    method: 'POST',
    url: `${V1_SUBMALL_URL}/${subMallId}/delete`,
    secretkey: options.secretkey,
  });

export const getSubMallSettlementBalance = async (options: { secretkey: string }) =>
  TPCommonRequest<{ balance: number }>({
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
  TPCommonRequest<{ balance: number }>({
    method: 'POST',
    url: V1_SUBMALL_URL + '/settlements',
    data,
    secretkey: options.secretkey,
  });
