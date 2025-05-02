// 定义错误码类型
type ErrorCode = {
  code: string;
  message: string;
  status?: number;
};

export class BusinessException extends Error {
  public readonly code: string;
  public readonly message: string;
  public readonly status: number;

  constructor(codeOrError: string | ErrorCode, message?: string, status = 200) {
    // 如果第一个参数是对象，使用对象中的属性
    if (typeof codeOrError === 'object') {
      super(codeOrError.message);
      this.code = codeOrError.code;
      this.message = codeOrError.message;
      this.status = codeOrError.status ?? 200;
    } else {
      // 如果是字符串，使用分开的参数
      super(message || codeOrError);
      this.code = codeOrError;
      this.message = message || codeOrError;
      this.status = status;
    }
  }
}
