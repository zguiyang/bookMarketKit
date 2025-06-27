import request from '@/lib/request';
import type { ApiResponse, FileResponse, UploadBizTypes } from '~shared/schemas';

class File {
  upload(bizType: UploadBizTypes, formData: FormData) {
    return request.Post<ApiResponse<FileResponse>>(`/file/upload/${bizType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const FileApi = new File();
