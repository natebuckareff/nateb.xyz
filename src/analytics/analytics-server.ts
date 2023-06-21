import { z } from 'zod';
import { AnalyticsEvent } from './analytics-event';
import { AnalyticsStorage } from './analytics-storage';

export interface AnalyticsServerConfig {
    storage: AnalyticsStorage;
    paths: {
        include?: string[];
        exclude?: string[];
    };
}

export class AnalyticsServer {
    private _include?: RegExp;
    private _exclude?: RegExp;

    constructor(public readonly config: AnalyticsServerConfig) {
        const { include, exclude } = config.paths;

        if (include === undefined && exclude === undefined) {
            throw Error('no server paths configured');
        }

        this._include = include && compilePathList(include);
        this._exclude = exclude && compilePathList(exclude);
    }

    filter(path: string): boolean {
        if (this._exclude && this._exclude.test(path)) {
            return false;
        }

        if (this._include && !this._include.test(path)) {
            return false;
        }

        return true;
    }

    emit(...events: AnalyticsEvent[]): void {
        const { length } = events;
        if (length === 1) {
            this.config.storage.appendEvent(events[0]);
        } else if (length > 1) {
            this.config.storage.appendManyEvents(...events);
        }
    }

    async emitFromRequest(request: Request): Promise<void> {
        const contentType = request.headers.get('content-type');
        if (contentType === 'application/json') {
            const payload = requestSchema.parse(await request.json());
            this.emit(...payload.events);
        }
    }
}

function compilePathList(paths: string[]) {
    const sorted = [...paths].sort();
    const terms: string[] = [];
    for (const x of sorted) {
        terms.push(`(^${prepare(x)}$)`);
    }
    return new RegExp(terms.join('|'));
}

function prepare(path: string) {
    const { length } = path;
    if (length > 1 && path[length - 1] === '/') {
        path = path.slice(0, -1);
    }
    path = path.replace(GLOBSTAR_PATH_REGEX, '(/.*)?');
    path = path.replace(GLOB_PATH_REGEX, '/([^/]*)');
    return path;
}

const GLOBSTAR_PATH_REGEX = /\/\*\*$/;
const GLOB_PATH_REGEX = /\/\*/g;

const zSafeNat = z.number().nonnegative().max(Number.MAX_SAFE_INTEGER);

const requestSchema = z.object({
    events: z.array(
        z.discriminatedUnion('type', [
            z.object({
                type: z.literal('PAGE_REQUEST'),
                time: zSafeNat,
                id: z.string().uuid(),
                path: z.string().max(256),
                referer: z.string().max(256).optional(),
                ua: z.string().max(256).optional(),
                uaBrand: z.string().max(64).optional(),
                uaMobile: z.string().max(64).optional(),
                uaPlatform: z.string().max(64).optional(),
                lang: z.string().max(64).optional(),
            }),

            z.object({
                type: z.literal('PAGE_OPEN'),
                time: zSafeNat,
                request: z.string().uuid(),
                page: z.string().uuid(),
                path: z.string().max(256),
                tz: z.string().max(32),
                viewport: z.tuple([zSafeNat, zSafeNat]),
                screen: z.tuple([zSafeNat, zSafeNat]),
            }),

            z.object({
                type: z.literal('PAGE_SCROLL'),
                time: zSafeNat,
                page: z.string().uuid(),
                amount: zSafeNat,
            }),

            z.object({
                type: z.literal('PAGE_BLUR'),
                time: zSafeNat,
                page: z.string().uuid(),
            }),

            z.object({
                type: z.literal('PAGE_FOCUS'),
                time: zSafeNat,
                page: z.string().uuid(),
                elapsed: zSafeNat,
            }),
        ])
    ),
});
