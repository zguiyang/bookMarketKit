import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as dayjs from 'dayjs';

import { BusinessException } from '@/common/exceptions/business.exception';
import { ApiResponse } from '@/dto/response.dto';
import { commonCodeMessages } from '@/settings/code-message.setting';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    const errorResponse: ApiResponse<null> = {
      success: false,
      code: commonCodeMessages.fail.code,
      message: commonCodeMessages.fail.message,
      data: null,
      path: request.path,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    // 处理验证错误
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;

      // 处理验证管道的错误格式
      if (
        exceptionResponse.message === 'Validation failed' &&
        exceptionResponse.errors
      ) {
        errorResponse.code = commonCodeMessages.validationError.code;
        errorResponse.message = commonCodeMessages.validationError.message;
        errorResponse.error = {
          type: 'ValidationError',
          details: exceptionResponse.errors,
        };
        return response.status(exception.getStatus()).json(errorResponse);
      }

      // 处理其他BadRequest错误
      errorResponse.code = commonCodeMessages.badRequest.code;
      errorResponse.message =
        exceptionResponse.message || commonCodeMessages.badRequest.message;
      errorResponse.error = {
        type: 'BadRequest',
        message: exceptionResponse.message,
      };
      return response.status(exception.getStatus()).json(errorResponse);
    }

    // 处理业务异常
    if (exception instanceof BusinessException) {
      errorResponse.code = exception.code;
      errorResponse.message = exception.message;
      errorResponse.error = {
        type: 'BusinessError',
        code: exception.code,
      };
      return response.status(exception.status).json(errorResponse);
    }

    // 处理其他 HTTP 异常
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      errorResponse.message = exceptionResponse.message || exception.message;
      errorResponse.error = {
        type: 'HttpError',
        status: exception.getStatus(),
        message: exceptionResponse.message || exception.message,
      };
      return response.status(exception.getStatus()).json(errorResponse);
    }

    // 记录未知错误
    this.logger.error('Unexpected error:', exception);

    // 处理其他未知异常
    errorResponse.error = {
      type: 'UnknownError',
      message: 'Internal server error',
    };
    return response.status(500).json(errorResponse);
  }
}
