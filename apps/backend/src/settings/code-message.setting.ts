export const commonCodeMessages = {
  success: { code: 'COMMON_SUCCESSFUL', message: '操作成功' },
  fail: { code: 'COMMON_FAILED', message: '操作失败' },
  notLogin: { code: 'COMMON_NOT_LOGIN', message: '用户未登录' },
  paramsError: { code: 'COMMON_PARAMS_ERROR', message: '参数错误' },
  serverError: { code: 'COMMON_SERVER_ERROR', message: '服务器错误' },
  validationError: { code: 'COMMON_VALIDATION_ERROR', message: '数据验证失败' },
  badRequest: { code: 'COMMON_BAD_REQUEST', message: '无效的请求' },
};

export const authCodeMessages = {
  passwordError: {
    code: 'AUTH_PASSWORD_ERROR',
    message: '密码错误',
  },
  emailNotFound: {
    code: 'AUTH_EMAIL_NOT_FOUND',
    message: '邮箱不存在',
  },
  emailCodeError: {
    code: 'AUTH_EMAIL_CODE_ERROR',
    message: '验证码错误',
  },
  emailCodeExist: {
    code: 'AUTH_EMAIL_CODE_EXIST',
    message: '验证码已发送，请查收邮件或等待验证码过期后重试',
  },
  emailCodeTooFrequent: {
    code: 'AUTH_EMAIL_CODE_TOO_FREQUENT',
    message: '发送太频繁，请稍后再试',
  },
  notFoundToken: {
    code: 'AUTH_NOT_FOUND_TOKEN',
    message: '未找到Token',
  },
  tokenExpired: {
    code: 'AUTH_TOKEN_EXPIRED',
    message: 'Token已过期',
  },
  tokenError: {
    code: 'AUTH_TOKEN_ERROR',
    message: 'Token错误',
  },
} as const;

export const usersCodeMessages = {
  createError: { code: 'USER_CREATE_ERROR', message: '创建用户失败' },
  notFoundUser: { code: 'USER_NOT_FOUND', message: '用户不存在' },
  existedUser: { code: 'USER_ALREADY_EXISTS', message: '用户已存在' },
};

export const bookmarksCodeMessages = {
  notFoundBookmark: {
    code: 'BOOKMARK_NOT_FOUND',
    message: '书签不存在',
  },
  existedBookmark: {
    code: 'BOOKMARK_ALREADY_EXISTS',
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

// 书签标签相关错误码
export const bookmarkTagCodeMessages = {
  notFoundTag: {
    code: 'BOOKMARK_TAG_NOT_FOUND',
    message: '标签不存在',
  },
  existedTag: {
    code: 'BOOKMARK_TAG_ALREADY_EXISTS',
    message: '标签已存在',
  },
  createTagError: {
    code: 'BOOKMARK_TAG_CREATE_ERROR',
    message: '创建标签失败',
  },
  updateTagError: {
    code: 'BOOKMARK_TAG_UPDATE_ERROR',
    message: '更新标签失败',
  },
  deleteTagError: {
    code: 'BOOKMARK_TAG_DELETE_ERROR',
    message: '删除标签失败',
  },
};

// 书签分类相关错误码
export const bookmarkCategoryCodeMessages = {
  notFoundCategory: {
    code: 'BOOKMARK_CATEGORY_NOT_FOUND',
    message: '分类不存在',
  },
  existedCategory: {
    code: 'BOOKMARK_CATEGORY_ALREADY_EXISTS',
    message: '分类已存在',
  },
  createCategoryError: {
    code: 'BOOKMARK_CATEGORY_CREATE_ERROR',
    message: '创建分类失败',
  },
  updateCategoryError: {
    code: 'BOOKMARK_CATEGORY_UPDATE_ERROR',
    message: '更新分类失败',
  },
  deleteCategoryError: {
    code: 'BOOKMARK_CATEGORY_DELETE_ERROR',
    message: '删除分类失败',
  },
};
