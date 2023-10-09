import { PageEvent, PageLeftEvent, PageLoadEvent, PageNavigateEvent } from './event';
import { encodeQueryParams } from './search-params';
import { getURLPathname } from './util';

export interface ClientMetricsConfig {
    host: string;
    pixelPath: string;
}

export interface ClientMetricsState {
    sid: string;
    pid: string;
    prevPid?: string;
    leftAt: number;
    returnedAt: number;
    scrolled: number;
}

export function createClientMetricsState(): ClientMetricsState {
    return {
        sid: window.crypto.randomUUID(),
        pid: window.crypto.randomUUID(),
        leftAt: 0,
        returnedAt: 0,
        scrolled: 0,
    };
}

export function createClientMetrics(state: ClientMetricsState, config: ClientMetricsConfig) {
    // Load pixel
    const { pixelPath } = config;
    const send = (event: PageEvent) => {
        new Image().src = getPixelGifSrc(pixelPath, event);
    };

    // Send page_load event
    const { host } = config;
    send(createPageLoadEvent(state, host));

    createPushStateListener(() => {
        // Send page_navigate event
        send(createPageNavigateEvent(state));
    });

    createScrollListener(newPosition => {
        // Update scroll position
        state.scrolled = Math.max(state.scrolled, newPosition);
    });

    createVisibilityListener(visible => {
        const time = Date.now();

        if (visible) {
            state.returnedAt = time;
        } else {
            state.leftAt = time;

            // Send page_left event
            send(createPageLeftEvent(state));
        }
    });
}

function getPixelGifSrc(pixelPath: string, event: PageEvent): string {
    switch (event.type) {
        case 'page_load_nojs':
            throw Error();

        case 'page_load': {
            const { type, ...rest } = event;
            return `${pixelPath}${encodeQueryParams({ type: 'plo', ...rest })}`;
        }

        case 'page_left': {
            const { type, ...rest } = event;
            return `${pixelPath}${encodeQueryParams({ type: 'ple', ...rest })}`;
        }

        case 'page_navigate':
            const { time, sid, pid, path, prevPage } = event;
            return `${pixelPath}${encodeQueryParams({
                type: 'n',
                time,
                sid,
                pid,
                path,
                prevPid: prevPage?.pid ?? null,
                absent: prevPage?.absent ?? null,
                scroll: prevPage?.scroll ?? null,
            })}`;
    }
}

function createPushStateListener(listener: () => void) {
    // Adapted from SA
    const dis: any = window.dispatchEvent;
    const his: any = window.history;
    const hisPushState = his ? his.pushState : null;
    if (hisPushState && Event && dis) {
        var stateListener = function (type: any) {
            var orig = his[type];
            return function (this: any) {
                var rv = orig.apply(this, arguments);
                var event: any = new Event(type);
                event.arguments = arguments;
                dis(event);
                return rv;
            };
        };
        his.pushState = stateListener('pushState');
        window.addEventListener('pushState', () => {
            listener();
        });
    }
}

function createScrollListener(listener: (newPosition: number) => void) {
    const { documentElement } = document;
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = documentElement;
        const amount = scrollTop ? scrollTop / (scrollHeight - clientHeight) : 0;
        const position = Math.floor(amount * 20) * 5;
        listener(position);
    });
}

function createVisibilityListener(listener: (visible: boolean) => void) {
    window.addEventListener('visibilitychange', function () {
        const visible = document.visibilityState === 'visible';
        listener(visible);
    });
}

function createPageLoadEvent(state: ClientMetricsState, host: string): PageLoadEvent {
    const referrer = document.referrer;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const ua = navigator.userAgent;

    const { userAgentData } = navigator;
    const uaMobile = userAgentData?.mobile;
    const uaPlatform = userAgentData?.platform;
    const uaBrandsValue = userAgentData?.brands;

    let uaBrands: string | undefined;
    if (uaBrandsValue && uaBrandsValue.length > 0) {
        uaBrands = uaBrandsValue
            .map(x => `${JSON.stringify(x.brand)};${JSON.stringify(x.version)}`)
            .join(', ');
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sw = window.screen.width;
    const sh = window.screen.height;

    state.prevPid = state.pid;
    state.pid = window.crypto.randomUUID();

    return {
        type: 'page_load',
        time: Date.now(),
        sid: state.sid,
        pid: state.pid,
        path: window.location.pathname,
        referrer,
        unique: isUnique(host, referrer),
        tz,
        ua,
        uaMobile,
        uaPlatform,
        uaBrands,
        vw,
        vh,
        sw,
        sh,
    };
}

function isUnique(host: string, referrer: string): boolean {
    return getURLPathname(referrer) !== host;
}

function createPageLeftEvent(state: ClientMetricsState): PageLeftEvent {
    let absent: number | undefined;
    if (state.returnedAt > state.leftAt) {
        absent = state.returnedAt - state.leftAt;
        state.leftAt = 0;
        state.returnedAt = 0;
    }

    let scroll: number | undefined;
    if (state.scrolled > 0) {
        scroll = state.scrolled;
        state.scrolled = 0;
    }

    const event: PageLeftEvent = {
        type: 'page_left',
        time: Date.now(),
        sid: state.sid,
        pid: state.pid,
    };

    if (absent !== undefined) event.absent = absent;
    if (scroll !== undefined) event.scroll = scroll;

    return event;
}

function createPageNavigateEvent(state: ClientMetricsState): PageNavigateEvent {
    let prevPage: PageNavigateEvent['prevPage'] = { pid: state.pid };

    if (state.returnedAt > state.leftAt) {
        // prevPage ??= { pid: state.pid };
        prevPage.absent = state.returnedAt - state.leftAt;
        state.leftAt = 0;
        state.returnedAt = 0;
    }

    if (state.scrolled > 0) {
        // prevPage ??= { pid: state.pid };
        prevPage.scroll = state.scrolled;
        state.scrolled = 0;
    }

    state.prevPid = state.pid;
    state.pid = window.crypto.randomUUID();

    const event: PageNavigateEvent = {
        type: 'page_navigate',
        time: Date.now(),
        sid: state.sid,
        pid: state.pid,
        path: window.location.pathname,
        prevPage,
    };

    if (prevPage !== undefined) event.prevPage = prevPage;

    return event;
}
