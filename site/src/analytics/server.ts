import { PageEvent, PageLeftEvent, PageLoadEvent, PageLoadNoJSAction, PageNavigateEvent } from './event';
import { getURLPathname } from './util';

export function deserializePixelGifRequest(request: Request): PageEvent | undefined {
    const url = new URL(request.url);
    const { searchParams } = url;
    const type = searchParams.get('type');

    switch (type) {
        case 'nojs':
            return parsePageLoadNoJSRequest(request);

        case 'plo':
            return parsePageLoadRequest(searchParams);

        case 'ple':
            return parsePageLeftRequest(searchParams);

        case 'n':
            return parsePageNavigateRequest(searchParams);
    }
}

export function createPixelGifResponse() {
    return new Response(PIXEL_GIF, {
        status: 202,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Expires: '0',
            Pragma: 'no-cache',
        },
    });
}

const PIXEL_GIF = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff,
    0xff, 0xff, 0x21, 0xf9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00,
    0x01, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00,
]);

const UUID_REGEX = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const NUMBER_REGEX = /^[0-9]+$/;

function parsePageLoadNoJSRequest(request: Request): PageLoadNoJSAction | undefined {
    const { headers } = request;

    const referrer = request.headers.get('referer');
    const path = referrer && (getURLPathname(referrer) ?? null);
    const ua = headers.get('user-agent') ?? undefined;
    const uaBrands = headers.get('sec-ch-ua') ?? undefined;
    const uaMobile = headers.get('sec-ch-ua-mobile') ?? undefined;
    const uaPlatform = headers.get('sec-ch-ua-platform') ?? undefined;

    if (path === null) return;

    return {
        type: 'page_load_nojs',
        time: Date.now(),
        path,
        ua,
        uaMobile: uaMobile === '?1',
        uaPlatform: uaPlatform,
        uaBrands,
    };
}

function parsePageLoadRequest(searchParams: URLSearchParams): PageLoadEvent | undefined {
    const time = searchParams.get('time');
    const sid = searchParams.get('sid');
    const pid = searchParams.get('pid');
    const path = searchParams.get('path');
    const referrer = searchParams.get('referrer');
    const unique = searchParams.get('unique');
    const tz = searchParams.get('tz');
    const ua = searchParams.get('ua');
    const uaMobile = searchParams.get('uaMobile');
    const uaPlatform = searchParams.get('uaPlatform');
    const uaBrands = searchParams.get('uaBrands');
    const vw = searchParams.get('vw');
    const vh = searchParams.get('vh');
    const sw = searchParams.get('sw');
    const sh = searchParams.get('sh');

    if (time === null || !NUMBER_REGEX.test(time)) return;
    if (sid === null || !UUID_REGEX.test(sid)) return;
    if (pid === null || !UUID_REGEX.test(pid)) return;
    if (path === null) return;
    if (referrer === null) return;
    if (unique === null || !(unique === '0' || unique === '1')) return;
    if (uaMobile !== null && !(uaMobile === '0' || uaMobile === '1')) return;
    if (vw !== null && !NUMBER_REGEX.test(vw)) return;
    if (vh !== null && !NUMBER_REGEX.test(vh)) return;
    if (sw !== null && !NUMBER_REGEX.test(sw)) return;
    if (sh !== null && !NUMBER_REGEX.test(sh)) return;

    return {
        type: 'page_load',
        time: +time,
        sid,
        pid,
        path,
        referrer,
        unique: unique === '1',
        tz: tz ?? undefined,
        ua: ua ?? undefined,
        uaMobile: uaMobile ? uaMobile === '1' : undefined,
        uaPlatform: uaPlatform ?? undefined,
        uaBrands: uaBrands ?? undefined,
        vw: (vw && +vw) || undefined,
        vh: (vh && +vh) || undefined,
        sw: (sw && +sw) || undefined,
        sh: (sh && +sh) || undefined,
    };
}

function parsePageLeftRequest(searchParams: URLSearchParams): PageLeftEvent | undefined {
    const time = searchParams.get('time');
    const sid = searchParams.get('sid');
    const pid = searchParams.get('pid');
    const absent = searchParams.get('absent');
    const scroll = searchParams.get('scroll');

    if (time === null || !NUMBER_REGEX.test(time)) return;
    if (sid === null || !UUID_REGEX.test(sid)) return;
    if (pid === null || !UUID_REGEX.test(pid)) return;
    if (absent !== null && !NUMBER_REGEX.test(absent)) return;
    if (scroll !== null && !NUMBER_REGEX.test(scroll)) return;

    return {
        type: 'page_left',
        time: +time,
        sid,
        pid,
        absent: absent === null ? undefined : +absent,
        scroll: scroll === null ? undefined : +scroll,
    };
}

function parsePageNavigateRequest(searchParams: URLSearchParams): PageNavigateEvent | undefined {
    const time = searchParams.get('time');
    const sid = searchParams.get('sid');
    const pid = searchParams.get('pid');
    const path = searchParams.get('path');
    const prevPid = searchParams.get('prevPid');
    const absent = searchParams.get('absent');
    const scroll = searchParams.get('scroll');

    if (time === null || !NUMBER_REGEX.test(time)) return;
    if (sid === null || !UUID_REGEX.test(sid)) return;
    if (pid === null || !UUID_REGEX.test(pid)) return;
    if (path === null) return;
    if (prevPid !== null && !UUID_REGEX.test(prevPid)) return;
    if (absent !== null && !NUMBER_REGEX.test(absent)) return;
    if (scroll !== null && !NUMBER_REGEX.test(scroll)) return;

    let prevPage: PageNavigateEvent['prevPage'];
    if (prevPid) {
        prevPage = {
            pid: prevPid,
            absent: absent === null ? undefined : +absent,
            scroll: scroll === null ? undefined : +scroll,
        };
    }

    return {
        type: 'page_navigate',
        time: +time,
        sid,
        pid,
        path,
        prevPage,
    };
}
