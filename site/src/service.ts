export type Constructor<T> = { new (): T };

export class Service {
    // @ts-ignore
    private static _instance?: Service;

    static async use<T>(this: Constructor<T>): Promise<T> {
        if (!(this as any)._instance) {
            (this as any)._instance = new this();
            await (this as any)._instance.init();
        }
        return (this as any)._instance;
    }

    async init(): Promise<this> {
        return this;
    }
}
