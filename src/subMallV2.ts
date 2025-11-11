/**
 * 토스페이먼츠 지급대행 API (v2)
 *
 * 셀러(서브몰) 관리 및 지급대행 기능을 제공하는 v2 API입니다.
 * v1 API에 비해 개선된 기능과 더 명확한 상태 관리를 제공합니다.
 *
 * ## 주요 개선 사항
 * - 개인, 개인사업자, 법인사업자를 명확히 구분
 * - 셀러 상태 관리 개선 (본인인증, KYC 심사 상태 추적)
 * - 지급 금액 제한 및 승인 프로세스 명확화
 *
 * ## API 엔드포인트
 * ### 셀러 관리
 * - `POST /v2/sellers` - 셀러 등록
 * - `GET /v2/sellers/{sellerId}` - 셀러 조회
 * - `POST /v2/sellers/{sellerId}` - 셀러 수정
 * - `DELETE /v2/sellers/{sellerId}` - 셀러 삭제
 *
 * ### 지급대행
 * - `POST /v2/payouts` - 지급대행 요청
 * - `POST /v2/payouts/{payoutId}/cancel` - 지급대행 요청 취소
 * - `GET /v2/payouts/{payoutId}` - 지급 요청 단건 조회
 * - `GET /v2/payouts` - 지급 요청 목록 조회
 *
 * @see https://docs.tosspayments.com/reference#지급대행
 * @module SubMallV2
 */

import encryptedRequest from './encryptedRequest';

type SubMallRequestData = {
  /* 요청 데이터 타입 정의 */
};

type SubMallResponseData = {
  /* 응답 데이터 타입 정의 */
};

type PayoutRequestData = {
  /* 지급대행 요청 데이터 타입 정의 */
};

type PayoutResponseData = {
  /* 지급대행 응답 데이터 타입 정의 */
};

/**
 * 잔액 정보를 나타내는 객체
 * @see https://docs.tosspayments.com/reference#balance-%EA%B0%9D%EC%B2%B4
 */
export type BananceV2 = {
  /** 셀러에게 지급할 수 없는 잔액 정보입니다. */
  pendingAmount: {
    /** 통화 (현재는 'KRW'만 지원) */
    currency: string;
    /** 잔액 */
    value: number;
  };
  /** 셀러에게 지급할 수 있는 잔액 정보입니다. */
  availableAmount: {
    /** 통화 (현재는 'KRW'만 지원) */
    currency: string;
    /** 잔액 */
    value: number;
  };
};

export enum SubMallSellerV2Status {
  /** 지급대행이 불가능한 상태입니다. 개인 및 개인사업자 셀러 등록 직후의 상태이며, 본인인증이 필요합니다. */
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',

  /** 일주일 동안 1천만원까지 지급대행이 가능한 상태입니다. 등록 직후의 법인사업자 셀러 또는 본인인증을 완료한 개인 및 개인사업자 셀러의 상태입니다. */
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',

  /** 지급대행이 불가능한 상태입니다. 일주일 동안 1천만원을 초과하는 금액을 지급 요청하면 셀러는 해당 상태로 변경됩니다. 셀러가 KYC 심사를 완료해야 합니다. */
  KYC_REQUIRED = 'KYC_REQUIRED',

  /** 금액 제한 없이 지급대행이 가능한 상태입니다. KYC 심사가 정상적으로 완료된 셀러의 상태입니다. */
  APPROVED = 'APPROVED',
}

/**
 * 셀러 정보를 나타내는 객체
 * @see https://docs.tosspayments.com/reference#seller-%EA%B0%9D%EC%B2%B4
 */
export type SubMallSellerV2 = {
  /** 토스페이먼츠에서 발급하는 셀러의 고유 식별자입니다.
   * 셀러 조회, 삭제, 지급대행 요청에 사용됩니다.
   *
   * 셀러의 상태 및 지급대행 상태가 바뀌어도 id는 바뀌지 않고, 삭제된 id는 다시 발급되지 않습니다.*/
  id: string;
  /** 오픈마켓 상점에서 직접 등록하는 셀러의 고유 식별자입니다.
   * 연동 중에 참고할 수 있는 값입니다.
   *
   * 등록 이후에 수정할 수 없고, 삭제된 셀러의 refSellerId는 다시 사용할 수 없습니다.
   */
  refSellerId: string | null;
  /** 사업자 유형 */
  businessType: 'INDIVIDUAL' | 'INDIVIDUAL_BUSINESS' | 'CORPORATE';
  /** 법인사업자 또는 개인사업자 셀러 정보 */
  company?: {
    /** 사업자명 */
    name: string;
    /** 대표자명 */
    representativeName: string;
    /** 사업자번호 */
    businessRegistrationNumber: string;
    /** 사업자 이메일입니다. 최대 길이는 100자입니다. 해당 이메일로 KYC 심사 안내가 전송됩니다. */
    email: string;
    /** 사업자 전화번호 */
    phone: string;
  } | null;
  /** 개인 셀러 정보 */
  individual?: {
    /** 개인의 이름 */
    name: string;
    /** 개인 이메일입니다. 최대 길이는 100자입니다. 해당 이메일로 KYC 심사 안내가 전송됩니다. */
    email: string;
    /** 개인 전화번호 */
    phone: string;
  } | null;
  /** 셀러 상태 */
  status: SubMallSellerV2Status | string;
  /** 계좌 정보 */
  account: {
    /** 은행 두 자리 코드입니다. 은행 코드와 증권사 코드를 참고하세요. */
    bankCode: string;
    /** 계좌번호입니다. 최대 길이는 20자입니다. */
    accountNumber: string;
    /** 예금주입니다. 최대 길이는 공백을 포함한 한글 30자, 영문 60자입니다. */
    holderName: string;
  };
  /**
   * 셀러와 관련된 추가 정보를 key-value 쌍으로 담고 있는 JSON 객체입니다.
   * 최대 5개의 키-값(key-value) 쌍입니다. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.
   */
  metadata: Record<string, string> | null;
};

/**
 * 셀러 등록 (v2)
 *
 * 오픈마켓에 입점해있는 셀러의 정보를 토스페이먼츠에 등록합니다.
 * 셀러의 사업자번호와 계좌 유효성을 검증하며, 개인, 개인사업자, 법인사업자 타입으로 등록할 수 있습니다.
 *
 * **API 엔드포인트**: `POST /v2/sellers`
 *
 * @param data - 셀러 등록 데이터 (사업자 유형, 사업자 정보, 계좌 정보 등)
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns 등록된 SubMallSellerV2 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%85%80%EB%9F%AC-%EB%93%B1%EB%A1%9D
 *
 * @example
 * ```typescript
 * // 법인사업자 셀러 등록
 * const corporateSeller = await createSubMall({
 *   refSellerId: 'seller-001',
 *   businessType: 'CORPORATE',
 *   company: {
 *     name: '주식회사 테스트',
 *     representativeName: '홍길동',
 *     businessRegistrationNumber: '1234567890',
 *     email: 'test@example.com',
 *     phone: '01012345678'
 *   },
 *   account: {
 *     bankCode: '20',
 *     accountNumber: '12345678901234',
 *     holderName: '주식회사 테스트'
 *   }
 * }, 'test_sk_...');
 *
 * // 개인 셀러 등록
 * const individualSeller = await createSubMall({
 *   refSellerId: 'seller-002',
 *   businessType: 'INDIVIDUAL',
 *   individual: {
 *     name: '김철수',
 *     email: 'individual@example.com',
 *     phone: '01098765432'
 *   },
 *   account: {
 *     bankCode: '20',
 *     accountNumber: '98765432109876',
 *     holderName: '김철수'
 *   }
 * }, 'test_sk_...');
 * ```
 */
export const createSubMall = async (data: SubMallRequestData, secretKey: string) => {
  const response = await encryptedRequest<SubMallSellerV2>({
    method: 'POST',
    url: '/v2/sellers',
    data,
    secretkey: secretKey,
  });

  return response.data;
};

/**
 * 셀러 조회 (v2)
 *
 * 토스페이먼츠에 등록한 하나의 셀러를 조회합니다.
 * 삭제되지 않은 셀러만 조회할 수 있으며, 셀러의 상태, 계좌 정보 등을 확인할 수 있습니다.
 *
 * **API 엔드포인트**: `GET /v2/sellers/{sellerId}`
 *
 * @param sellerId - 조회할 셀러의 고유 식별자 (토스페이먼츠가 발급한 ID)
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns SubMallSellerV2 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%85%80%EB%9F%AC-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * const seller = await getSubMall('seller-id-example', 'test_sk_...');
 * console.log(`셀러 상태: ${seller.status}`);
 * console.log(`사업자 타입: ${seller.businessType}`);
 * if (seller.company) {
 *   console.log(`회사명: ${seller.company.name}`);
 * }
 * ```
 */
export const getSubMall = async (sellerId: string, secretKey: string) => {
  const response = await encryptedRequest<SubMallSellerV2>({
    method: 'GET',
    url: `/v2/sellers/${sellerId}`,
    secretkey: secretKey,
  });

  return response.data as SubMallResponseData;
};

/**
 * 셀러 수정 (v2)
 *
 * 등록된 셀러 정보를 수정합니다.
 * 수정하고 싶은 필드만 Request Body 파라미터로 보내면 되며, 파라미터를 보내지 않으면 정보가 바뀌지 않습니다.
 * 데이터를 삭제하고 싶다면 파라미터의 값을 null로 보내주세요. (단, 등록 시 필수 값이었던 필드는 삭제 불가)
 *
 * **API 엔드포인트**: `POST /v2/sellers/{sellerId}`
 *
 * @param sellerId - 수정할 셀러의 고유 식별자
 * @param data - 수정할 셀러 데이터 (부분 업데이트 가능)
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns 수정된 SubMallSellerV2 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%85%80%EB%9F%AC-%EC%88%98%EC%A0%95
 *
 * @example
 * ```typescript
 * // 계좌 정보만 수정
 * const updated = await updateSubMall('seller-id-example', {
 *   account: {
 *     bankCode: '20',
 *     accountNumber: '11111111111111',
 *     holderName: '새로운예금주'
 *   }
 * }, 'test_sk_...');
 *
 * // 이메일과 전화번호 수정
 * const updatedContact = await updateSubMall('seller-id-example', {
 *   company: {
 *     email: 'newemail@example.com',
 *     phone: '01011112222'
 *   }
 * }, 'test_sk_...');
 *
 * // 메타데이터 삭제
 * const removedMetadata = await updateSubMall('seller-id-example', {
 *   metadata: null
 * }, 'test_sk_...');
 * ```
 */
export const updateSubMall = async (
  sellerId: string,
  data: Partial<SubMallRequestData>,
  secretKey: string,
) => {
  const response = await encryptedRequest<SubMallSellerV2>({
    method: 'POST',
    url: `/v2/sellers/${sellerId}`,
    data,
    secretkey: secretKey,
  });

  return response.data as SubMallResponseData;
};

/**
 * 셀러 삭제 (v2)
 *
 * 등록된 셀러를 삭제합니다.
 * 삭제한 셀러의 id 식별자는 다시 발급되지 않으며, 삭제된 셀러는 조회가 불가능합니다.
 *
 * **API 엔드포인트**: `DELETE /v2/sellers/{sellerId}`
 *
 * @param sellerId - 삭제할 셀러의 고유 식별자
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns Promise<void>
 *
 * @see https://docs.tosspayments.com/reference#%EC%85%80%EB%9F%AC-%EC%82%AD%EC%A0%9C
 *
 * @example
 * ```typescript
 * // 셀러 삭제
 * await deleteSubMall('seller-id-example', 'test_sk_...');
 * console.log('셀러가 삭제되었습니다.');
 * ```
 */
export const deleteSubMall = async (sellerId: string, secretKey: string): Promise<void> => {
  await encryptedRequest<void>({
    method: 'DELETE',
    url: `/v2/sellers/${sellerId}`,
    secretkey: secretKey,
  });
};

type PayoutListParams = {
  startDate: string;
  endDate: string;
  page?: number;
  size?: number;
  /* 기타 필요한 파라미터 */
};

/**
 * 지급대행 요청 (v2)
 *
 * 지급 대상 셀러에게 정산 금액을 이체합니다.
 * 요청 시점에 잔액이 부족하면 지급이 실패하며, 셀러의 상태에 따라 지급 금액 제한이 있을 수 있습니다.
 *
 * **API 엔드포인트**: `POST /v2/payouts`
 *
 * @param data - 지급대행 요청 데이터 (셀러 ID, 지급 금액, 지급 날짜 등)
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns PayoutResponseData 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%A7%80%EA%B8%89%EB%8C%80%ED%96%89-%EC%9A%94%EC%B2%AD
 *
 * @example
 * ```typescript
 * // 셀러에게 지급대행 요청
 * const payout = await createPayout({
 *   sellerId: 'seller-id-example',
 *   amount: 1000000,
 *   payoutDate: '2024-02-01',
 *   memo: '1월 정산금 지급'
 * }, 'test_sk_...');
 *
 * console.log(`지급대행 ID: ${payout.id}`);
 * console.log(`지급 상태: ${payout.status}`);
 * ```
 */
export const createPayout = async (
  data: PayoutRequestData,
  secretKey: string,
): Promise<PayoutResponseData> => {
  const response = await encryptedRequest<PayoutResponseData>({
    method: 'POST',
    url: '/v2/payouts',
    data,
    secretkey: secretKey,
  });

  return response.data as PayoutResponseData;
};

/**
 * 지급대행 요청 취소 (v2)
 *
 * REQUESTED 상태의 지급대행 요청 건을 취소합니다.
 * 이미 처리 중이거나 완료된 지급대행 요청 건은 취소할 수 없습니다.
 *
 * **API 엔드포인트**: `POST /v2/payouts/{payoutId}/cancel`
 *
 * @param payoutId - 취소할 지급대행 요청의 고유 식별자
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns Promise<void>
 *
 * @see https://docs.tosspayments.com/reference#%EC%A7%80%EA%B8%89%EB%8C%80%ED%96%89-%EC%B7%A8%EC%86%8C
 *
 * @example
 * ```typescript
 * // 지급대행 요청 취소
 * await cancelPayout('payout-id-example', 'test_sk_...');
 * console.log('지급대행 요청이 취소되었습니다.');
 * ```
 */
export const cancelPayout = async (payoutId: string, secretKey: string): Promise<void> => {
  await encryptedRequest<void>({
    method: 'POST',
    url: `/v2/payouts/${payoutId}/cancel`,
    secretkey: secretKey,
  });
};

/**
 * 지급 요청 단건 조회 (v2)
 *
 * 지급 요청 한 건을 조회합니다.
 * 지급 상태, 금액, 셀러 정보 등을 확인할 수 있습니다.
 *
 * **API 엔드포인트**: `GET /v2/payouts/{payoutId}`
 *
 * @param payoutId - 조회할 지급대행 요청의 고유 식별자
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns PayoutResponseData 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%A7%80%EA%B8%89-%EC%9A%94%EC%B2%AD-%EB%8B%A8%EA%B1%B4-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * const payout = await getPayout('payout-id-example', 'test_sk_...');
 * console.log(`지급 상태: ${payout.status}`);
 * console.log(`지급 금액: ${payout.amount}원`);
 * console.log(`지급 날짜: ${payout.payoutDate}`);
 * ```
 */
export const getPayout = async (
  payoutId: string,
  secretKey: string,
): Promise<PayoutResponseData> => {
  const response = await encryptedRequest<PayoutResponseData>({
    method: 'GET',
    url: `/v2/payouts/${payoutId}`,
    secretkey: secretKey,
  });

  return response.data as PayoutResponseData;
};

/**
 * 지급 요청 목록 조회 (v2)
 *
 * 지급 요청 목록을 조회합니다.
 * 날짜 범위를 지정하여 조회할 수 있으며, 페이지네이션을 지원합니다.
 *
 * **API 엔드포인트**: `GET /v2/payouts`
 *
 * @param params - 조회 파라미터 (날짜 범위, 페이지네이션 등)
 * @param params.startDate - 조회 시작 날짜 (YYYY-MM-DD 형식)
 * @param params.endDate - 조회 종료 날짜 (YYYY-MM-DD 형식)
 * @param params.page - 페이지 번호 (선택사항)
 * @param params.size - 페이지당 항목 수 (선택사항)
 * @param secretKey - 토스페이먼츠 시크릿 키
 * @returns PayoutResponseData 배열을 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%A7%80%EA%B8%89-%EC%9A%94%EC%B2%AD-%EB%AA%A9%EB%A1%9D-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * // 특정 기간의 지급 요청 목록 조회
 * const payouts = await getPayoutList({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   page: 1,
 *   size: 50
 * }, 'test_sk_...');
 *
 * payouts.forEach(payout => {
 *   console.log(`${payout.id}: ${payout.amount}원 (${payout.status})`);
 * });
 * ```
 */
export const getPayoutList = async (
  params: PayoutListParams,
  secretKey: string,
): Promise<PayoutResponseData[]> => {
  const response = await encryptedRequest<PayoutResponseData[]>({
    method: 'GET',
    url: '/v2/payouts',
    params,
    secretkey: secretKey,
  });

  return response.data as PayoutResponseData[];
};
