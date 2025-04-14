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
import { BookmarkCategoryService } from './bookmark.category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/request.dto';

@ApiTags('书签分类')
@ApiBearerAuth('jwt')
@Controller('bookmark/category')
export class BookmarkCategoryController {
  constructor(
    private readonly bookmarkCategoryService: BookmarkCategoryService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: '创建分类', description: '创建一个新的分类' })
  @ApiBody({ type: CreateCategoryDTO })
  @ApiResponse({ status: 201, description: '分类创建成功' })
  @ApiResponse({ status: 400, description: '创建失败，参数错误' })
  async create(
    @CurrentUser('userId') userId: string,
    @Body() body: CreateCategoryDTO,
  ) {
    return await this.bookmarkCategoryService.create({
      user_id: userId,
      ...body,
    });
  }

  @Put('update')
  @ApiOperation({ summary: '更新分类', description: '更新分类信息' })
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiResponse({ status: 200, description: '分类更新成功' })
  @ApiResponse({ status: 400, description: '更新失败，分类不存在或参数错误' })
  async update(
    @CurrentUser('userId') userId: string,
    @Body() body: UpdateCategoryDTO,
  ) {
    const { id, ...updateData } = body;
    return await this.bookmarkCategoryService.update(userId, id, updateData);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: '删除分类', description: '删除指定的分类' })
  @ApiParam({ name: 'id', description: '分类ID' })
  @ApiResponse({ status: 200, description: '分类删除成功' })
  @ApiResponse({ status: 400, description: '删除失败，分类不存在' })
  async delete(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkCategoryService.delete(userId, id);
  }

  @Get('all')
  @ApiOperation({
    summary: '获取所有分类',
    description: '获取用户的所有分类列表',
  })
  @ApiResponse({ status: 200, description: '成功获取分类列表' })
  async all(@CurrentUser('userId') userId: string) {
    return await this.bookmarkCategoryService.findAll(userId);
  }

  @Get('detail/:id')
  @ApiOperation({
    summary: '获取分类详情',
    description: '获取指定分类的详细信息',
  })
  @ApiParam({ name: 'id', description: '分类ID' })
  @ApiResponse({ status: 200, description: '成功获取分类详情' })
  @ApiResponse({ status: 404, description: '分类不存在' })
  async get(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return await this.bookmarkCategoryService.findOne(userId, id);
  }
}
