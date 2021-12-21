import TPCommonRequest from './TPCommonRequest';

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

export const getCardPromotions = ({
  secretkey,
  payType,
}: {
  secretkey: string;
  payType?: 'NORMAL' | 'CONNECTPAY';
}) =>
  TPCommonRequest<{
    discountCards: DiscountCardEventsType[];
    interestFreeCards: InterestFreeCardEventsType[];
  }>({
    method: 'GET',
    url: V1_PROMOTIONS_CARD_URL,
    data: payType ? { payType } : undefined,
    secretkey,
  });
