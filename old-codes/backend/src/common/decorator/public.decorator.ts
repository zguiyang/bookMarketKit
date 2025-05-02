import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_API = 'isPublicAPI';
export const PublicAPI = () => SetMetadata(IS_PUBLIC_API, true);
