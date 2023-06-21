import crypto from 'node:crypto';
import { StartServer, createHandler, renderAsync } from 'solid-start/entry-server';
import { analyticsService } from './analytics-service';

export default createHandler(
    // Server-side analytics
    ({ forward }) => {
        return async event => {
            const request = event.request;
            const url = new URL(request.url);
            const path = url.pathname;

            if (analyticsService.filter(path)) {
                const id = crypto.webcrypto.randomUUID();
                analyticsService.emit({
                    type: 'PAGE_REQUEST',
                    time: Date.now(),
                    id,
                    path,
                    referer: request.headers.get('referer') || undefined,
                    ua: request.headers.get('user-agent') || undefined,
                    uaBrand: request.headers.get('sec-ch-ua') || undefined,
                    uaMobile: request.headers.get('sec-ch-ua-mobile') || undefined,
                    uaPlatform: request.headers.get('sec-ch-ua-platform') || undefined,
                    lang: request.headers.get('accept-language') || undefined,
                });
                event.locals['x-request-id'] = id;
            }

            return forward(event);
        };
    },

    renderAsync(event => <StartServer event={event} />)
);
