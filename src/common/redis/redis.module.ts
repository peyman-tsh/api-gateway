// import { Module, Global } from "@nestjs/common";
// import { Redis } from "ioredis";
// import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

// @Module({
//   providers: [
//       CacheModule.registerAsync({
//         useFactory: () => {
//           if (CONFIG_CACHE.strategy === "redis") {
//             return {
//               store: redisStore,
//               url: REDIS_URI,
//               ttl: CONFIG_CACHE.ttl,
//             };
//           } else {
//             return {
//               ttl: CONFIG_CACHE.ttl,
//             };
//           }
//         },
//       }),
//   ],
//   exports: [RedisService,ThrottlerStorageRedisService]
// })
// export class RedisModule {} 