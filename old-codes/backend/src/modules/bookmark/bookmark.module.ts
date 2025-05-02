import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkRelationService } from './rel/bookmark.rel.service';
import { BookmarkCategoryController } from './category/bookmark.category.controller';
import { BookmarkCategoryService } from './category/bookmark.category.service';
import { BookmarkTagController } from './tag/bookmark.tag.controller';
import { BookmarkTagService } from './tag/bookmark.tag.service';

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
