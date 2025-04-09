import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ApiResponse } from '@/dto/response.dto';

@Catch(Error) // 捕获所有 Error 类型的异常
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name); // 使用 Logger

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (this.isPostgresError(exception)) {
      const errorResponse: ApiResponse = {
        code: '500',
        success: false,
        data: null,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Database operation failed',
        error: exception.message,
      };

      // 使用 Logger 记录 Postgres 错误
      this.logger.error(
        `Postgres Exception: ${JSON.stringify(errorResponse)}`,
        exception.stack,
      );

      response.status(500).json(errorResponse);
    } else {
      // 如果不是 Postgres 错误，继续抛出异常
      throw exception;
    }
  }

  private isPostgresError(exception: Error): boolean {
    // 通过检查 Postgres 错误的特定属性来判断
    const pgErrorKeys = ['code', 'severity', 'schema', 'table', 'constraint'];
    return pgErrorKeys.some((key) => key in exception);
  }
}
