import { Redis } from '@upstash/redis';

// Lazy initialization function to ensure env vars are available at runtime
const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Redis URL and Token are required');
  }

  return new Redis({
    url,
    token,
  });
};

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
  const redis = getRedisClient();
  await redis.set(id, JSON.stringify(data), { ex: ttlSeconds });
}

/**
 * Get content from Redis and immediately delete it (one-time access)
 * @param id Unique identifier for the content
 * @returns Content data or null if not found
 */
export async function getContent(id: string): Promise<StoredContent | null> {
  const redis = getRedisClient();
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
  const redis = getRedisClient();
  await redis.del(id);
}

/**
 * Check if content exists in Redis without retrieving or deleting it
 * @param id Unique identifier for the content
 * @returns boolean indicating if content exists
 */
export async function contentExists(id: string): Promise<boolean> {
  const redis = getRedisClient();
  const exists = await redis.exists(id);
  return exists === 1;
}

// Export a getter for direct access if needed
export const redisClient = getRedisClient;
