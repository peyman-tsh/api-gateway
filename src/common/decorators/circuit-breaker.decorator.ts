import * as CircuitBreaker from 'opossum';

export const circuitBreakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};

export function UseCircuitBreaker() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const breaker = new CircuitBreaker(originalMethod, circuitBreakerOptions);

    descriptor.value = async function (...args: any[]) {
      return await breaker.fire(...args);
    };

    return descriptor;
  };
} 