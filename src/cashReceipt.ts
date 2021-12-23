import TPApiRequest from '../utils/TPApiRequest';

const V1_CASH_RECEIPT_URL = '/v1/cash-receipts';

export type CashReceiptType = {
  /** 가맹점에서 주문건에 대해 발급한 고유 ID입니다. */
  orderId: string;
  /** 결제에 대한 주문명입니다. 예를 들면 '생수 외 1건' 같은 형식입니다. 최소 1글자 이상 100글자 이하여야 합니다. */
  orderName: string;
  /** 현금영수증의 종류입니다. 소득공제, 지출증빙 중 하나의 값입니다. */
  type: string;
  /** 현금영수증 발급 키입니다. 취소할 때 사용됩니다. */
  receiptKey: string;
  /** 현금영수증 승인번호입니다. */
  approvalNumber: string;
  /**
   * 현금영수증이 발급된 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss+00:00`으로 돌아옵니다.
   * @example '2021-01-01T00:00:00+09:00'
   */
  approvedAt: string;
  /**
   * 현금영수증을 취소한 경우 취소 날짜와 시간 정보입니다. ISO 8601 형식인 YYYY-MM-DDThh:mm:ss+00:00 으로 돌아옵니다.
   * @example '2021-01-01T00:00:00+09:00'
   */
  canceledAt: string;

  /** 발행된 현금영수증을 확인할 수 있는 URL 입니다. */
  receiptUrl: string;
};

export type CashReceiptRequestType = {
  /** 현금영수증을 발급할 금액입니다. */
  amount: number;

  /** 주문 건에 대한 ID입니다.
   *
   * 영문 대소문자, 숫자, 특수문자 -, _, =로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다. */
  orderId: string;

  /** 결제에 대한 주문명입니다. 예를 들면 '생수 외 1건' 같은 형식입니다.
   *
   * 최소 1글자 이상 100글자 이하여야 합니다. */
  orderName: string;

  /**
   * 현금영수증 발급을 위한 개인 식별 번호입니다.
   * 현금영수증 종류에 따라 `휴대폰 번호`, `주민등록번호`, `사업자등록번호`, `현금영수증 카드 번호` 등을 입력할 수 있습니다.
   */
  registrationNumber: string;

  /** 현금영수증의 종류입니다. 소득공제, 지출증빙 중 하나의 값입니다. */
  type: '소득공제' | '지출증빙';

  /** 면세금액입니다. */
  taxFreeAmount?: number;

  /** 현금영수증을 발급할 새로운 사업자등록번호입니다. */
  businessNumber?: string;
};

export const requestCashReceipt = async (
  data: CashReceiptRequestType,
  options: { secretkey: string },
) =>
  TPApiRequest<CashReceiptType>({
    method: 'POST',
    url: V1_CASH_RECEIPT_URL,
    data,
    secretkey: options.secretkey,
  });

export const cancelCashReceipt = async (
  data: { receiptKey: string; amount: number },
  options: { secretkey: string },
) =>
  TPApiRequest<CashReceiptType>({
    method: 'POST',
    data: data.amount ? { amount: data.amount } : undefined,
    url: `${V1_CASH_RECEIPT_URL}/${data.receiptKey}/cancel`,
    secretkey: options.secretkey,
  });
