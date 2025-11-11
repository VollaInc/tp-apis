/**
 * 토스페이먼츠 카드 프로모션 API (v1)
 *
 * 카드사 프로모션 정보 조회 기능을 제공합니다.
 * 즉시 할인 프로모션과 무이자 할부 프로모션을 조회할 수 있습니다.
 *
 * ## API 엔드포인트
 * - `GET /v1/promotions/card` - 카드 프로모션 조회
 *
 * @see https://docs.tosspayments.com/reference#프로모션
 * @module CardPromotion
 */

import TPApiRequest from '../utils/TPApiRequest';

/**
 * 즉시 할인 이벤트 정보
 */
export type DiscountCardEventsType = {
  cardCompany: string;
  minimumPaymentAmount: number;
  maximumPaymentAmount: number;
  discountCode: string;
  discountAmount: number;
  balance: number;
  dueDate: string;
};

/**
 * 카드사 별 무이자 할부 정보
 */
export type InterestFreeCardEventsType = {
  cardCompany: string;
  dueDate: string;
  installmentFreeMonths: number[];
  minimumPaymentAmount: number;
};

const V1_PROMOTIONS_CARD_URL = '/v1/promotions/card';

/**
 * 카드 프로모션 조회
 *
 * 현재 진행 중인 카드사 프로모션 정보를 조회합니다.
 * 즉시 할인 이벤트와 무이자 할부 이벤트 정보를 포함합니다.
 * 가맹점에서 결제 페이지에 프로모션 정보를 표시할 때 사용할 수 있습니다.
 *
 * @param options - secretkey와 payType을 포함한 옵션 객체
 * @param options.secretkey - 토스페이먼츠 시크릿 키
 * @param options.payType - 결제 타입 ('NORMAL' 또는 'CONNECTPAY', 선택사항)
 * @returns 즉시 할인 카드 목록과 무이자 할부 카드 목록을 포함한 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%B9%B4%EB%93%9C-%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * // 모든 카드 프로모션 조회
 * const promotions = await getCardPromotions({
 *   secretkey: 'test_sk_...'
 * });
 *
 * // 즉시 할인 프로모션 출력
 * promotions.discountCards.forEach(card => {
 *   console.log(`${card.cardCompany}: ${card.discountAmount}원 할인`);
 * });
 *
 * // 무이자 할부 프로모션 출력
 * promotions.interestFreeCards.forEach(card => {
 *   console.log(`${card.cardCompany}: ${card.installmentFreeMonths.join(', ')}개월 무이자`);
 * });
 *
 * // 특정 결제 타입의 프로모션 조회
 * const normalPromotions = await getCardPromotions({
 *   secretkey: 'test_sk_...',
 *   payType: 'NORMAL'
 * });
 * ```
 */
export const getCardPromotions = ({
  secretkey,
  payType,
}: {
  secretkey: string;
  payType?: 'NORMAL' | 'CONNECTPAY';
}) =>
  TPApiRequest<{
    discountCards: DiscountCardEventsType[];
    interestFreeCards: InterestFreeCardEventsType[];
  }>({
    method: 'GET',
    url: V1_PROMOTIONS_CARD_URL,
    data: payType ? { payType } : undefined,
    secretkey,
  });
