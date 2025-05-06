import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Redis } from 'ioredis';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  timestamp: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async getRecord(key: string): Promise<number[]> {
    const record = await this.redisClient.get(key);
    return record ? JSON.parse(record) : [];
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const record = await this.getRecord(key);
    record.push(Date.now());
    await this.redisClient.set(key, JSON.stringify(record), 'EX', ttl);
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    const count = await this.redisClient.incr(key);
    if (count === 1) {
      await this.redisClient.expire(key, ttl);
    }

    const isBlocked = count > limit;
    return {
      totalHits: count,
      timeToExpire: ttl,
      timestamp: Date.now(),
      isBlocked,
      timeToBlockExpire: isBlocked ? blockDuration : 0
    };
  }
}