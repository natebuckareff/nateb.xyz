import BetterSqlite3, { Database, Statement } from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { env } from '../env';
import { Service } from '../service';

export class AnalyticsService extends Service {
    private _db: Database;
    private _insertEvent!: Statement<InsertEventParams>;

    constructor() {
        super();
        mkdirSync(dirname(env.get('SITE_SQLITE_FILE')), { recursive: true });
        console.log({ SITE_SQLITE_FILE: env.get('SITE_SQLITE_FILE') });
        this._db = new BetterSqlite3(env.get('SITE_SQLITE_FILE'));
        this._db.pragma('journal_mode = WAL');
        this._setup();
    }

    private _setup() {
        this._db.exec(`
            CREATE TABLE IF NOT EXISTS analytics (
                id              INTEGER PRIMARY KEY,
                sid             TEXT NOT NULL,
                time            INTEGER NOT NULL,
                lang            TEXT,
                ua              TEXT,
                ua_brand        TEXT,
                ua_mobile       TEXT,
                ua_platform     TEXT,
                path            TEXT,
                ref             TEXT,
                tz              TEXT,
                scroll          TEXT,
                topp            INTEGER
            )
        `);

        this._insertEvent = this._db.prepare<InsertEventParams>(`
            INSERT INTO analytics
            (sid, time, lang, ua, ua_brand, ua_mobile, ua_platform, path, ref, tz, scroll, topp)
            VALUES (@sid, @time, @lang, @ua, @ua_brand, @ua_mobile, @ua_platform, @path, @ref, @tz, @scroll, @topp)
        `);
    }

    insertEvent(params: InsertEventParams): void {
        this._insertEvent.run(params);
    }
}

export interface InsertEventParams {
    sid: string;
    time: number;
    lang?: string;
    ua?: string;
    ua_brand?: string;
    ua_mobile?: string;
    ua_platform?: string;
    path?: string;
    ref?: string;
    tz?: string;
    scroll?: string;
    topp?: number;
}
