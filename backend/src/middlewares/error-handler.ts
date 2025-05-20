import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { isNumber } from 'lodash-es';
import { Error as MongooseError } from 'mongoose';
import { BusinessError } from '@/lib/business-error';
import { commonCodeMessages, mongooseCodeMessages } from '@bookmark/code-definitions';
import type { ApiResponse } from '@bookmark/schemas';

/**
 * 统一错误响应格式
 */
function createErrorResponse(
  code: string | number,
  message: string,
  data: any = null,
  statusCode: number = 400
): { response: ApiResponse; statusCode: number } {
  return {
    response: {
      code,
      success: false,
      message,
      data,
    },
    statusCode,
  };
}

/**
 * 处理 Mongoose 错误
 */
function handleMongooseError(error: MongooseError): { response: ApiResponse; statusCode: number } {
  // CastError: 类型转换错误，比如 ObjectId 格式错误
  if (error instanceof MongooseError.CastError) {
    return createErrorResponse(mongooseCodeMessages.castError.code, mongooseCodeMessages.castError.message, {
      field: error.path,
      value: error.value,
      type: error.kind,
    });
  }

  // ValidationError: 数据验证错误
  if (error instanceof MongooseError.ValidationError) {
    return createErrorResponse(
      mongooseCodeMessages.validationError.code,
      mongooseCodeMessages.validationError.message,
      Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))
    );
  }

  // DocumentNotFoundError: 文档未找到
  if (error instanceof MongooseError.DocumentNotFoundError) {
    return createErrorResponse(mongooseCodeMessages.notFound.code, mongooseCodeMessages.notFound.message, null, 404);
  }

  // 其他 Mongoose 错误
  return createErrorResponse(mongooseCodeMessages.error.code, mongooseCodeMessages.error.message, null, 500);
}

export default function errorHandler(
  error: (FastifyError & { validation?: any }) | BusinessError | MongooseError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  let errorResponse;

  // 处理业务异常（优先级最高）
  if (error instanceof BusinessError) {
    errorResponse = createErrorResponse(error.code ?? commonCodeMessages.fail.code, error.message, error.data);
  }
  // 处理 Mongoose 错误
  else if (error instanceof MongooseError) {
    errorResponse = handleMongooseError(error);
  }
  // 处理 zod 校验错误
  else if (error.validation) {
    errorResponse = createErrorResponse(
      commonCodeMessages.validationError.code,
      commonCodeMessages.validationError.message,
      error.validation
    );
  }
  // Fastify 内部错误
  else if (isNumber(error.statusCode) && error.statusCode >= 400 && error.statusCode < 600) {
    errorResponse = createErrorResponse(error.statusCode, error.message, null, error.statusCode);
  }
  // 未知异常
  else {
    errorResponse = createErrorResponse(
      commonCodeMessages.serverError.code,
      commonCodeMessages.serverError.message,
      null,
      500
    );
  }

  return reply.status(errorResponse.statusCode).send(errorResponse.response);
}
