import { z } from 'zod';
import { Env } from 'zod-lazy-env';

export const env = Env.use({
    schema: {
        DEPLOY_COMMIT: z.string().default(import.meta.env.VITE_DEPLOY_COMMIT),

        DEPLOY_TIMESTAMP: z
            .string()
            .regex(/^[0-9]+$/)
            .transform(x => +x)
            .default(import.meta.env.VITE_DEPLOY_TIMESTAMP),

        ARTICLES_DIRNAME: z.string(),
        SQLITE_FILENAME: z.string(),
    },
});
