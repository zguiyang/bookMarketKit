import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkRelationService } from './bookmark.rel.service';
import { BookmarkTagService } from './bookmark.tag.service';
import { BookmarkCategoryService } from './bookmark.category.service';
import { BookmarkTagController } from './bookmark.tag.controller';
import { BookmarkCategoryController } from './bookmark.category.controller';

@Module({
  controllers: [
    BookmarkController,
    BookmarkTagController,
    BookmarkCategoryController,
  ],
  providers: [
    BookmarkService,
    BookmarkRelationService,
    BookmarkTagService,
    BookmarkCategoryService,
  ],
})
export class BookmarkModule {}
