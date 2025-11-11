/**
 * 토스페이먼츠 정산 API (v1)
 *
 * 정산 내역 조회 및 수동 정산 요청 기능을 제공합니다.
 *
 * ## API 엔드포인트
 * - `GET /v1/settlements` - 정산 조회
 * - `POST /v1/settlements` - 수동 정산 요청
 *
 * @see https://docs.tosspayments.com/reference#정산
 * @module Settlement
 */

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

/**
 * 정산 조회
 *
 * 특정 기간 동안의 정산 내역을 조회합니다.
 * 정산 내역에는 결제 금액, 수수료, 실제 지급 금액 등이 포함됩니다.
 * 날짜 범위를 지정하여 조회할 수 있으며, 페이지네이션을 지원합니다.
 *
 * @param params - 정산 조회 파라미터 (날짜 범위, 페이지네이션 등)
 * @param params.startDate - 조회 시작 날짜 (YYYY-MM-DD 형식)
 * @param params.endDate - 조회 종료 날짜 (YYYY-MM-DD 형식)
 * @param params.page - 조회할 페이지 값 (최소값: 1)
 * @param params.size - 한 페이지에서 응답으로 보여줄 정산기록 개수 (기본값: 100, 최대값: 10000)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns Settlement 객체 배열을 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%A0%95%EC%82%B0-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * // 특정 기간의 정산 조회
 * const settlements = await getSettlements({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   page: 1,
 *   size: 100
 * }, { secretkey: 'test_sk_...' });
 *
 * // 정산 내역 분석
 * settlements.forEach(settlement => {
 *   console.log(`주문번호: ${settlement.orderId}`);
 *   console.log(`결제금액: ${settlement.amount}원`);
 *   console.log(`수수료: ${settlement.fee}원`);
 *   console.log(`지급금액: ${settlement.payOutAmount}원`);
 *   console.log(`정산일: ${settlement.soldDate}`);
 *   console.log(`지급일: ${settlement.paidOutDate}`);
 * });
 * ```
 */
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
 * 수동 정산 요청
 *
 * 카드 결제 승인정보를 수동으로 카드사에 전송하는 방식으로 정산합니다.
 * 일반적으로 자동 정산이 이루어지지만, 특정 상황에서 수동 정산이 필요할 때 사용합니다.
 * 요청에 성공하면 `HTTP 200 OK` 응답과 함께 빈 본문이 돌아옵니다.
 *
 * @param data - 수동 정산 요청 데이터
 * @param data.paymentKey - 정산할 결제 건에 대한 고유 키 값
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 요청 성공 시 빈 응답을 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%88%98%EB%8F%99-%EC%A0%95%EC%82%B0-%EC%9A%94%EC%B2%AD
 *
 * @example
 * ```typescript
 * // 특정 결제 건에 대한 수동 정산 요청
 * await postSettlements({
 *   paymentKey: 'payment-key-example'
 * }, { secretkey: 'test_sk_...' });
 *
 * console.log('수동 정산 요청이 완료되었습니다.');
 * ```
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
