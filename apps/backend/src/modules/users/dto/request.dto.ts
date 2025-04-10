import { z } from 'zod';
import { insertUserSchema, updateUserSchema } from './schema.dto';

export type CreateUserDTO = z.infer<typeof insertUserSchema>;

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
