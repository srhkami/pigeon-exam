import {AUTH_CHECK, AuthType} from "@/types/auth-types.ts"

/**
 * 驗證是否擁有特定權限
 * @param auth 會員的Auth值，為八個0和1組成的字串，如'01010101'
 * @param authType 所需的對應權限種類
 * @return boolean 返回是否通過的bool值
 */
export function handleHasAuth(auth: string, authType: AuthType) {

  const authCharAt: number = AUTH_CHECK[authType] //對應的權限位數

  if (!auth) {
    // 如果Auth的值為空
    return false
  }
  if (authType === 'L') {
    // 如果僅要驗證是否登入，則一律通過，交由React組件全域驗證
    return true
  }

  return auth.charAt(authCharAt - 1) === '1'
}