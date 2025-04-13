import { Injectable } from '@nestjs/common';

import { ApiResponse } from '@/dto/response.dto';
import { PageListData, PageListResponse } from '@/dto/pagination.dto';
import { commonCodeMessages } from '@/settings/code-message.setting';

@Injectable()
export class ResponseService {
  success<T>({
    code,
    message,
    data,
  }: {
    code?: string;
    data?: T;
    message?: string;
  }): ApiResponse<T> {
    return {
      success: true,
      code: code || commonCodeMessages.success.code,
      message: message || commonCodeMessages.success.message,
      data,
    };
  }

  pagination<T>(data: PageListData<T>): PageListResponse<T> {
    return {
      success: true,
      code: commonCodeMessages.success.code,
      message: commonCodeMessages.success.message,
      data,
    };
  }

  error({
    code,
    message,
  }: {
    code?: string;
    message?: string;
  }): ApiResponse<null> {
    return {
      success: false,
      code: code || commonCodeMessages.fail.code,
      data: null,
      message: message || commonCodeMessages.fail.message,
    };
  }
}
