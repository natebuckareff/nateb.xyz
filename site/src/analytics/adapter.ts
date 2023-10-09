import { PageEvent } from './event';

export interface PageEventModel<UUID = string, Time = number> {
    id: number; // primary key
    sid?: UUID;
    pid?: UUID;
    created: Time;
    updated: Time;
    path: string;
    nojs: boolean;
    referrer?: string;
    unique?: boolean;
    tz?: string;
    ua?: string;
    uaMobile?: boolean;
    uaPlatform?: string;
    uaBrands?: string;
    vw?: number;
    vh?: number;
    sw?: number;
    sh?: number;
    totalAbsence: number;
    maxScroll: number;
    // unique(pid)
    // unique(sid, pid)
}

export interface ModelAdapterConfig {
    insert(arg: Omit<PageEventModel, 'id' | 'updated'>): Promise<void>;
    update(pid: string, updated: number, change: ModelChange): Promise<void>;
    generateUuuid(): string;
}

export interface ModelChange {
    absent?: number;
    scroll?: number;
}

export type ModelAdapter = (clientEvent: PageEvent) => Promise<void>;

export function createModelAdapter(config: ModelAdapterConfig): ModelAdapter {
    return async (clientEvent: PageEvent) => {
        switch (clientEvent.type) {
            case 'page_load_nojs': {
                const { type, time, path, ...rest } = clientEvent;
                return config.insert({
                    created: time,
                    path: path,
                    nojs: true,
                    ...rest,
                    totalAbsence: 0,
                    maxScroll: 0,
                });
            }

            case 'page_load': {
                const { type, time, sid, pid, path, referrer, unique, ...rest } = clientEvent;
                return config.insert({
                    sid,
                    pid,
                    created: time,
                    path,
                    nojs: false,
                    referrer,
                    unique,
                    ...rest,
                    totalAbsence: 0,
                    maxScroll: 0,
                });
            }

            case 'page_left': {
                const { time, pid, absent, scroll } = clientEvent;
                return config.update(pid, time, { absent, scroll });
            }

            case 'page_navigate': {
                const { time, sid, pid, path, prevPage } = clientEvent;

                if (prevPage !== undefined) {
                    const { pid, absent, scroll } = prevPage;
                    await config.update(pid, time, { absent, scroll });
                }

                return config.insert({
                    sid,
                    pid,
                    created: time,
                    path,
                    nojs: false,
                    unique: false,
                    totalAbsence: 0,
                    maxScroll: 0,
                });
            }
        }
    };
}
