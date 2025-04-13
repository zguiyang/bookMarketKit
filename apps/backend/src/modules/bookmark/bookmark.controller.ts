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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

@ApiTags('书签管理')
@ApiBearerAuth('jwt')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('create')
  @ApiOperation({ summary: '创建书签', description: '创建一个新的书签' })
  @ApiBody({ type: CreateBookmarkDTO })
  @ApiResponse({ status: 201, description: '书签创建成功' })
  @ApiResponse({ status: 400, description: '创建失败，参数错误' })
  async create(
    @CurrentUser('userId') userId: string,
    @Body() body: CreateBookmarkDTO,
  ) {
    return await this.bookmarkService.create({
      user_id: userId,
      ...body,
    });
  }

  @Put('update')
  @ApiOperation({ summary: '更新书签', description: '更新书签信息' })
  @ApiBody({ type: UpdateBookmarkDTO })
  @ApiResponse({ status: 200, description: '书签更新成功' })
  @ApiResponse({ status: 400, description: '更新失败，书签不存在或参数错误' })
  async update(
    @CurrentUser('userId') userId: string,
    @Body() body: UpdateBookmarkDTO,
  ) {
    return await this.bookmarkService.update(userId, body);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: '删除书签', description: '删除指定的书签' })
  @ApiParam({ name: 'id', description: '书签ID' })
  @ApiResponse({ status: 200, description: '书签删除成功' })
  @ApiResponse({ status: 400, description: '删除失败，书签不存在' })
  async delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkService.delete(userId, id);
  }

  @Patch('favorite')
  @ApiOperation({ summary: '收藏书签', description: '设置书签的收藏状态' })
  @ApiBody({ type: SetFavoriteDTO })
  @ApiResponse({ status: 200, description: '收藏状态更新成功' })
  @ApiResponse({ status: 400, description: '更新失败，书签不存在' })
  async favorite(
    @CurrentUser('userId') userId: string,
    @Body() body: SetFavoriteDTO,
  ) {
    return await this.bookmarkService.favorite(userId, body);
  }

  @Patch('pinned')
  @ApiOperation({ summary: '置顶书签', description: '设置书签的置顶状态' })
  @ApiBody({ type: SetPinnedTopDTO })
  @ApiResponse({ status: 200, description: '置顶状态更新成功' })
  @ApiResponse({ status: 400, description: '更新失败，书签不存在' })
  async pinned(
    @CurrentUser('userId') userId: string,
    @Body() body: SetPinnedTopDTO,
  ) {
    return await this.bookmarkService.pinnedTop(userId, body);
  }

  @Get('all')
  @ApiOperation({
    summary: '获取所有书签',
    description: '获取用户的所有书签列表',
  })
  @ApiResponse({ status: 200, description: '成功获取书签列表' })
  async all(@CurrentUser('userId') userId: string) {
    return await this.bookmarkService.findAll(userId);
  }

  @Get('detail/:id')
  @ApiOperation({
    summary: '获取书签详情',
    description: '获取指定书签的详细信息',
  })
  @ApiParam({ name: 'id', description: '书签ID' })
  @ApiResponse({ status: 200, description: '成功获取书签详情' })
  @ApiResponse({ status: 404, description: '书签不存在' })
  async get(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkService.findOne(userId, id);
  }

  @Get('pageList')
  @ApiOperation({
    summary: '分页获取书签',
    description: '分页获取书签列表，支持标题、标签和分类筛选',
  })
  @ApiResponse({ status: 200, description: '成功获取书签列表' })
  async pageList(
    @CurrentUser('userId') userId: string,
    @Query(new PaginationParamsFormatPipe()) query: BookmarkPageListRequestDTO,
  ) {
    return await this.bookmarkService.pageList(userId, query);
  }
}
