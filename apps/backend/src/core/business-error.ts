/**
 * 业务异常类
 * 用于模块中主动抛出业务错误
 * 兼容字符串或对象参数，支持 code/message/status
 */

export type BusinessErrorCode = {
  code: string | number;
  message: string;
  status?: number;
  data?: any;
};

export class BusinessError extends Error {
  public readonly code: string | number;
  public readonly message: string;
  public readonly status: number;
  public readonly data?: any;

  constructor(codeOrError: string | number | BusinessErrorCode, message?: string, status = 400, data?: any) {
    if (typeof codeOrError === 'object') {
      super(codeOrError.message);
      this.code = codeOrError.code;
      this.message = codeOrError.message;
      this.status = codeOrError.status ?? 400;
      this.data = codeOrError.data;
    } else {
      super(message || String(codeOrError));
      this.code = codeOrError;
      this.message = message || String(codeOrError);
      this.status = status;
      this.data = data;
    }
    this.name = 'BusinessError';
  }
} 