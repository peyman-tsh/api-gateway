import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Optionally log for debugging
    // console.log('Inside ThrottlerBehindProxyGuard');
    // console.log(req.ips);
    return req.ips && req.ips.length ? req.ips[0] : req.ip;
  }
}
