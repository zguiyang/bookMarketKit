/**
 * 生成指定长度的随机数字验证码
 * @param length 验证码长度
 * @returns 随机数字验证码
 */
export function generateRandomCode(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}
