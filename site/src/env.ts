import { z } from 'zod';
import { Env } from 'zod-lazy-env';

export const env = Env.use({
    schema: {
        ENV: z.enum(['development', 'production']),
        SITE_SQLITE_FILE: z.string(),
    },
});
