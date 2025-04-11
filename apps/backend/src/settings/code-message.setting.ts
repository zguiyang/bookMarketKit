export const commonCodeMessages = {
  success: { code: 'successful', message: '操作成功' },
  fail: { code: 'failed', message: '操作失败' },
  notLogin: { code: 'not_login', message: '用户未登录' },
  paramsError: { code: 'params_error', message: '参数错误' },
  serverError: { code: 'server_error', message: '服务器错误' },
};

export const authCodeMessages = {
  passwordError: { code: 'password_error', message: '密码错误' },
  emailCodeError: { code: 'email_code_error', message: '邮箱验证码错误' },
  notFoundToken: { code: 'token_not_found', message: 'token不存在' },
  tokenExpired: { code: 'token_expired', message: 'token已过期' },
  tokenError: { code: 'token_error', message: 'token错误' },
};

export const usersCodeMessages = {
  createError: { code: 'user_create_error', message: '创建用户失败' },
  notFoundUser: { code: 'user_not_found', message: '用户不存在' },
  existedUser: { code: 'user_existed', message: '用户已存在' },
};
