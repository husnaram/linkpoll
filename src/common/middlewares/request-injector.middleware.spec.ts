import { RequestInjectorMiddleware } from './request-injector.middleware';

describe('RequestInjectorMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestInjectorMiddleware()).toBeDefined();
  });
});
