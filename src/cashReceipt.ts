/**
 * 토스페이먼츠 현금영수증 API (v1)
 *
 * 현금영수증 발급, 취소 기능을 제공합니다.
 *
 * ## API 엔드포인트
 * - `POST /v1/cash-receipts` - 현금영수증 발급
 * - `POST /v1/cash-receipts/{receiptKey}/cancel` - 현금영수증 발급 취소
 *
 * @see https://docs.tosspayments.com/reference#현금영수증
 * @module CashReceipt
 */

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

/**
 * 현금영수증 발급 요청
 *
 * 현금으로 결제한 건에 대해 현금영수증을 발급합니다.
 * 소득공제나 지출증빙 용도로 발급할 수 있으며, 발급을 위해서는 개인 식별 번호(휴대폰 번호, 주민등록번호, 사업자등록번호 등)가 필요합니다.
 *
 * @param data - 현금영수증 발급 요청 데이터 (금액, orderId, 식별번호 등)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 발급된 CashReceipt 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%B0%9C%EA%B8%89-%EC%9A%94%EC%B2%AD
 *
 * @example
 * ```typescript
 * // 소득공제용 현금영수증 발급 (휴대폰 번호)
 * const cashReceipt = await requestCashReceipt({
 *   amount: 10000,
 *   orderId: 'order-12345',
 *   orderName: '생수 외 1건',
 *   registrationNumber: '01012345678',
 *   type: '소득공제'
 * }, { secretkey: 'test_sk_...' });
 *
 * // 지출증빙용 현금영수증 발급 (사업자등록번호)
 * const businessReceipt = await requestCashReceipt({
 *   amount: 50000,
 *   orderId: 'order-67890',
 *   orderName: '사무용품 외 2건',
 *   registrationNumber: '1234567890',
 *   type: '지출증빙',
 *   taxFreeAmount: 5000
 * }, { secretkey: 'test_sk_...' });
 * ```
 */
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

/**
 * 현금영수증 발급 취소 요청
 *
 * 발급된 현금영수증을 취소합니다. `receiptKey`로 특정 현금영수증을 지정하여 취소할 수 있습니다.
 * 부분 취소는 지원하지 않으며, 전액 취소만 가능합니다.
 *
 * @param data - receiptKey와 금액 정보
 * @param data.receiptKey - 현금영수증 발급 키
 * @param data.amount - 취소할 금액 (전액 취소 시 생략 가능)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 취소된 CashReceipt 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%B0%9C%EA%B8%89-%EC%B7%A8%EC%86%8C-%EC%9A%94%EC%B2%AD
 *
 * @example
 * ```typescript
 * // 현금영수증 취소
 * const canceledReceipt = await cancelCashReceipt({
 *   receiptKey: 'receipt-key-example',
 *   amount: 10000
 * }, { secretkey: 'test_sk_...' });
 *
 * console.log(canceledReceipt.canceledAt); // 취소 시간 확인
 * ```
 */
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
