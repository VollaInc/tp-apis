/**
 * 토스페이먼츠 서브몰 (지급대행) API (v1)
 *
 * 서브몰 관리 및 지급대행 기능을 제공합니다.
 * v2 API를 사용하는 것을 권장하며, 이 API는 레거시 지원을 위해 유지됩니다.
 *
 * ## API 엔드포인트
 * - `GET /v1/payouts/sub-malls` - 서브몰 조회
 * - `POST /v1/payouts/sub-malls` - 서브몰 등록
 * - `POST /v1/payouts/sub-malls/{subMallId}` - 서브몰 수정
 * - `POST /v1/payouts/sub-malls/{subMallId}/delete` - 서브몰 삭제
 * - `GET /v1/payouts/sub-malls/balance` - 잔액 조회
 * - `POST /v1/payouts/sub-malls/settlements` - 지급대행 요청
 *
 * @see https://docs.tosspayments.com/reference#지급대행
 * @module SubMall
 * @deprecated v2 API 사용을 권장합니다. subMallV2를 참조하세요.
 */

import TPApiRequest from '../utils/TPApiRequest';

const V1_SUBMALL_URL = '/v1/payouts/sub-malls';

/**
 * 서브몰의 지급 가능 상태를 나타내는 enum입니다.
 */
export enum SubMallStatus {
  /** 1천만원 이하의 금액을 지급대행할 수 있는 상태입니다. 서브몰 등록 이후 최초 상태입니다. */
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',

  /** 지급대행이 보류된 상태입니다. 1천만원 이상의 금액을 지급대행 요청하면 지급대행이 실패하고 KYC 심사가 진행됩니다. */
  KYC_REQUIRED = 'KYC_REQUIRED',

  /** 지급대행 금액에 제한이 없는 상태입니다. 서브몰이 KYC 심사를 통과했기 때문입니다. */
  APPROVED = 'APPROVED',
}

/**
 * https://docs.tosspayments.com/reference#submall-%EA%B0%9D%EC%B2%B4
 * 지급받을 서브몰 정보를 가지고 있는 객체입니다.
 *
 * 정산 지급을 위해 필요한 서브몰의 계좌 정보를 포함하고 있습니다.
 */
export type SubMallType = {
  /** 서브몰의 ID입니다. 최대 길이는 20자입니다. */
  subMallId: string;

  /** 서브몰의 타입입니다. 'CORPORATE'(사업자) 또는 'INDIVIDUAL'(개인) 중 하나입니다. */
  type: 'CORPORATE' | 'INDIVIDUAL';

  /**
   * 서브몰의 지급 가능 상태입니다.
   * 'PARTIALLY_APPROVED': 1천만원 이하의 금액을 지급대행할 수 있는 상태입니다. 서브몰 등록 이후 최초 상태입니다.
   * 'KYC_REQUIRED': 지급대행이 보류된 상태입니다. 1천만원 이상의 금액을 지급대행 요청하면 지급대행이 실패하고 KYC 심사가 진행됩니다.
   * 'APPROVED': 지급대행 금액에 제한이 없는 상태입니다. 서브몰이 KYC 심사를 통과했기 때문입니다.
   */
  status: SubMallStatus;

  /** 서브몰의 상호명입니다. 최대 길이는 공백을 포함한 한글 30자, 영문 60자입니다. type이 'CORPORATE'일 때만 사용됩니다. */
  companyName?: string;

  /** 서브몰의 대표자명입니다. 최대 길이는 40자입니다. type이 'CORPORATE'일 때만 사용됩니다. */
  representativeName?: string;

  /** 서브몰의 사업자등록번호입니다. 길이는 10자입니다. type이 'CORPORATE'일 때만 사용됩니다. */
  businessNumber?: string;

  /** 서브몰에서 정산 금액을 지급받을 계좌 정보를 담은 객체입니다. */
  account: {
    /** 은행 두 자리 코드입니다. 은행 코드와 증권사 코드를 참고하세요. */
    bankCode: string;
    /** 계좌번호입니다. 최대 길이는 20자입니다. */
    accountNumber: string;
    /** 지급받을 계좌의 예금주입니다. 최대 길이는 공백을 포함한 한글 30자, 영문 60자입니다. */
    holderName?: string;
  };

  /** 서브몰 이메일 주소입니다. */
  email?: string;

  /** 서브몰 연락처입니다. '-' 없이 숫자만 넣어야 합니다. 길이는 8자 이상 11자 이하여야 합니다. */
  phoneNumber?: string;

  /**
   * 셀러와 관련된 추가 정보를 key-value 쌍으로 담고 있는 JSON 객체입니다.
   * 최대 5개의 키-값(key-value) 쌍입니다. 키는 [ , ] 를 사용하지 않는 최대 40자의 문자열, 값은 최대 500자의 문자열입니다.
   */
  metadata?: Record<string, string>;
};

/**
 * 서브몰 조회 (v1)
 *
 * 등록된 서브몰 목록을 조회합니다.
 * 서브몰의 기본 정보, 계좌 정보, 지급 상태 등을 확인할 수 있습니다.
 *
 * @param options - secretkey를 포함한 옵션 객체
 * @returns SubMall 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#submall-%EA%B0%9D%EC%B2%B4
 *
 * @example
 * ```typescript
 * const subMalls = await getSubMalls({ secretkey: 'test_sk_...' });
 * console.log(subMalls);
 * ```
 */
export const getSubMalls = async (options: { secretkey: string }) =>
  TPApiRequest<SubMallType>({
    method: 'GET',
    url: V1_SUBMALL_URL,
    secretkey: options.secretkey,
  });

/**
 * 서브몰 등록 (v1)
 *
 * 새로운 서브몰을 등록합니다.
 * 서브몰의 기본 정보와 정산 지급을 받을 계좌 정보를 등록하며,
 * 사업자 또는 개인 타입으로 구분하여 등록할 수 있습니다.
 *
 * @param data - 서브몰 등록 데이터 (ID, 타입, 계좌 정보 등)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 등록된 SubMall 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%84%9C%EB%B8%8C%EB%AA%B0-%EB%93%B1%EB%A1%9D
 *
 * @example
 * ```typescript
 * // 사업자 서브몰 등록
 * const subMall = await createSubMall({
 *   subMallId: 'submall-001',
 *   type: 'CORPORATE',
 *   companyName: '주식회사 테스트',
 *   representativeName: '홍길동',
 *   businessNumber: '1234567890',
 *   account: {
 *     bankCode: '20',
 *     accountNumber: '12345678901234',
 *     holderName: '주식회사 테스트'
 *   },
 *   email: 'test@example.com',
 *   phoneNumber: '01012345678'
 * }, { secretkey: 'test_sk_...' });
 *
 * // 개인 서브몰 등록
 * const individualSubMall = await createSubMall({
 *   subMallId: 'submall-002',
 *   type: 'INDIVIDUAL',
 *   account: {
 *     bankCode: '20',
 *     accountNumber: '98765432109876',
 *     holderName: '김철수'
 *   }
 * }, { secretkey: 'test_sk_...' });
 * ```
 */
export const createSubMall = async (data: SubMallType, options: { secretkey: string }) =>
  TPApiRequest<SubMallType>({
    method: 'POST',
    url: V1_SUBMALL_URL,
    data,
    secretkey: options.secretkey,
  });

/**
 * 서브몰 수정 (v1)
 *
 * 등록된 서브몰의 정보를 수정합니다.
 * 계좌 정보, 연락처 등을 업데이트할 수 있습니다.
 *
 * @param data - 수정할 서브몰 데이터 (subMallId 포함)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 수정된 SubMall 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%84%9C%EB%B8%8C%EB%AA%B0-%EC%88%98%EC%A0%95
 *
 * @example
 * ```typescript
 * // 서브몰 계좌 정보 수정
 * const updated = await updateSubMall({
 *   subMallId: 'submall-001',
 *   account: {
 *     bankCode: '20',
 *     accountNumber: '11111111111111',
 *     holderName: '주식회사 테스트'
 *   },
 *   email: 'newemail@example.com',
 *   phoneNumber: '01098765432'
 * }, { secretkey: 'test_sk_...' });
 * ```
 */
export const updateSubMall = async (data: SubMallType, options: { secretkey: string }) =>
  TPApiRequest<SubMallType>({
    method: 'POST',
    url: `${V1_SUBMALL_URL}/${data.subMallId}`,
    data: { ...data, subMallId: undefined },
    secretkey: options.secretkey,
  });

/**
 * 서브몰 삭제 (v1)
 *
 * 등록된 서브몰을 삭제합니다.
 * 삭제된 서브몰 ID는 재사용할 수 없습니다.
 *
 * @param subMallId - 삭제할 서브몰의 ID
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 삭제 결과 문자열을 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%84%9C%EB%B8%8C%EB%AA%B0-%EC%82%AD%EC%A0%9C
 *
 * @example
 * ```typescript
 * // 서브몰 삭제
 * await deleteSubMall('submall-001', { secretkey: 'test_sk_...' });
 * console.log('서브몰이 삭제되었습니다.');
 * ```
 */
export const deleteSubMall = async (subMallId: string, options: { secretkey: string }) =>
  TPApiRequest<string>({
    method: 'POST',
    url: `${V1_SUBMALL_URL}/${subMallId}/delete`,
    secretkey: options.secretkey,
  });

/**
 * 서브몰 정산 잔액 조회 (v1)
 *
 * 현재 서브몰에 지급 가능한 정산 잔액을 조회합니다.
 *
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 잔액 정보를 포함한 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%9E%94%EC%95%A1-%EC%A1%B0%ED%9A%8C
 *
 * @example
 * ```typescript
 * const balanceInfo = await getSubMallSettlementBalance({ secretkey: 'test_sk_...' });
 * console.log(`지급 가능한 잔액: ${balanceInfo.balance}원`);
 * ```
 */
export const getSubMallSettlementBalance = async (options: { secretkey: string }) =>
  TPApiRequest<{ balance: number }>({
    method: 'GET',
    url: V1_SUBMALL_URL,
    secretkey: options.secretkey,
  });

/**
 * 서브몰 정산 지급대행 요청 (v1)
 *
 * 서브몰에게 정산 금액을 지급합니다.
 * 여러 서브몰에 대한 지급을 한 번에 요청할 수 있습니다.
 * 지급 날짜를 지정하여 예약 지급도 가능합니다.
 *
 * @param data - 지급대행 요청 배열 (각 서브몰의 ID, 지급 날짜, 금액)
 * @param options - secretkey를 포함한 옵션 객체
 * @returns 지급 후 잔액 정보를 포함한 객체를 반환합니다.
 *
 * @see https://docs.tosspayments.com/reference#%EC%A7%80%EA%B8%89%EB%8C%80%ED%96%89-%EC%9A%94%EC%B2%AD
 *
 * @example
 * ```typescript
 * // 단일 서브몰에 지급
 * const result = await payoutSubMallSettlements([
 *   {
 *     subMallId: 'submall-001',
 *     payoutDate: '2024-02-01',
 *     payoutAmount: 1000000
 *   }
 * ], { secretkey: 'test_sk_...' });
 * console.log(`지급 후 잔액: ${result.balance}원`);
 *
 * // 여러 서브몰에 동시 지급
 * const multipleResult = await payoutSubMallSettlements([
 *   {
 *     subMallId: 'submall-001',
 *     payoutDate: '2024-02-01',
 *     payoutAmount: 500000
 *   },
 *   {
 *     subMallId: 'submall-002',
 *     payoutDate: '2024-02-01',
 *     payoutAmount: 300000
 *   }
 * ], { secretkey: 'test_sk_...' });
 * ```
 */
export const payoutSubMallSettlements = async (
  data: {
    /** 서브몰의 ID입니다. */
    subMallId: string;
    /**
     * 정산한 금액을 지급할 날짜 정보입니다.
     * @example 2023-03-02
     */
    payoutDate: string;
    /** 정산할 금액입니다. */
    payoutAmount: number;
  }[],
  options: { secretkey: string },
) =>
  TPApiRequest<{ balance: number }>({
    method: 'POST',
    url: V1_SUBMALL_URL + '/settlements',
    data,
    secretkey: options.secretkey,
  });
