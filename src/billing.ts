/**
 * 토스페이먼츠 자동결제(빌링) API (v1)
 *
 * 빌링키 발급, 자동결제 승인, 빌링키 조회 및 삭제 기능을 제공합니다.
 * 정기결제, 구독 서비스 등에 사용할 수 있습니다.
 *
 * ## API 엔드포인트
 * - `POST /v1/billing/authorizations/issue` - authKey로 빌링키 발급
 * - `POST /v1/billing/{billingKey}` - 빌링키로 자동결제 승인
 * - `GET /v1/billing/authorizations/{authKey}` - authKey로 승인 정보 조회
 * - `DELETE /v1/billing/{billingKey}` - 빌링키 삭제
 *
 * @see https://docs.tosspayments.com/reference#자동결제
 * @module Billing
 */

import TPApiRequest from '../utils/TPApiRequest';
import { PaymentCardType, PaymentStatus } from './payment';

const V1_BILLING_URL = '/v1/billing';
const V1_BILLING_AUTH_URL = '/v1/billing/authorizations';

/**
 * 빌링키 발급 방법
 */
export enum BillingMethod {
  /** 카드 */
  'CARD' = 'CARD',
  /** 휴대폰 */
  'MOBILE_PHONE' = 'MOBILE_PHONE',
}

/**
 * 빌링키 객체
 *
 * 자동결제에 사용되는 빌링키 정보를 담고 있습니다.
 * 빌링키는 고객의 결제 수단을 등록한 후 발급받으며, 이후 자동결제에 사용됩니다.
 * customerKey와 1:1 관계를 가지며, 같은 customerKey로는 하나의 빌링키만 발급할 수 있습니다.
 */
export type BillingType = {
  /** 가맹점 ID입니다. Toss Payments에서 발급합니다. */
  mId: string;
  /** 가맹점에서 사용하는 고객의 고유 ID입니다. 빌링키와 1:1 관계를 가집니다. 최대 길이는 300자입니다. */
  customerKey: string;
  /** 자동결제에 사용되는 빌링키입니다. 한 번 발급되면 삭제하기 전까지 계속 사용할 수 있습니다. */
  billingKey: string;
  /** 빌링키 발급 시 사용한 인증 키입니다. 결제 위젯이나 SDK에서 고객이 결제 수단을 등록하면 발급됩니다. */
  authKey: string;
  /** 카드 정보입니다. method가 'CARD'일 때만 제공됩니다. 카드사, 카드번호 등의 정보를 포함합니다. */
  card?: PaymentCardType;
  /** 빌링키 발급 방법입니다. 'CARD'(카드) 또는 'MOBILE_PHONE'(휴대폰) 중 하나입니다. */
  method: BillingMethod | string;
  /** 빌링키가 발급된 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss±hh:mm`입니다. */
  authenticatedAt: string;
};

/**
 * 빌링키 발급 요청 데이터
 *
 * authKey를 사용하여 빌링키를 발급받습니다.
 * authKey는 고객이 결제 위젯이나 SDK로 결제 수단을 등록한 후 받을 수 있습니다.
 */
export type BillingIssueRequestType = {
  /** 결제 승인 후 발급된 인증 키입니다. 결제 위젯 또는 SDK에서 고객이 결제 수단을 등록하면 받을 수 있습니다. */
  authKey: string;
  /** 가맹점에서 사용하는 고객의 고유 ID입니다. 빌링키와 1:1 관계입니다. 최대 길이는 300자입니다.
   * 영문 대소문자, 숫자, 특수문자 `-`, `_`, `=`로 이루어진 문자열이어야 합니다. */
  customerKey: string;
};

/**
 * 빌링키로 자동결제 승인 요청 데이터
 *
 * 발급받은 빌링키를 사용하여 자동결제를 승인할 때 사용하는 데이터입니다.
 * 고객의 추가 인증 없이 서버에서 직접 결제를 진행할 수 있습니다.
 */
export type BillingPaymentRequestType = {
  /** 가맹점에서 사용하는 고객의 고유 ID입니다. 빌링키 발급 시 사용한 customerKey와 동일해야 합니다. */
  customerKey: string;
  /** 결제할 금액입니다. 최소 결제 금액은 100원입니다. */
  amount: number;
  /** 가맹점에서 주문건에 대해 발급한 고유 ID입니다.
   * 영문 대소문자, 숫자, 특수문자 `-`, `_`, `=`로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다. */
  orderId: string;
  /** 결제에 대한 주문명입니다. 예를 들면 `생수 외 1건` 같은 형식입니다.
   * 최소 1글자 이상 100글자 이하여야 합니다. */
  orderName: string;
  /** 고객 이메일 주소입니다. 결제 결과를 이메일로 받을 수 있습니다. 최대 길이는 100자입니다. */
  customerEmail?: string;
  /** 고객 이름입니다. 최대 길이는 100자입니다. */
  customerName?: string;
  /** 과세금액입니다. 값이 없으면 전액 과세로 판단합니다. amount와 taxFreeAmount의 합보다 작거나 같아야 합니다. */
  taxAmount?: number;
  /** 면세금액입니다. amount보다 작거나 같아야 합니다. */
  taxFreeAmount?: number;
  /** 결제 정보와 함께 저장할 추가 정보입니다. 최대 5개의 key-value 쌍을 저장할 수 있습니다.
   * key는 최대 40자, value는 최대 500자입니다. */
  metadata?: Record<string, string>;
};

/**
 * 빌링키로 결제한 Payment 응답 타입
 *
 * 자동결제가 승인되면 반환되는 결제 정보입니다.
 * 일반 결제 응답과 유사하지만 type이 'BILLING'으로 표시됩니다.
 */
export type BillingPaymentType = {
  /** 가맹점 ID입니다. Toss Payments에서 발급합니다. */
  mId: string;
  /** 결제 건에 대한 고유한 키 값입니다. 결제 조회 및 취소 시 사용합니다. */
  paymentKey: string;
  /** 가맹점에서 주문건에 대해 발급한 고유 ID입니다. */
  orderId: string;
  /** 결제에 대한 주문명입니다. */
  orderName: string;
  /** 결제 타입 정보입니다. 자동결제의 경우 'BILLING'입니다. */
  type: 'BILLING';
  /** 결제할 때 사용한 통화 단위입니다. 원화인 `KRW`만 사용합니다. */
  currency: 'KRW';
  /** 결제할 때 사용한 결제수단입니다. '카드' 또는 '휴대폰' 중 하나입니다. */
  method: '카드' | '휴대폰';
  /** 총 결제금액입니다. */
  totalAmount: number;
  /** 취소할 수 있는 금액(잔고)입니다. 부분 취소 시 감소합니다. */
  balanceAmount: number;
  /** 결제 처리 상태입니다. 'READY', 'IN_PROGRESS', 'WAITING_FOR_DEPOSIT', 'DONE', 'CANCELED', 'PARTIAL_CANCELED', 'ABORTED', 'EXPIRED' 중 하나입니다. */
  status: PaymentStatus;
  /** 결제승인이 일어난 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss±hh:mm`입니다. */
  approvedAt: string;
  /** 결제요청이 일어난 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss±hh:mm`입니다. */
  requestedAt: string;
  /** 카드 정보입니다. method가 '카드'일 때만 제공됩니다. 카드사, 카드번호 등의 정보를 포함합니다. */
  card?: PaymentCardType;
  /** 과세금액입니다. 값이 없으면 전액 과세로 처리됩니다. */
  taxAmount?: number;
  /** 면세금액입니다. */
  taxFreeAmount?: number;
  /** 공급가액입니다. totalAmount에서 부가세를 제외한 금액입니다. */
  suppliedAmount: number;
  /** 부가세입니다. */
  vat: number;
};

/**
 * authKey로 빌링키 발급
 *
 * 고객이 결제 수단을 등록하고 받은 authKey를 사용하여 빌링키를 발급받습니다.
 * 발급받은 빌링키는 자동결제(정기결제)에 사용할 수 있습니다.
 *
 * **중요사항**:
 * - authKey는 결제 위젯 또는 SDK에서 고객이 결제 수단을 등록한 후 발급됩니다.
 * - customerKey는 빌링키와 1:1 관계를 가지므로, 같은 customerKey로는 하나의 빌링키만 발급할 수 있습니다.
 * - 이미 같은 customerKey로 빌링키가 발급되어 있다면, 기존 빌링키는 자동으로 삭제됩니다.
 * - 빌링키는 한 번 발급되면 삭제하기 전까지 계속 사용할 수 있습니다.
 *
 * **API 엔드포인트**: `POST /v1/billing/authorizations/issue`
 *
 * @param data - 빌링키 발급 요청 데이터 (authKey, customerKey)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns Billing 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#authkey%EB%A1%9C-%EB%B9%8C%EB%A7%81%ED%82%A4-%EB%B0%9C%EA%B8%89
 *
 * @example
 * ```typescript
 * // authKey로 빌링키 발급
 * const billing = await postIssueBillingKey({
 *   authKey: 'auth-key-received-from-widget',
 *   customerKey: 'customer-unique-id-001'
 * }, { secretkey: 'test_sk_...' });
 *
 * console.log(`빌링키: ${billing.billingKey}`);
 * console.log(`발급일시: ${billing.authenticatedAt}`);
 * console.log(`결제 수단: ${billing.method}`);
 *
 * // 카드로 발급받은 경우 카드 정보 확인
 * if (billing.card) {
 *   console.log(`카드사: ${billing.card.issuerCode}`);
 *   console.log(`카드번호: ${billing.card.number}`);
 * }
 * ```
 */
export const postIssueBillingKey = async (
  data: BillingIssueRequestType,
  options: { secretkey: string },
) =>
  TPApiRequest<BillingType>({
    method: 'POST',
    url: `${V1_BILLING_AUTH_URL}/issue`,
    data,
    secretkey: options.secretkey,
  });

/**
 * 빌링키로 자동결제 승인
 *
 * 발급받은 빌링키를 사용하여 자동으로 결제를 승인합니다.
 * 고객의 추가 인증 없이 서버에서 직접 결제를 진행할 수 있습니다.
 *
 * **중요사항**:
 * - customerKey는 빌링키 발급 시 사용한 값과 동일해야 합니다.
 * - 최소 결제 금액은 100원입니다.
 * - orderId는 가맹점에서 고유하게 관리해야 하며, 중복될 수 없습니다.
 * - 결제 승인 후 일반 결제와 동일하게 취소할 수 있습니다.
 * - taxAmount와 taxFreeAmount를 지정하지 않으면 전액 과세로 처리됩니다.
 * - metadata에는 최대 5개의 key-value 쌍을 저장할 수 있습니다.
 *
 * **API 엔드포인트**: `POST /v1/billing/{billingKey}`
 *
 * @param billingKey - 발급받은 빌링키
 * @param data - 자동결제 승인 요청 데이터 (금액, orderId, orderName 등)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns BillingPayment 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EB%B9%8C%EB%A7%81%ED%82%A4%EB%A1%9C-%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
 *
 * @example
 * ```typescript
 * // 정기결제 실행
 * const payment = await postBillingPayment('billing-key-example', {
 *   customerKey: 'customer-unique-id-001',
 *   amount: 9900,
 *   orderId: 'subscription-202401-001',
 *   orderName: '프리미엄 구독 - 2024년 1월',
 *   customerEmail: 'customer@example.com',
 *   customerName: '홍길동'
 * }, { secretkey: 'test_sk_...' });
 *
 * console.log(`결제 상태: ${payment.status}`);
 * console.log(`결제 금액: ${payment.totalAmount}원`);
 * console.log(`결제 키: ${payment.paymentKey}`);
 *
 * // 과세/면세 금액 지정 (예: 도서 구매)
 * const taxPayment = await postBillingPayment('billing-key-example', {
 *   customerKey: 'customer-unique-id-001',
 *   amount: 11000,
 *   orderId: 'order-202401-002',
 *   orderName: '도서 구매',
 *   taxAmount: 10000,
 *   taxFreeAmount: 1000
 * }, { secretkey: 'test_sk_...' });
 *
 * // metadata 사용
 * const metadataPayment = await postBillingPayment('billing-key-example', {
 *   customerKey: 'customer-unique-id-001',
 *   amount: 9900,
 *   orderId: 'subscription-202401-003',
 *   orderName: '구독 결제',
 *   metadata: {
 *     subscriptionId: 'sub_123456',
 *     planType: 'premium'
 *   }
 * }, { secretkey: 'test_sk_...' });
 * ```
 */
export const postBillingPayment = async (
  billingKey: string,
  data: BillingPaymentRequestType,
  options: { secretkey: string },
) =>
  TPApiRequest<BillingPaymentType>({
    method: 'POST',
    url: `${V1_BILLING_URL}/${billingKey}`,
    data,
    secretkey: options.secretkey,
  });

/**
 * authKey로 승인 정보 조회
 *
 * authKey를 사용하여 빌링키 발급 전 승인 정보를 조회합니다.
 * 빌링키가 이미 발급되었는지 확인할 수 있습니다.
 *
 * **사용 시나리오**:
 * - 고객이 결제 수단을 등록한 후, 빌링키를 발급받기 전에 승인 정보를 확인하고 싶을 때
 * - authKey로 이미 빌링키가 발급되었는지 중복 확인이 필요할 때
 * - 빌링키 발급 전 등록된 결제 수단 정보를 미리 확인하고 싶을 때
 *
 * **API 엔드포인트**: `GET /v1/billing/authorizations/{authKey}`
 *
 * @param authKey - 결제 승인 후 발급된 인증 키
 * @param options - secretkey를 포함한 옵션 객체
 * @returns Billing 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#authkey%EB%A1%9C-%EC%8A%B9%EC%9D%B8-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * // authKey로 승인 정보 조회
 * const authorization = await getBillingAuthorizationByAuthKey('auth-key-example', {
 *   secretkey: 'test_sk_...'
 * });
 *
 * if (authorization.billingKey) {
 *   console.log('빌링키가 이미 발급되었습니다:', authorization.billingKey);
 * } else {
 *   console.log('아직 빌링키가 발급되지 않았습니다.');
 * }
 *
 * // 등록된 결제 수단 확인
 * console.log(`결제 수단: ${authorization.method}`);
 * if (authorization.card) {
 *   console.log(`카드사: ${authorization.card.issuerCode}`);
 *   console.log(`카드번호: ${authorization.card.number}`);
 * }
 * ```
 */
export const getBillingAuthorizationByAuthKey = async (
  authKey: string,
  options: { secretkey: string },
) =>
  TPApiRequest<BillingType>({
    method: 'GET',
    url: `${V1_BILLING_AUTH_URL}/${authKey}`,
    secretkey: options.secretkey,
  });

/**
 * 빌링키 삭제
 *
 * 발급받은 빌링키를 삭제합니다.
 * 고객이 자동결제를 해지하거나 카드 정보를 삭제할 때 사용합니다.
 * 삭제된 빌링키는 다시 사용할 수 없습니다.
 *
 * **중요사항**:
 * - 빌링키를 삭제하면 해당 빌링키로는 더 이상 자동결제를 할 수 없습니다.
 * - 삭제된 빌링키는 복구할 수 없으며, 다시 자동결제를 하려면 새로 발급받아야 합니다.
 * - customerKey는 선택사항이지만, 보안을 위해 제공하는 것을 권장합니다.
 * - 이미 삭제된 빌링키를 다시 삭제하려고 하면 에러가 발생합니다.
 *
 * **사용 시나리오**:
 * - 고객이 구독을 해지할 때
 * - 고객이 등록한 카드를 삭제하고 싶을 때
 * - 고객이 다른 카드로 변경하기 전에 기존 빌링키를 삭제할 때
 * - 서비스에서 고객 계정을 삭제할 때
 *
 * **API 엔드포인트**: `DELETE /v1/billing/{billingKey}`
 *
 * @param billingKey - 삭제할 빌링키
 * @param options - secretkey를 포함한 옵션 객체
 * @param customerKey - 가맹점에서 사용하는 고객의 고유 ID (선택사항, 보안을 위해 제공 권장)
 * @returns 삭제 성공 시 빈 응답을 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EB%B9%8C%EB%A7%81%ED%82%A4-%EC%82%AD%EC%A0%9C
 *
 * @example
 * ```typescript
 * // 빌링키 삭제 (기본)
 * await deleteBillingKey('billing-key-example', {
 *   secretkey: 'test_sk_...'
 * });
 * console.log('자동결제가 해지되었습니다.');
 *
 * // customerKey와 함께 삭제 (권장)
 * await deleteBillingKey('billing-key-example', {
 *   secretkey: 'test_sk_...'
 * }, 'customer-unique-id-001');
 * console.log('고객의 자동결제가 안전하게 해지되었습니다.');
 *
 * // 구독 해지 시나리오
 * try {
 *   await deleteBillingKey(user.billingKey, {
 *     secretkey: 'test_sk_...'
 *   }, user.customerKey);
 *
 *   // 데이터베이스에서 구독 정보 업데이트
 *   await updateUserSubscription(user.id, {
 *     status: 'CANCELED',
 *     billingKey: null,
 *     canceledAt: new Date()
 *   });
 * } catch (error) {
 *   console.error('빌링키 삭제 실패:', error);
 * }
 * ```
 */
export const deleteBillingKey = async (
  billingKey: string,
  options: { secretkey: string },
  customerKey?: string,
) =>
  TPApiRequest<void>({
    method: 'DELETE',
    url: `${V1_BILLING_URL}/${billingKey}`,
    params: customerKey ? { customerKey } : undefined,
    secretkey: options.secretkey,
  });
