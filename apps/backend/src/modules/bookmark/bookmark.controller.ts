import { Controller, Post, Put, Get, Delete, Body } from '@nestjs/common';
import { GetCurrentUser } from '@/common/decorator/get-user.decorator';
import { DrizzleValidationPipe } from '@/common/pipes/drizzle.validation';
import { BookmarkService } from './bookmark.service';
import { insertBookmarkSchema, updateBookmarkSchema } from './dto/schema.dto';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './dto/request.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('create')
  async create(
    @GetCurrentUser('userId') userId: string,
    @Body(new DrizzleValidationPipe(insertBookmarkSchema))
    body: CreateBookmarkDTO,
  ) {
    return await this.bookmarkService.create(userId, body);
  }

  @Put('update')
  async update(
    @GetCurrentUser('userId') userId: string,
    @Body(new DrizzleValidationPipe(updateBookmarkSchema))
    body: UpdateBookmarkDTO,
  ) {
    return await this.bookmarkService.update(userId, body);
  }

  @Delete('delete/:id')
  async delete() {
    return await this.bookmarkService.delete();
  }

  @Get('all')
  async all() {
    return await this.bookmarkService.findAll();
  }

  @Get('detail/:id')
  async get() {
    return await this.bookmarkService.findOne();
  }

  @Get('pageList')
  async pageList() {
    return await this.bookmarkService.pageList();
  }
}
