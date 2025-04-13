import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorator/get-user.decorator';
import { PaginationParamsFormatPipe } from '@/common/pipes/pagination.pipe';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkDTO,
  UpdateBookmarkDTO,
  SetFavoriteDTO,
  SetPinnedTopDTO,
  BookmarkPageListRequestDTO,
} from './dto/request.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('create')
  async create(
    @CurrentUser('userId') userId: string,
    @Body()
    body: CreateBookmarkDTO,
  ) {
    return await this.bookmarkService.create({
      user_id: userId,
      ...body,
    });
  }

  @Put('update')
  async update(
    @CurrentUser('userId') userId: string,
    @Body()
    body: UpdateBookmarkDTO,
  ) {
    return await this.bookmarkService.update(userId, body);
  }

  @Delete('delete/:id')
  async delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkService.delete(userId, id);
  }

  @Patch('favorite')
  async favorite(
    @CurrentUser('userId') userId: string,
    @Body()
    body: SetFavoriteDTO,
  ) {
    return await this.bookmarkService.favorite(userId, body);
  }

  @Patch('pinned')
  async pinned(
    @CurrentUser('userId') userId: string,
    @Body()
    body: SetPinnedTopDTO,
  ) {
    return await this.bookmarkService.pinnedTop(userId, body);
  }

  @Get('all')
  async all(@CurrentUser('userId') userId: string) {
    return await this.bookmarkService.findAll(userId);
  }

  @Get('detail/:id')
  async get(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkService.findOne(userId, id);
  }

  @Get('pageList')
  async pageList(
    @CurrentUser('userId') userId: string,
    @Query(new PaginationParamsFormatPipe()) query: BookmarkPageListRequestDTO,
  ) {
    return await this.bookmarkService.pageList(userId, query);
  }
}
