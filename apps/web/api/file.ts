import request from '@/lib/request';
import { ApiResponse, FileResponse, UploadBizTypeEnums } from '@bookmark/schemas';

class File {
  upload(bizType: UploadBizTypeEnums, formData: FormData) {
    return request.Post<ApiResponse<FileResponse>>(`/file/upload/${bizType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const FileApi = new File();
