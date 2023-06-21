import { AnalyticsServer } from './analytics/analytics-server';
import { AnalyticsStorage } from './analytics/analytics-storage';
import { env } from './env';

export const analyticsService = new AnalyticsServer({
    storage: new AnalyticsStorage({
        filename: env.get('SQLITE_FILENAME'),
    }),
    paths: {
        exclude: ['/api/**', '/_m/**', '/favicon.ico'],
    },
});
