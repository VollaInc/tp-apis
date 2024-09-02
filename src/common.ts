export type TPCommonPaginationType = {
  /**
   * 조회를 시작하고 싶은 날짜 정보입니다. ISO 8601 형식인 YYYY-MM-DD를 사용합니다. 시간은 자동으로 00:00:00 으로 설정됩니다. (e.g. 2021-01-01)
   */
  startDate: string;
  /** 조회를 마치고 싶은 날짜 정보입니다. ISO 8601 형식인 YYYY-MM-DD를 사용합니다. 시간은 자동으로 00:00:00 으로 설정됩니다. (e.g. 2021-01-01) */
  endDate: string;
};

/** 국내 카드사 코드 */
export enum CardCompanyCodeKR {
  /** 기업 BC */
  '기업비씨' = 'IBK_BC',
  /** 광주은행 */
  '광주' = 'GWANGJUBANK',
  /** 롯데카드 */
  '롯데' = 'LOTTE',
  /** KDB산업은행 */
  '산업' = 'KDBBANK',
  /** BC카드 */
  'BC' = 'BC',
  /** 삼성카드 */
  '삼성' = 'SAMSUNG',
  /** 새마을금고 */
  '새마을' = 'SAEMAUL',
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
  /** 저축은행중앙회 */
  '저축' = 'SAVINGBANK',
  /** 전북은행 */
  '전북' = 'JEONBUKBANK',
  /** 제주은행 */
  '제주' = 'JEJUBANK',
  /** 카카오뱅크 */
  '카카오뱅크' = 'KAKAOBANK',
  /** 케이뱅크 */
  '케이뱅크' = 'KBANK',
  /** 토스뱅크 */
  '토스뱅크' = 'TOSSBANK',
  /** 하나카드 */
  '하나' = 'HANA',
  /** 현대카드 */
  '현대' = 'HYUNDAI',
  /** KB국민카드 */
  '국민' = 'KOOKMIN',
  /** NH농협카드 */
  '농협' = 'NONGHYEOP',
  /** Sh수협은행 */
  '수협' = 'SUHYEOP',
}

/** 은행 코드 */
export enum BankCodeKR {
  /** 경남은행 */
  '경남' = 'KYONGNAMBANK',
  /** 광주은행 */
  '광주' = 'GWANGJUBANK',
  /** 단위농협(지역농축협) */
  '단위농협' = 'LOCALNONGHYEOP',
  /** 부산은행 */
  '부산' = 'BUSANBANK',
  /** 새마을금고 */
  '새마을' = 'SAEMAUL',
  /** 산림조합 */
  '산림' = 'SANLIM',
  /** 신한은행 */
  '신한' = 'SHINHAN',
  /** 신협 */
  '신협' = 'SHINHYEOP',
  /** 씨티은행 */
  '씨티' = 'CITI',
  /** 우리은행 */
  '우리' = 'WOORI',
  /** 우체국예금보험 */
  '우체국' = 'POST',
  /** 저축은행중앙회 */
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
  /** IBK기업은행 */
  '기업' = 'IBK',
  /** KB국민은행 */
  '국민' = 'KOOKMIN',
  /** DGB대구은행 */
  '대구' = 'DAEGUBANK',
  /** KDB산업은행 */
  '산업' = 'KDBBANK',
  /** NH농협은행 */
  '농협' = 'NONGHYEOP',
  /** SC제일은행 */
  'SC제일' = 'SC',
  /** Sh수협은행 */
  '수협' = 'SUHYEOP',
}

/** 해외 카드사 코드 */
export enum CardCompanyCodeINT {
  /** 다이너스 클럽 */
  '다이너스' = 'DINERS',
  /** 마스터카드 */
  '마스터' = 'MASTER',
  /** 유니온페이 */
  '유니온페이' = 'UNIONPAY',
  /** 아메리칸 익스프레스 */
  'AMEX' = 'AMEX',
  /** JCB */
  'JCB' = 'JCB',
  /** VISA */
  '비자' = 'VISA',
}

/** 통신사 코드 */
export enum TelecomCompanyCode {
  /** KT */
  'KT' = 'KT',
  /** LG 유플러스 */
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

/** 간편결제사 코드 */
export enum SimplePaymentCode {
  /** 토스페이 */
  '토스페이' = 'TOSSPAY',
  /** 네이버페이 */
  '네이버페이' = 'NAVERPAY',
  /** 삼성페이 */
  '삼성페이' = 'SAMSUNGPAY',
  /** 애플페이 */
  '애플페이' = 'APPLEPAY',
  /** 엘페이 */
  '엘페이' = 'LPAY',
  /** 카카오페이 */
  '카카오페이' = 'KAKAOPAY',
  /** 핀페이 */
  '핀페이' = 'PINPAY',
  /** 페이코 */
  '페이코' = 'PAYCO',
  /** SSG페이 */
  'SSG페이' = 'SSG',
}
