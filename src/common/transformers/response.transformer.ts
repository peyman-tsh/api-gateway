import { Injectable } from '@nestjs/common';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseTransformer {
  transform<T>(data: T, path: string): ApiResponse<T> {
    return {
      success: true,
      data,
      error: null,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  error(message: string, path: string): ApiResponse<null> {
    return {
      success: false,
      data: null,
      error: message,
      timestamp: new Date().toISOString(),
      path,
    };
  }
} 