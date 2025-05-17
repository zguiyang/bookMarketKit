import { FastifyRequest } from 'fastify';
import {
  CreateBookmarkBody,
  UpdateBookmarkBody,
  BookmarkIdParam,
  SetFavoriteBody,
  SetPinnedBody,
  UpdateLastVisitTimeBody,
  BookmarkSearchQuery,
  BookmarkPageListQuery,
  BookmarkImportBody,
} from '@bookmark/schemas';
import { BookmarkService } from './bookmark.service';

export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  async create(req: FastifyRequest<{ Body: CreateBookmarkBody }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.create(userId, req.body);
  }

  async update(req: FastifyRequest<{ Body: UpdateBookmarkBody }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.update(userId, req.body);
  }

  async delete(req: FastifyRequest<{ Params: BookmarkIdParam }>) {
    const userId = req.currentUser.id;
    const { id } = req.params;
    return this.bookmarkService.delete(userId, id);
  }

  async favorite(req: FastifyRequest<{ Body: SetFavoriteBody }>) {
    // 使用注入的用户信息
    const userId = req.currentUser.id;
    return this.bookmarkService.favorite(userId, req.body);
  }

  async pinned(req: FastifyRequest<{ Body: SetPinnedBody }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.pinned(userId, req.body);
  }

  async all(req: FastifyRequest) {
    const userId = req.currentUser.id;
    return this.bookmarkService.findAll(userId);
  }

  async detail(req: FastifyRequest<{ Params: BookmarkIdParam }>) {
    const userId = req.currentUser.id;
    const { id } = req.params;
    return this.bookmarkService.findOne(userId, id);
  }

  async pageList(req: FastifyRequest<{ Querystring: BookmarkPageListQuery }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.pageList(userId, req.query);
  }

  async collection(req: FastifyRequest) {
    const userId = req.currentUser.id;
    return this.bookmarkService.findCollection(userId);
  }

  async visit(req: FastifyRequest<{ Body: UpdateLastVisitTimeBody }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.updateLastVisitTime(userId, req.body.id);
  }

  async search(req: FastifyRequest<{ Querystring: BookmarkSearchQuery }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.search(userId, req.query.keyword);
  }

  async import(req: FastifyRequest<{ Body: BookmarkImportBody }>) {
    const userId = req.currentUser.id;
    return this.bookmarkService.import(userId, req.body);
  }
}
