import type { Database, Statement, Transaction } from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';
import { AnalyticsEvent } from './analytics-event';

export interface AnalyticsStorageConfig {
    filename: string;
    tableName?: string;
}

export class AnalyticsStorage {
    private _db: Database;
    private _insertEvent!: Statement<InsertEventParams>;
    private _insertManyEvents!: Transaction<(events: AnalyticsEvent[]) => void>;

    constructor(public readonly config: AnalyticsStorageConfig) {
        this._db = BetterSqlite3(config.filename);
        this._db.pragma('journal_mode = WAL');
        this._setup();
    }

    get tableName(): string {
        return this.config.tableName ?? 'analytics_event';
    }

    private _setup() {
        this._db.exec(`
            CREATE TABLE IF NOT EXISTS analytics_event (
                id              INTEGER PRIMARY KEY,
                type            TEXT NOT NULL,
                time            INTEGER NOT NULL,
                request         TEXT,
                page            TEXT,
                path            TEXT,
                referer         TEXT,
                ua              TEXT,
                ua_brand        TEXT,
                ua_mobile       TEXT,
                ua_platform     TEXT,
                lang            TEXT,
                tz              TEXT,
                v_width         INTEGER,
                v_height        INTEGER,
                s_width         INTEGER,
                s_height        INTEGER,
                scroll_amount   INTEGER,
                blur_elapsed    INTEGER
            )
        `);

        this._insertEvent = this._db.prepare<InsertEventParams>(`
            INSERT INTO ${this.tableName}
            (type, time, request, page, path, referer, ua, ua_brand, ua_mobile, ua_platform,
             lang, tz, v_width, v_height, s_width, s_height, scroll_amount, blur_elapsed)
            VALUES
            (@type, @time, @request, @page, @path, @referer, @ua, @ua_brand, @ua_mobile, @ua_platform,
             @lang, @tz, @v_width, @v_height, @s_width, @s_height, @scroll_amount, @blur_elapsed)
        `);

        this._insertManyEvents = this._db.transaction((events: AnalyticsEvent[]) => {
            for (const event of events) {
                this.appendEvent(event);
            }
        });
    }

    getVisitorsTest() {
        const stmt = this._db.prepare(`
            select "time" as x, count("date") as y
            from (
                select
                    "time",
                    (strftime('%s', "time" / 1000, 'unixepoch') / 60) as "date"
                from analytics_event
            )
            group by "date"
        `);
        return stmt.all() as { x: number; y: number }[];
    }

    appendEvent(event: AnalyticsEvent): void {
        const { type, time, ...rest } = event;
        switch (event.type) {
            case 'PAGE_REQUEST': {
                const { id, path, referer, ua, uaBrand, uaMobile, uaPlatform, lang } = event;
                this._insertEvent.run({
                    type,
                    time,
                    request: id,
                    page: null,
                    path,
                    referer: referer ?? null,
                    ua: ua ?? null,
                    ua_brand: uaBrand ?? null,
                    ua_mobile: uaMobile ?? null,
                    ua_platform: uaPlatform ?? null,
                    lang: lang ?? null,
                    tz: null,
                    v_width: null,
                    v_height: null,
                    s_width: null,
                    s_height: null,
                    scroll_amount: null,
                    blur_elapsed: null,
                });
                break;
            }

            case 'PAGE_OPEN': {
                const { request, page, path, tz, viewport, screen } = event;
                this._insertEvent.run({
                    type,
                    time,
                    request,
                    page,
                    path,
                    referer: null,
                    ua: null,
                    ua_brand: null,
                    ua_mobile: null,
                    ua_platform: null,
                    lang: null,
                    tz,
                    v_width: viewport[0],
                    v_height: viewport[1],
                    s_width: screen[0],
                    s_height: screen[1],
                    scroll_amount: null,
                    blur_elapsed: null,
                });
                break;
            }

            case 'PAGE_SCROLL': {
                const { page, amount } = event;
                this._insertEvent.run({
                    type,
                    time,
                    request: null,
                    page,
                    path: null,
                    referer: null,
                    ua: null,
                    ua_brand: null,
                    ua_mobile: null,
                    ua_platform: null,
                    lang: null,
                    tz: null,
                    v_width: null,
                    v_height: null,
                    s_width: null,
                    s_height: null,
                    scroll_amount: amount,
                    blur_elapsed: null,
                });
                break;
            }

            case 'PAGE_BLUR':
            case 'PAGE_FOCUS': {
                const { page } = event;
                const blur_elapsed = event.type === 'PAGE_FOCUS' ? event.elapsed : null;
                this._insertEvent.run({
                    type,
                    time,
                    request: null,
                    page,
                    path: null,
                    referer: null,
                    ua: null,
                    ua_brand: null,
                    ua_mobile: null,
                    ua_platform: null,
                    lang: null,
                    tz: null,
                    v_width: null,
                    v_height: null,
                    s_width: null,
                    s_height: null,
                    scroll_amount: null,
                    blur_elapsed,
                });
                break;
            }
        }
    }

    appendManyEvents(...events: AnalyticsEvent[]): void {
        this._insertManyEvents(events);
    }
}

interface InsertEventParams {
    type: AnalyticsEvent['type'];
    time: number;
    request: string | null;
    page: string | null;
    path: string | null;
    referer: string | null;
    ua: string | null;
    ua_brand: string | null;
    ua_mobile: string | null;
    ua_platform: string | null;
    lang: string | null;
    tz: string | null;
    v_width: number | null;
    v_height: number | null;
    s_width: number | null;
    s_height: number | null;
    scroll_amount: number | null;
    blur_elapsed: number | null;
}
