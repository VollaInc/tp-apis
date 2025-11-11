import TPApiRequest from '../utils/TPApiRequest';
import { TPCommonPaginationType } from './common';
import { PaymentStatus } from './payment';

export type TransactionType = {
  /** 가맹점 ID입니다. */
  mId: string;
  /** 가맹점에서 사용하는 고객의 고유 ID입니다. */
  customerKey: string;
  /** 가맹점에서 주문건에 대해 발급한 고유 ID입니다. */
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
  /** 에스크로 사용 여부 입니다. */
  useEscrow: boolean;
  /** 결제한 금액입니다. */
  amount: number;

  /** 결제 처리 상태입니다 */
  status: PaymentStatus;

  /** 거래가 처리된 시점의 날짜와 시간 정보입니다. ISO 8601 형식인 `YYYY-MM-DDThh:mm:ss+00:00` 으로 돌아옵니다. */
  transactionAt: string;
};

const V1_TRANSACTION_URL = '/v1/transactions';

/**
 * 거래 조회
 *
 * 특정 기간 동안 발생한 모든 거래 내역을 조회합니다.
 * 날짜 범위를 지정하여 조회할 수 있으며, 페이지네이션을 지원합니다.
 * 거래 내역에는 결제 승인, 취소, 환불 등 모든 거래 정보가 포함됩니다.
 *
 * @param params - 거래 조회 파라미터 (날짜 범위, 페이지네이션 등)
 * @param params.startDate - 조회 시작 날짜 (YYYY-MM-DD 형식)
 * @param params.endDate - 조회 종료 날짜 (YYYY-MM-DD 형식)
 * @param params.startingAfter - 특정 거래 이후의 기록을 조회할 때 사용하는 transactionKey (선택사항)
 * @param params.limit - 한 번에 응답받을 기록의 개수 (기본값: 100, 최대값: 10000)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns Transaction 객체 배열을 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EA%B1%B0%EB%9E%98-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * // 특정 기간의 거래 조회
 * const transactions = await getTransactions({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   limit: 100
 * }, { secretkey: 'test_sk_...' });
 *
 * // 거래 내역 출력
 * transactions.forEach(tx => {
 *   console.log(`${tx.orderId}: ${tx.amount}원 (${tx.status})`);
 * });
 *
 * // 페이지네이션을 사용한 거래 조회
 * const firstPage = await getTransactions({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   limit: 50
 * }, { secretkey: 'test_sk_...' });
 *
 * const lastTransaction = firstPage[firstPage.length - 1];
 * const nextPage = await getTransactions({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   startingAfter: lastTransaction.transactionKey,
 *   limit: 50
 * }, { secretkey: 'test_sk_...' });
 * ```
 */
export const getTransactions = (
  params: TPCommonPaginationType & {
    /**
     * 특정 결제 건 이후의 기록을 조회할 때 사용합니다. `transactionKey` 값을 전달합니다. 많은 양의 기록을 페이지 단위로 나누어 처리할 때 사용할 수 있습니다.
     */
    startingAfter?: string;
    /**
     * 한 번에 응답받을 기록의 개수입니다. 기본값은 `100`이고 설정할 수 있는 최대값은 `10000`입니다.
     * @default 100
     */
    limit?: number;
  },
  options: { secretkey: string },
) =>
  TPApiRequest({
    method: 'POST',
    url: V1_TRANSACTION_URL,
    params,
    secretkey: options.secretkey,
  });
