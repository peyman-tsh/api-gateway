import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException, ThrottlerStorage } from '@nestjs/throttler';
import { RedisService } from '../redis/redis.service';
import { Reflector } from '@nestjs/core';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  timestamp: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerGuard extends ThrottlerGuard {
  constructor(
    private readonly redisService: RedisService,
    protected readonly reflector: Reflector
  ) {
    const storage: ThrottlerStorage = {
      async increment(
        key: string, 
        ttl: number, 
        limit: number,
        blockDuration: number,
        throttlerName: string
      ): Promise<ThrottlerStorageRecord> {
        const count = await redisService.incr(key);
        if (count === 1) {
          await redisService.expire(key, ttl);
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
    };

    super(
      { throttlers: [{ ttl: 60, limit: 10 }] },
      storage,
      reflector
    );
  }

  protected async getTracker(req: any): Promise<string> {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    return `throttler:${ip}:${userAgent}`;
  }
}