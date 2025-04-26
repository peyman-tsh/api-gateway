import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  private readonly context: Map<string, any> = new Map();

  setRequest(request: Request) {
    this.context.set('request', request);
    this.context.set('requestId', this.generateRequestId());
    this.context.set('startTime', Date.now());
  }

  get request(): Request {
    return this.context.get('request');
  }

  get requestId(): string {
    return this.context.get('requestId');
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
} 