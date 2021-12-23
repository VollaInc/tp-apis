import TPApiRequest from '../utils/TPApiRequest';
import { TPCommonPaginationType } from './common';

/**
 * 정산 정보를 담고있는 객체입니다.
 *
 * 하나의 결제 건을 기준으로 정산 정보를 담고 있어 `paymentKey`로 결제 기록과 연결됩니다.
 */
export type SettlementType = {
  /** 가맹점 ID입니다. */
  mId: string;
  /** 결제 건에 대한 고유한 키 값입니다. */
  paymentKey: string;
  /** 가맹점에서 주문건에 대해 발급한 고유 ID입니다. */
  orderId: string;
  /** 결제할 때 사용한 통화 단위입니다. 원화인 `KRW`만 사용합니다. */
  currency: 'KRW';
  /** 결제할 때 사용한 결제수단입니다. */
  method:
    | '카드'
    | '가상계좌'
    | '휴대폰'
    | '계좌이체'
    | '상품권(문화상품권, 도서문화상품권, 게임문화상품권)';
  /** 결제한 금액입니다. */
  amount: number;
  /** 할부 수수료 금액입니다. */
  interestFee: number;
  /** 결제 수수료 금액입니다. */
  fee: number;
  /** 결제 수수료의 공급가액입니다. */
  supplyAmount: number;
  /** 결제 수수료 부가세입니다. */
  vat: number;
  /** 지급 금액입니다. 결제금액 `amount` 에서 수수료인 `fee`를 제외한 금액입니다. */
  payOutAmount: number;
  /**
   * 거래가 승인된 시점의 날짜와 시간 정보입니다.
   * ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss+00:00`입니다.
   * @example '2021-01-01T00:00:00+09:00'
   */
  approvedAt: string;
  /**
   * 지급 금액을 정산한 날짜 정보입니다.
   * `YYYY-MM-DD` 형식입니다. */
  soldDate: string;
  /**
   * 정산 지급 날짜 정보입니다.
   * `YYYY-MM-DD` 형식입니다. */
  paidOutDate: string;
};

const V1_SETTLEMENT_URL = '/v1/settlements';

export const getSettlements = (
  params: TPCommonPaginationType & {
    /** 조회할 페이지 값입니다. 최소값은 1입니다. */
    page?: number;
    /**
     * 한 페이지에서 응답으로 보여줄 정산기록 개수를 의미합니다. 기본값은 `100`이고 설정할 수 있는 최대값은 `10000`입니다.
     * @default 100
     */
    size?: number;
  },
  options: { secretkey: string },
) =>
  TPApiRequest<SettlementType[]>({
    method: 'GET',
    url: V1_SETTLEMENT_URL,
    params,
    secretkey: options.secretkey,
  });

/**
 * 카드 결제 승인정보를 수동으로 카드사에 전송하는 방식으로 정산합니다.
 * 요청에 성공하면 `HTTP 200 OK` 응답과 함께 빈 본문이 돌아옵니다.
 *
 */
export const postSettlements = (
  data: {
    /** 조회할 결제 건에 대한 키 값 입니다.*/
    paymentKey: string;
  },
  options: { secretkey: string },
) =>
  TPApiRequest({
    method: 'POST',
    url: V1_SETTLEMENT_URL,
    data,
    secretkey: options.secretkey,
  });
