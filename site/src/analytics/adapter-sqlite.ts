import BetterSqlite3 from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { ModelAdapter, createModelAdapter } from './adapter';

export interface SqliteAdapterConfig {
    filename: string;
    table: string;
}

export function createSqliteAdapter(config: SqliteAdapterConfig): ModelAdapter {
    mkdirSync(dirname(config.filename), { recursive: true });

    const db = new BetterSqlite3(config.filename);

    db.pragma('journal_mode = WAL');

    db.exec(`
        CREATE TABLE IF NOT EXISTS ${config.table} (
            id                  INTEGER PRIMARY KEY,
            sid                 TEXT,
            pid                 TEXT,
            created             INTEGER NOT NULL,
            updated             INTEGER NOT NULL,
            path                TEXT NOT NULL,
            nojs                INTEGER NOT NULL,
            referrer            TEXT,
            is_unique           INTEGER,
            tz                  TEXT,
            ua                  TEXT,
            ua_mobile           INTEGER,
            ua_platform         TEXT,
            ua_brands           TEXT,
            vw                  INTEGER,
            vh                  INTEGER,
            sw                  INTEGER,
            sh                  INTEGER,
            total_absence       INTEGER NOT NULL,
            max_scroll          INTEGER NOT NULL,

            UNIQUE(pid),
            UNIQUE(sid, pid)
        );
    `);

    const cols = [
        'sid',
        'pid',
        'created',
        'updated',
        'path',
        'nojs',
        'referrer',
        'is_unique',
        'tz',
        'ua',
        'ua_mobile',
        'ua_platform',
        'ua_brands',
        'vw',
        'vh',
        'sw',
        'sh',
        'total_absence',
        'max_scroll',
    ];

    const insertCols = cols.map(x => `${x}`).join(', ');
    const insertValues = cols.map(x => `@${x}`).join(', ');

    const insert = db.prepare<Omit<SqlitePageEventModel, 'id'>>(`
        INSERT INTO ${config.table} (${insertCols})
        VALUES (${insertValues})
        ON CONFLICT (pid)
        DO NOTHING
    `);

    const update = db.prepare<{ pid: string; updated: number; absent: number; scroll: number }>(`
        UPDATE ${config.table} SET
            updated = @updated,
            total_absence = total_absence + @absent,
            max_scroll = MAX(max_scroll, @scroll)
        WHERE pid = @pid
    `);

    return createModelAdapter({
        async insert(arg) {
            insert.run({
                sid: arg.sid ?? null,
                pid: arg.pid ?? null,
                created: arg.created,
                updated: arg.created,
                path: arg.path,
                nojs: arg.nojs ? 1 : 0,
                referrer: arg.referrer ?? null,
                is_unique: toSqliteBoolean(arg.unique) ?? null,
                tz: arg.tz ?? null,
                ua: arg.ua ?? null,
                ua_mobile: toSqliteBoolean(arg.uaMobile) ?? null,
                ua_platform: arg.uaPlatform ?? null,
                ua_brands: arg.uaBrands ?? null,
                vw: arg.vw ?? null,
                vh: arg.vh ?? null,
                sw: arg.sw ?? null,
                sh: arg.sh ?? null,
                total_absence: 0,
                max_scroll: 0,
            });
        },

        async update(pid, updated, change) {
            update.run({
                pid,
                updated,
                absent: change.absent ?? 0,
                scroll: change.scroll ?? 0,
            });
        },

        generateUuuid() {
            return crypto.randomUUID();
        },
    });
}

interface SqlitePageEventModel {
    id: number;
    sid: string | null;
    pid: string | null;
    created: number;
    updated: number;
    path: string;
    nojs: 0 | 1;
    referrer: string | null;
    is_unique: 0 | 1 | null;
    tz: string | null;
    ua: string | null;
    ua_mobile: 0 | 1 | null;
    ua_platform: string | null;
    ua_brands: string | null;
    vw: number | null;
    vh: number | null;
    sw: number | null;
    sh: number | null;
    total_absence: number;
    max_scroll: number;
}

function toSqliteBoolean(value?: boolean): 0 | 1 | undefined {
    return typeof value === 'boolean' ? (value ? 1 : 0) : undefined;
}
