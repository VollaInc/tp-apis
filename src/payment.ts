import TPApiRequest from '../utils/TPApiRequest';

const V1_PAYMENT_URL = '/v1/payments';

export enum PaymentStatus {
  /** 준비 됨*/
  'READY' = 'READY',
  /** 진행 중*/
  'IN_PROGRESS' = 'IN_PROGRESS',
  /** 가상계좌 입금 대기 중 */
  'WAITING_FOR_DEPOSIT' = 'WAITING_FOR_DEPOSIT',
  /** 결제 완료됨 */
  'DONE' = 'DONE',
  /** 결제가 취소됨 */
  'CANCELED' = 'CANCELED',
  /** 결제가 부분 취소됨 */
  'PARTIAL_CANCELED' = 'PARTIAL_CANCELED',
  /** 카드 자동결제 혹은 키인 결제를 할 때 결제승인에 실패함 */
  'ABORTED' = 'ABORTED',
  /** 유효 시간(30분)이 지나 거래가 취소됨 */
  'EXPIRED' = 'EXPIRED',
}

export enum CardAcquireStatus {
  /** 매입 대기*/
  'READY' = 'READY',
  /** 매입 요청됨*/
  'REQUESTED' = 'REQUESTED',
  /** 매입 완료*/
  'COMPLETED' = 'COMPLETED',
  /** 매입 취소 요청됨*/
  'CANCEL_REQUESTED' = 'CANCEL_REQUESTED',
  /** 매입 취소 완료*/
  'CANCELED' = 'CANCELED',
}

export enum VirtualAccountRefundStatus {
  /**해당 없음 */
  'NONE' = 'NONE',
  /**환불 실패 */
  'FAILED' = 'FAILED',
  /**환불 처리중 */
  'PENDING' = 'PENDING',
  /**부분환불 실패 */
  'PARTIAL_FAILED' = 'PARTIAL_FAILED',
  /**환불 완료 */
  'COMPLETED' = 'COMPLETED',
}

type CancelType = {
  /** 결제를 취소한 금액입니다. */
  cancelAmount: number;
  /** 결제를 취소한 이유입니다.
   * */
  cancelReason: string;
  /** 면세 처리된 금액입니다. */
  taxFreeAmount: number;
  /** 과세 처리된 금액입니다. */
  taxAmount?: number;
  /** 결제취소 후 환불 가능한 잔액입니다. */
  refundableAmount: number;
  /** 결제취소가 일어난 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss+00:00`입니다. */
  canceledAt: string;
};

type PaymentCardType = {
  /**
  카드사 코드입니다. 
  */
  company: string;
  /** 카드번호입니다. 번호의 일부는 마스킹 되어 있습니다. */
  number: string;
  /** 할부 개월 수입니다. 일시불인 경우 0입니다. */
  installmentPlanMonths: number;
  /** 카드사 승인 번호입니다. */
  approveNo: string;
  /** 카드사 포인트를 사용했는지 여부입니다. */
  useCardPoint: boolean;
  /** 카드 종류입니다. */
  cardType: '신용' | '체크' | '기프트';
  /** 카드의 소유자 타입입니다. */
  ownerType: '개인' | '법인';
  /** 카드 매출전표 조회 페이지 주소입니다. */
  receiptUrl: string;
  /** 카드 결제의 매입 상태입니다. */
  acquireStatus: CardAcquireStatus;
  /** 무이자 할부의 적용 여부입니다. */
  isInterestFree: boolean;
};

type PaymentVirtualAccountType = {
  /**가상계좌 타입을 나타냅니다. 일반 , 고정 중 하나입니다. */
  accountType: '일반' | '고정';
  /** 발급된 계좌번호입니다. */
  accountNumber: string;
  /** 가상계좌를 발급한 은행입니다. */
  bank: string;
  /** 가상계좌를 발급한 고객 이름입니다. */
  customerName: string;
  /**입금 기한입니다. */
  dueDate: string;
  /**환불처리 상태입니다. */
  refundStatus: VirtualAccountRefundStatus;
  /** 가상계좌가 만료되었는지 여부입니다. */
  expired: boolean;
  /** 정산 상태입니다. 정산이 아직 되지 않았다면 `INCOMPLETE`, 정산이 완료됐다면 `COMPLETE` 값이 들어옵니다. */
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
};

type PaymentMobilePhoneType = {
  /** 휴대폰 통신사 정보입니다. */
  carrier: string;
  /** 결제에 사용한 휴대폰 번호입니다. */
  customerMobilePhone: string;

  /** 정산 상태입니다. 정산이 아직 되지 않았다면 `INCOMPLETE`, 정산이 완료됐다면 `COMPLETE` 값이 들어옵니다. */
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
};

type PaymentGiftCertificateType = {
  /**결제 승인번호입니다. */
  approveNo: string;

  /** 정산 상태입니다. 정산이 아직 되지 않았다면 `INCOMPLETE`, 정산이 완료됐다면 `COMPLETE` 값이 들어옵니다. */
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
};
type PaymentTransferType = {
  /** 이체할 은행입니다. 은행 코드를 참고하세요. */
  bank: string;

  /** 정산 상태입니다. 정산이 아직 되지 않았다면 `INCOMPLETE`, 정산이 완료됐다면 `COMPLETE` 값이 들어옵니다. */
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
};

type CashReceiptType = {
  /** 현금영수증의 종류입니다. 소득공제, 지출증빙 중 하나의 값입니다. */
  type: '소득공제' | '지출증빙';
  /** 현금영수증 처리된 금액입니다. */
  amount: number;
  /** 면세 처리된 금액입니다. */
  taxFreeAmount: number;
  /** 현금영수증 발급번호입니다. */
  issueNumber: string;
  /** 현금영수증 조회 페이지 주소입니다. */
  receiptUrl: string;
};
export type PaymentType = {
  /** Payment 객체의 응답 버전입니다. */
  version: string;
  /** 결제 건에 대한 고유한 키 값입니다. */
  paymentKey: string;
  /** 결제 타입 정보입니다.
   *
   * `NORMAL`(일반결제), `BILLING`(자동결제), `CONNECTPAY`(커넥트페이) 중 하나입니다.   */
  type: 'NORMAL' | 'BILLING' | 'CONNECTPAY';
  /** 간편결제로 결제한 경우 간편결제 타입 정보입니다. `토스결제`, `페이코`, `삼성페이` 같은 형태입니다. */
  easyPay: string;
  /** 가맹점에서 주문건에 대해 발급한 고유 ID입니다. */
  orderId: string;
  /** 결제에 대한 주문명입니다. 예를 들면 `생수 외 1건` 같은 형식입니다. **최소 1글자 이상 100글자 이하**여야 합니다.   */
  orderName: string;
  /** 가맹점 ID입니다. */
  mId: string;
  /** 결제할 때 사용한 통화 단위입니다. 원화인 `KRW`만 사용합니다. */
  currency: string;

  /** 총 결제금액입니다. */
  totalAmount: number;

  /** 취소할 수 있는 금액(잔고)입니다. */
  balanceAmount: number;

  /** 결제 처리 상태입니다. */
  status: PaymentStatus;

  /** 결제요청이 일어난 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss+00:00` 으로 돌아옵니다. */
  requestedAt: string;

  /** 결제승인이 일어난 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss+00:00` 으로 돌아옵니다. */
  approvedAt?: string;

  /** 카드사의 즉시 할인 프로모션 정보입니다. 즉시 할인 프로모션이 적용됐을 때만 생성됩니다. */
  discount?: {
    /**
     * 카드사의 즉시 할인 프로모션을 적용한 금액입니다.
     */
    amount: number;
  };
  /** 에스크로 사용 여부입니다. */
  useEscrow: boolean;

  /** 결제취소 이력이 담기는 배열입니다. */
  cancels: CancelType[];

  card?: PaymentCardType;
  virtualAccount?: PaymentVirtualAccountType;
  /** 가상계좌로 결제할 때 전달되는 입금 콜백을 검증하기 위한 값입니다. */
  secret?: string;

  mobilePhone?: PaymentMobilePhoneType;

  giftCertificate?: PaymentGiftCertificateType;
  transfer?: PaymentTransferType;
  cashReceipt?: CashReceiptType;

  /** 거래 건에 대한 고유한 키 값입니다. */
  transactionKey: string;
  /** 공급가액입니다. */
  suppliedAmount: number;

  /** 부가세입니다 */
  vat: number;

  /** 문화비로 지출했는지 여부입니다. (도서구입, 공연 티켓 박물관/미술관 입장권 등) */
  cultureExpense: boolean;
  /** 면세금액입니다. */
  taxFreeAmount: number;
};

export type PaymentCancelRequestType = {
  /** 결제를 취소하는 이유입니다. */
  cancelReason: string;
  /** 취소할 금액입니다. 값이 없으면 전액취소됩니다. */
  cancelAmount?: number;
  /** 현재 환불 가능한 금액입니다. 취소 요청을 안전하게 처리하기 위해서 사용합니다.
   * 환불 가능한 잔액 정보가 `refundableAmount의` 값과 다른 경우 해당 요청을 처리하지 않고 에러를 내보냅니다.
   *
   * 토스페이먼츠 서버에서는 요청에 포함된 `refundableAmount`와 실제 환불 가능한 잔액 정보가 서로 다른 경우 응답으로 에러를 보냅니다.
   *
   * 현재 환불할 수 있는 잔액을 `refundableAmount` 값으로 담아 보내면, 이 값을 확인해서 결제취소가 중복으로 요청되거나 결제된 금액보다 더 많이 취소하는 등의 상황을 방지합니다. */
  refundableAmount?: number;
  /**
   * 결제취소 이후 금액이 환불될 계좌의 정보입니다. **가상계좌 결제에 대해서만 필수**입니다.
   *
   * 다른 결제수단으로 이루어진 결제를 취소할 때는 사용하지 않습니다.
   */
  refundReceiveAccount?: {
    /** 취소 금액을 환불받을 계좌의 은행 코드입니다. 은행 코드를 참고하세요. */
    bank: string;
    /** 취소 금액을 환불받을 계좌의 계좌번호 입니다. - 없이 숫자만 넣어야 합니다. */
    accountNumber: string;
    /** 취소 금액을 환불받을 계좌의 예금주 이름입니다. */
    holderName: string;
  };
  /** 과세금액입니다. 값이 없으면 전액 과세로 판단합니다. */
  taxAmount?: number;
  /** 면세금액입니다. */
  taxFreeAmount?: number;
};

export const getPaymentByPaymentId = (paymentId: string, options: { secretkey: string }) =>
  TPApiRequest<PaymentType>({
    method: 'GET',
    url: `/${V1_PAYMENT_URL}/${paymentId}`,
    secretkey: options.secretkey,
  });

export const getPaymentByOrderId = (orderId: string, options: { secretkey: string }) =>
  TPApiRequest<PaymentType>({
    method: 'GET',
    url: `/${V1_PAYMENT_URL}/orders/${orderId}`,
    secretkey: options.secretkey,
  });

export const postCancelPayment = (
  paymentId: string,
  data: PaymentCancelRequestType,
  options: { secretkey: string },
) =>
  TPApiRequest<PaymentType>({
    method: 'POST',
    url: `/${V1_PAYMENT_URL}/${paymentId}/cancel`,
    data,
    secretkey: options.secretkey,
  });
