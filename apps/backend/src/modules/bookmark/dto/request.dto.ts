import { z } from 'zod';
import { insertBookmarkSchema, updateBookmarkSchema } from './schema.dto';

export type CreateBookmarkDTO = z.infer<typeof insertBookmarkSchema>;

export type UpdateBookmarkDTO = z.infer<typeof updateBookmarkSchema>;
