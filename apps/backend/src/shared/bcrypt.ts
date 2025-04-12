import * as bcrypt from 'bcrypt';

/**
 * 加密密码
 * @param password 明文密码
 * **/
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * 验证密码是否正确
 * @param password 明文密码
 * @param hashedPassword 加密后的密码
 * **/
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
