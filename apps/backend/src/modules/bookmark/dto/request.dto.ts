import { PageListRequest } from '@/dto/pagination.dto';

export class BookmarkPageListRequestDTO extends PageListRequest {
  title?: string;
  tagId?: string;
  categoryId?: string;
}

export class CreateBookmarkDTO {
  title: string;
  url: string;
}

export class UpdateBookmarkDTO {
  id: string;
  title?: string;
  url?: string;
  description?: string;
  visit_count?: string;
  is_favorite?: number;
  is_pinned?: number;
  favicon_url?: string;
  screenshot_url?: string;
  last_visited_at?: string;
}

export class SetFavoriteDTO {
  id: string;
  isFavorite: 0 | 1;
}

export class SetPinnedTopDTO {
  id: string;
  isPinned: 0 | 1;
}
