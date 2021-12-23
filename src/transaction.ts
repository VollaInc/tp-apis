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
 * 카드 결제 승인정보를 수동으로 카드사에 전송하는 방식으로 정산합니다.
 * 요청에 성공하면 `HTTP 200 OK` 응답과 함께 빈 본문이 돌아옵니다.
 *
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
