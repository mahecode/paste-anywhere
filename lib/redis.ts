import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface StoredContent {
  type: 'text' | 'image';
  content: string;
  createdAt: number;
  accessed: boolean;
}

/**
 * Store content in Redis with TTL (time to live)
 * @param id Unique identifier for the content
 * @param data Content data to store
 * @param ttlSeconds Time to live in seconds (default: 300 = 5 minutes)
 */
export async function storeContent(
  id: string,
  data: StoredContent,
  ttlSeconds: number = 300
): Promise<void> {
  await redis.set(id, JSON.stringify(data), { ex: ttlSeconds });
}

/**
 * Get content from Redis and immediately delete it (one-time access)
 * @param id Unique identifier for the content
 * @returns Content data or null if not found
 */
export async function getContent(id: string): Promise<StoredContent | null> {
  const data = await redis.get<StoredContent | string>(id);

  if (!data) {
    return null;
  }

  // Delete immediately after retrieval (one-time access)
  await redis.del(id);

  if (typeof data === 'object') {
    return data as StoredContent;
  }

  return JSON.parse(data);
}

/**
 * Delete content from Redis
 * @param id Unique identifier for the content
 */
export async function deleteContent(id: string): Promise<void> {
  await redis.del(id);
}

/**
 * Check if content exists in Redis without retrieving or deleting it
 * @param id Unique identifier for the content
 * @returns boolean indicating if content exists
 */
export async function contentExists(id: string): Promise<boolean> {
  const exists = await redis.exists(id);
  return exists === 1;
}

export default redis;
