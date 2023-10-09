import { APIEvent } from 'solid-start';
import { createSqliteAdapter } from '~/analytics/adapter-sqlite';
import { createPixelGifResponse, deserializePixelGifRequest } from '~/analytics/server';
import { env } from '~/env';

const adapter = createSqliteAdapter({
    filename: env.get('SITE_SQLITE_FILE'),
    table: 'analytics_page_event',
});

export async function GET(apiEvent: APIEvent) {
    const event = deserializePixelGifRequest(apiEvent.request);
    if (event) adapter(event);
    return createPixelGifResponse();
}
