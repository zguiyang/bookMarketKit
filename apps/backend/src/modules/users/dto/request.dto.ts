import { z } from 'zod';
import { insertUserSchema } from './schema.dto';

export type CreateUserDTO = z.infer<typeof insertUserSchema>;
