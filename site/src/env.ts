// Server-only: reads process.env, which does not exist in the browser
const parsers = {
    ENV(value: string | undefined) {
        if (value !== 'development' && value !== 'production') {
            throw new Error(`ENV must be "development" or "production", got ${JSON.stringify(value)}`);
        }
        return value;
    },
    SITE_SQLITE_FILE(value: string | undefined) {
        if (!value) {
            throw new Error('SITE_SQLITE_FILE is not set');
        }
        return value;
    },
};

type Parsers = typeof parsers;
type Key = keyof Parsers;

// Each variable is parsed on first use
const parsed: { [K in Key]?: ReturnType<Parsers[K]> } = {};

export const env = {
    get<K extends Key>(key: K): ReturnType<Parsers[K]> {
        let value = parsed[key];
        if (value === undefined) {
            value = parsers[key](process.env[key]) as ReturnType<Parsers[K]>;
            parsed[key] = value;
        }
        return value;
    },
};
