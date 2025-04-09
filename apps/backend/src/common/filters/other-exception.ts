import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ApiResponse } from '@/dto/response.dto';
@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(OtherExceptionFilter.name);

  getErrorMessage(
    defaultMessage: string,
    errors?: { path: string; message: string }[],
  ) {
    if (errors && errors.length > 0) {
      return errors[0].message;
    }
    return defaultMessage;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorStatus = exception.status;
    const errResponse = exception.response;

    const errorMsg = this.getErrorMessage(
      exception.message ?? 'An unexpected error occurred',
      errResponse?.errors,
    );

    console.log(exception);

    const errorResponse: ApiResponse = {
      code: errorStatus ?? '500',
      data: null,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMsg,
      error: errResponse,
    };

    // 使用 Logger 记录未处理的异常
    this.logger.error(
      `Unhandled Exception: ${JSON.stringify(errorResponse)}`,
      exception.stack,
    );

    response.status(500).json(errorResponse);
  }
}
