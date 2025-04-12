export const commonCodeMessages = {
  success: { code: 'successful', message: '操作成功' },
  fail: { code: 'failed', message: '操作失败' },
  notLogin: { code: 'not_login', message: '用户未登录' },
  paramsError: { code: 'params_error', message: '参数错误' },
  serverError: { code: 'server_error', message: '服务器错误' },
};

export const authCodeMessages = {
  passwordError: {
    code: 'auth_password-error',
    message: '密码错误',
  },
  emailNotFound: {
    code: 'auth_email-not-found',
    message: '邮箱不存在',
  },
  emailCodeError: {
    code: 'auth_email-code-error',
    message: '验证码错误',
  },
  emailCodeExist: {
    code: 'auth_email-code-exist',
    message: '验证码已发送，请查收邮件或等待验证码过期后重试',
  },
  emailCodeTooFrequent: {
    code: 'auth_email-code-too-frequent',
    message: '发送太频繁，请稍后再试',
  },
  notFoundToken: {
    code: 'auth_not-found-token',
    message: '未找到Token',
  },
  tokenExpired: {
    code: 'auth_token-expired',
    message: 'Token已过期',
  },
  tokenError: {
    code: 'auth_token-error',
    message: 'Token错误',
  },
} as const;

export const usersCodeMessages = {
  createError: { code: 'user_create_error', message: '创建用户失败' },
  notFoundUser: { code: 'user_not_found', message: '用户不存在' },
  existedUser: { code: 'user_existed', message: '用户已存在' },
};

export const bookmarksCodeMessages = {
  notFoundBookmark: {
    code: 'BOOKMARK_NOT_FOUND',
    message: '书签不存在',
  },
  existedBookmark: {
    code: 'BOOKMARK_EXISTED',
    message: '该URL已被收藏',
  },
  createError: {
    code: 'BOOKMARK_CREATE_ERROR',
    message: '创建书签失败',
  },
  updateError: {
    code: 'BOOKMARK_UPDATE_ERROR',
    message: '更新书签失败',
  },
  deleteError: {
    code: 'BOOKMARK_DELETE_ERROR',
    message: '删除书签失败',
  },
};
