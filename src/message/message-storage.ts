import type { Database, Statement } from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';

export interface MessageStorageConfig {
    filename: string;
    tableName?: string;
}

export class MessageStorage {
    private _db: Database;
    private _insertMessage!: Statement<InsertMessageParams>;

    constructor(public readonly config: MessageStorageConfig) {
        this._db = BetterSqlite3(config.filename);
        this._db.pragma('journal_mode = WAL');
        this._setup();
    }

    get tableName(): string {
        return this.config.tableName ?? 'message';
    }

    private _setup() {
        this._db.exec(`
            CREATE TABLE IF NOT EXISTS message (
                id          INTEGER PRIMARY KEY,
                time        DATETIME DEFAULT current_timestamp,
                name        TEXT NOT NULL,
                email       TEXT NOT NULL,
                message     TEXT NOT NULL
            )
        `);

        this._insertMessage = this._db.prepare<InsertMessageParams>(`
            INSERT INTO ${this.tableName} (name, email, message)
            VALUES (@name, @email, @message)
        `);
    }

    appendMessage(message: InsertMessageParams): void {
        this._insertMessage.run(message);
    }
}

interface InsertMessageParams {
    name: string;
    email: string;
    message: string;
}
