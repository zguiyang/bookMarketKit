import { Module, Global } from '@nestjs/common';
import { ResponseService } from './response.service';

@Global()
@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
