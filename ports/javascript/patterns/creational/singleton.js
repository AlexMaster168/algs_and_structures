export class AppConfig {
    static instance;
    values = new Map();
    constructor() { }
    static getInstance() {
        return (AppConfig.instance ??= new AppConfig());
    }
    set(key, value) {
        this.values.set(key, value);
        return this;
    }
    get(key, fallback) {
        return this.values.get(key) ?? fallback;
    }
}
export const lazySingleton = (create) => {
    let instance;
    return () => (instance ??= { value: create() }).value;
};
