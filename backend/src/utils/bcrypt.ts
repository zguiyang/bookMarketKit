import * as bcrypt from 'bcryptjs';

/**
 * Encrypt password
 * @param password Plaintext password
 * **/
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify if the password is correct
 * @param password Plaintext password
 * @param hashedPassword Encrypted password
 * **/
export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
