import { WebsiteMetaCreateBody, WebsiteMetaUpdateBody, WebsiteMetaResponse } from '@bookmark/schemas';
import { WebsiteMetaModel } from '@/models/website-meta.model';

export class WebsiteMetaService {
  constructor() {}
  async create(data: WebsiteMetaCreateBody): Promise<WebsiteMetaResponse> {
    const { url, bookmarkId } = data;

    const newMeta = await WebsiteMetaModel.create({
      url,
      bookmark: bookmarkId,
    });
    return newMeta.toJSON<WebsiteMetaResponse>();
  }

  async update(data: WebsiteMetaUpdateBody): Promise<boolean> {
    const { id, ...rest } = data;
    const updated = await WebsiteMetaModel.updateOne({ _id: id }, rest);
    return updated.modifiedCount > 0;
  }
}
