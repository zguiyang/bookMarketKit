export const QueueConfig = {
  queuePrefix: 'queue_tasks',
  bookmark: {
    fetchMeta: 'bookmark_fetchMeta',
  },
  cache: {
    META_CACHE_PREFIX: 'bmk:meta:',
  },
} as const;
