import { CodeEnums } from './code-enums';

export const commonCodeMessages = {
  success: { code: CodeEnums.COMMON_SUCCESSFUL, message: '操作成功' },
  fail: { code: CodeEnums.COMMON_FAILED, message: '操作失败' },
  notLogin: { code: CodeEnums.COMMON_NOT_LOGIN, message: '用户未登录' },
  paramsError: { code: CodeEnums.COMMON_PARAMS_ERROR, message: '参数错误' },
  serverError: { code: CodeEnums.COMMON_SERVER_ERROR, message: '服务器错误' },
  validationError: { code: CodeEnums.COMMON_VALIDATION_ERROR, message: '数据验证失败' },
  badRequest: { code: CodeEnums.COMMON_BAD_REQUEST, message: '无效的请求' },
};

// Mongoose 相关错误消息
export const mongooseCodeMessages = {
  castError: {
    code: CodeEnums.MONGOOSE_CAST_ERROR,
    message: '数据类型转换错误',
  },
  validationError: {
    code: CodeEnums.MONGOOSE_VALIDATION_ERROR,
    message: 'Mongoose 数据验证失败',
  },
  notFound: {
    code: CodeEnums.MONGOOSE_NOT_FOUND,
    message: '数据不存在',
  },
  error: {
    code: CodeEnums.MONGOOSE_ERROR,
    message: 'Mongoose 操作错误',
  },
} as const;

export const authCodeMessages = {
  passwordError: {
    code: CodeEnums.AUTH_PASSWORD_ERROR,
    message: '密码错误',
  },
  emailNotFound: {
    code: CodeEnums.AUTH_EMAIL_NOT_FOUND,
    message: '邮箱不存在',
  },
  emailCodeError: {
    code: CodeEnums.AUTH_EMAIL_CODE_ERROR,
    message: '验证码错误',
  },
  emailCodeExist: {
    code: CodeEnums.AUTH_EMAIL_CODE_EXIST,
    message: '验证码已发送，请查收邮件或等待验证码过期后重试',
  },
  emailCodeTooFrequent: {
    code: CodeEnums.AUTH_EMAIL_CODE_TOO_FREQUENT,
    message: '发送太频繁，请稍后再试',
  },
  notFound: {
    code: CodeEnums.AUTH_NOT_FOUND,
    message: '登录凭证不存在',
  },
  expired: {
    code: CodeEnums.AUTH_LOGIN_EXPIRED,
    message: '登录凭证失效',
  },
  authFailed: {
    code: CodeEnums.AUTH_FAILED,
    message: '用户认证失败',
  },
} as const;

export const userCodeMessages = {
  createError: { code: CodeEnums.USER_CREATE_ERROR, message: '创建用户失败' },
  notFoundUser: { code: CodeEnums.USER_NOT_FOUND, message: '用户不存在' },
  existedUser: { code: CodeEnums.USER_ALREADY_EXISTS, message: '用户或邮箱已存在' },
};

export const bookmarkCodeMessages = {
  notFound: {
    code: CodeEnums.BOOKMARK_NOT_FOUND,
    message: '书签不存在',
  },
  existed: {
    code: CodeEnums.BOOKMARK_ALREADY_EXISTS,
    message: '已存在相同URL或标题的书签',
  },
  createError: {
    code: CodeEnums.BOOKMARK_CREATE_ERROR,
    message: '创建书签失败',
  },
  updateError: {
    code: CodeEnums.BOOKMARK_UPDATE_ERROR,
    message: '更新书签失败',
  },
  deleteError: {
    code: CodeEnums.BOOKMARK_DELETE_ERROR,
    message: '删除书签失败',
  },
};

// 书签标签相关错误码
export const bookmarkTagCodeMessages = {
  notFound: {
    code: CodeEnums.BOOKMARK_TAG_NOT_FOUND,
    message: '标签不存在',
  },
  existed: {
    code: CodeEnums.BOOKMARK_TAG_ALREADY_EXISTS,
    message: '标签已存在',
  },
  createError: {
    code: CodeEnums.BOOKMARK_TAG_CREATE_ERROR,
    message: '创建标签失败',
  },
  updateError: {
    code: CodeEnums.BOOKMARK_TAG_UPDATE_ERROR,
    message: '更新标签失败',
  },
  deleteError: {
    code: CodeEnums.BOOKMARK_TAG_DELETE_ERROR,
    message: '删除标签失败',
  },
};

// 书签分类相关错误码
export const bookmarkCategoryCodeMessages = {
  notFound: {
    code: CodeEnums.BOOKMARK_CATEGORY_NOT_FOUND,
    message: '分类不存在',
  },
  existed: {
    code: CodeEnums.BOOKMARK_CATEGORY_ALREADY_EXISTS,
    message: '分类已存在',
  },
  createError: {
    code: CodeEnums.BOOKMARK_CATEGORY_CREATE_ERROR,
    message: '创建分类失败',
  },
  updateError: {
    code: CodeEnums.BOOKMARK_CATEGORY_UPDATE_ERROR,
    message: '更新分类失败',
  },
  deleteError: {
    code: CodeEnums.BOOKMARK_CATEGORY_DELETE_ERROR,
    message: '删除分类失败',
  },
};
