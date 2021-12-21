export type TPCommonPaginationType = {
  /**
   * 조회를 시작하고 싶은 날짜 정보입니다. ISO 8601 형식인 YYYY-MM-DD를 사용합니다. 시간은 자동으로 00:00:00 으로 설정됩니다. (e.g. 2021-01-01)
   */
  startDate: string;
  /** 조회를 마치고 싶은 날짜 정보입니다. ISO 8601 형식인 YYYY-MM-DD를 사용합니다. 시간은 자동으로 00:00:00 으로 설정됩니다. (e.g. 2021-01-01) */
  endDate: string;
};

/** 카드사 국내 코드
 * 한글 - 영문 순
 */
export enum CardCompanyCodeKR {
  /** 광주은행 */
  '광주' = 'GWANGJUBANK',
  /**KB국민카드 */
  '국민' = 'KOOKMIN',
  /**NH농협카드 */
  '농협' = 'NONGHYEOP',
  /**롯데카드 */
  '롯데' = 'LOTTE',
  /**KDB산업은행 */
  '산업' = 'KDBBANK',
  /** 삼성카드 */
  '삼성' = 'SAMSUNG',
  /** 새마을금고 */
  '새마을' = 'SAEMAUL',
  /** Sh수협은행 */
  '수협' = 'SUHYEOP',
  /** 신한카드 */
  '신한' = 'SHINHAN',
  /** 신협 */
  '신협' = 'SHINHYEOP',
  /** 씨티카드 */
  '씨티' = 'CITI',
  /** 우리카드 */
  '우리' = 'WOORI',
  /** 우체국예금보험 */
  '우체국' = 'POST',
  /** 저축은행 */
  '저축' = 'SAVINGBANK',
  /** 전북은행 */
  '전북' = 'JEONBUKBANK',
  /** 제주은행 */
  '제주' = 'JEJUBANK',
  /** 카카오뱅크 */
  '카카오뱅크' = 'KAKAOBANK',
  /** 하나카드 */
  '하나' = 'HANA',
  /** 현대카드 */
  '현대' = 'HYUNDAI',
  /**비씨카드 */
  'BC' = 'BC',
}
export enum BankCodeKR {
  /** 경남은행 */
  '경남' = 'KYONGNAMBANK',
  /** 광주은행 */
  '광주' = 'GWANGJUBANK',
  /** KB국민은행 */
  '국민' = 'KOOKMIN',
  /** IBK기업은행 */
  '기업' = 'IBK',
  /** NH농협은행 */
  '농협' = 'NONGHYEOP',
  /** DGB대구은행 */
  '대구' = 'DAEGUBANK',
  /** 부산은행 */
  '부산' = 'BUSANBANK',
  /** KDB산업은행 */
  '산업' = 'KDB',
  /** 새마을금고 */
  '새마을' = 'SAEMAUL',
  /** 산림조합 */
  '산림' = 'SANLIM',
  /** Sh수협은행 */
  '수협' = 'SUHYEOP',
  /** 신한은행 */
  '신한' = 'SHINHAN',
  /** 신협 */
  '신협' = 'SHINHYUP',
  /** 씨티은행 */
  '씨티' = 'CITI',
  /** 우리은행 */
  '우리' = 'WOORI',
  /** 우체국예금보험 */
  '우체국' = 'POST',
  /** 저축은행 */
  '저축' = 'SAVINGBANK',
  /** 전북은행 */
  '전북' = 'JEONBUKBANK',
  /** 제주은행 */
  '제주' = 'JEJUBANK',
  /** 카카오뱅크 */
  '카카오' = 'KAKAOBANK',
  /** 케이뱅크 */
  '케이' = 'KBANK',
  /** 토스뱅크 */
  '토스' = 'TOSSBANK',
  /** 하나은행 */
  '하나' = 'HANA',
  /** SC제일은행 */
  'SC제일' = 'SC',
}

/** 해외 카드사 코드
 * 한글 - 영문 순
 */
export enum CardCompanyCodeINT {
  /** 다이너스 클럽 */
  '다이너스' = 'DINERS',
  /** 디스커버 */
  '디스커버' = 'DISCOVER',
  /** 마스터카드 */
  '마스터' = 'MASTER',
  /** VISA */
  '비자' = 'VISA',
  /** 유니온페이 */
  '유니온페이' = 'UNIONPAY',
  /** JCB */
  'JCB' = 'JCB',
}

/** 통신사 코드 */
export enum TelecomCompanyCode {
  /** KT */
  'KT' = 'KT',
  /**	LG 유플러스 */
  'LGU' = 'LGU',
  /** SK 텔레콤 */
  'SKT' = 'SKT',
  /** LG 헬로모바일 */
  'HELLO' = 'HELLO',
  /** 티플러스 */
  'KCT' = 'KCT',
  /** SK 세븐모바일 */
  'SK7' = 'SK7',
}
