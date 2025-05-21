import { z } from 'zod';

export const WebsiteMetaFetchEnums = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export const websiteMetaSchema = z.object({
  url: z.string(),
  bookmark: z.string(),
  ogsResult: z.string().optional(),
  ogsResponse: z.string().optional(),
  ogsHtml: z.string().optional(),
  error: z.string().optional(),
  fetchStatus: z.enum([WebsiteMetaFetchEnums.SUCCESS, WebsiteMetaFetchEnums.FAILED]).nullable(),
});

export const websiteMetaResponseSchema = websiteMetaSchema.extend({
  _id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const websiteMetaCreateBodySchema = z.object({
  bookmarkId: z.string(),
  url: z.string(),
});

export const websiteMetaUpdateBodySchema = websiteMetaSchema.partial().merge(
  z.object({
    id: z.string(),
  })
);

export type WebsiteMetaModelSchema = z.infer<typeof websiteMetaSchema>;
export type WebsiteMetaResponse = z.infer<typeof websiteMetaResponseSchema>;
export type WebsiteMetaCreateBody = z.infer<typeof websiteMetaCreateBodySchema>;
export type WebsiteMetaUpdateBody = z.infer<typeof websiteMetaUpdateBodySchema>;
