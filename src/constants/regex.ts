/** 단어 문자가 아니거나 아포스트로피(')가 아닌 모든 문자와 일치 (공백, 콤마 등) */
export const NonWordCharPattern = /([^\w'])/g;