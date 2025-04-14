import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { BookmarkTagService } from './bookmark.tag.service';
import { CreateTagDTO, UpdateTagDTO } from './dto/tag.dto';

@ApiTags('书签标签')
@ApiBearerAuth('jwt')
@Controller('bookmark/tag')
export class BookmarkTagController {
  constructor(private readonly bookmarkTagService: BookmarkTagService) {}

  @Post('create')
  @ApiOperation({ summary: '创建标签', description: '创建一个新的标签' })
  @ApiBody({ type: CreateTagDTO })
  @ApiResponse({ status: 201, description: '标签创建成功' })
  @ApiResponse({ status: 400, description: '创建失败，参数错误' })
  async create(
    @CurrentUser('userId') userId: string,
    @Body() body: CreateTagDTO,
  ) {
    return await this.bookmarkTagService.create({
      user_id: userId,
      ...body,
    });
  }

  @Put('update')
  @ApiOperation({ summary: '更新标签', description: '更新标签信息' })
  @ApiBody({ type: UpdateTagDTO })
  @ApiResponse({ status: 200, description: '标签更新成功' })
  @ApiResponse({ status: 400, description: '更新失败，标签不存在或参数错误' })
  async update(
    @CurrentUser('userId') userId: string,
    @Body() body: UpdateTagDTO,
  ) {
    const { id, ...updateData } = body;
    return await this.bookmarkTagService.update(userId, id, updateData);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: '删除标签', description: '删除指定的标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({ status: 200, description: '标签删除成功' })
  @ApiResponse({ status: 400, description: '删除失败，标签不存在' })
  async delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkTagService.delete(userId, id);
  }

  @Get('all')
  @ApiOperation({
    summary: '获取所有标签',
    description: '获取用户的所有标签列表',
  })
  @ApiResponse({ status: 200, description: '成功获取标签列表' })
  async all(@CurrentUser('userId') userId: string) {
    return await this.bookmarkTagService.findAll(userId);
  }

  @Get('detail/:id')
  @ApiOperation({
    summary: '获取标签详情',
    description: '获取指定标签的详细信息',
  })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({ status: 200, description: '成功获取标签详情' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  async get(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkTagService.findOne(userId, id);
  }
}
