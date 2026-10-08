export class AppConfig {
  private static instance: AppConfig | undefined;
  private readonly values = new Map<string, string>();

  private constructor() {}

  static getInstance(): AppConfig {
    return (AppConfig.instance ??= new AppConfig());
  }

  set(key: string, value: string): this {
    this.values.set(key, value);
    return this;
  }

  get(key: string, fallback?: string): string | undefined {
    return this.values.get(key) ?? fallback;
  }
}

export const lazySingleton = <T>(create: () => T): (() => T) => {
  let instance: { value: T } | undefined;
  return () => (instance ??= { value: create() }).value;
};
