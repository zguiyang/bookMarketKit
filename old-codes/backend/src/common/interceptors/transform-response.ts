import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@/dto/response.dto';
import { commonCodeMessages } from '@/settings/code-message.setting';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (this.isApiResponse(data)) {
          return {
            code: data.code ?? commonCodeMessages.success.code,
            success:
              data.success ?? data.code === commonCodeMessages.success.code,
            data: data.data ?? null,
            message: data.message ?? commonCodeMessages.success.message,
          };
        }

        return {
          success: true,
          data,
          message: commonCodeMessages.success.message,
          code: commonCodeMessages.success.code,
        };
      }),
    );
  }

  /**
   * 判断数据是否是 ApiResponse 格式
   */
  private isApiResponse(obj: any): obj is ApiResponse<any> {
    return (
      obj &&
      (obj.success !== undefined ||
        obj.data !== undefined ||
        obj.code !== undefined ||
        obj.message !== undefined)
    );
  }
}
