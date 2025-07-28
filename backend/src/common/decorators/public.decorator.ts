import 'reflect-metadata';

export const IS_PUBLIC_KEY = 'isPublic';

export function Public() {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      Reflect.defineMetadata(IS_PUBLIC_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(IS_PUBLIC_KEY, true, target);
    }
  };
}
