import { APIEvent } from 'solid-start';
import { AnalyticsService } from '~/services/analytics-service';

const PIXEL_GIF = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff,
    0xff, 0xff, 0x21, 0xf9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00,
    0x01, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00,
]);

let analyticsService: AnalyticsService | undefined;

const NUMBER_REGEX = /^[0-9]+$/;

export async function GET(apiEvent: APIEvent) {
    const { request } = apiEvent;
    const { headers } = request;

    const url = new URL(request.url);

    let sid = apiEvent.params['id'];
    if (sid.endsWith('.gif')) sid = sid.slice(0, sid.length - 4);

    const time = Date.now();
    const lang = headers.get('accept-language') ?? undefined;
    const ua = headers.get('user-agent') ?? undefined;
    const ua_brand = headers.get('sec-ch-ua') ?? undefined;
    const ua_mobile = headers.get('sec-ch-ua-mobile') ?? undefined;
    const ua_platform = headers.get('sec-ch-ua-platform') ?? undefined;

    const path = url.searchParams.get('path') ?? undefined;
    const ref = url.searchParams.get('ref') ?? undefined;
    const tz = url.searchParams.get('tz') ?? undefined;
    const scroll = url.searchParams.get('scroll') ?? undefined;
    const toppStr: string | undefined = url.searchParams.get('topp') ?? undefined;

    let topp: number | undefined;
    if (toppStr && NUMBER_REGEX.test(toppStr)) {
        topp = +toppStr;
    }

    analyticsService ??= await AnalyticsService.use();

    analyticsService.insertEvent({
        sid,
        time,
        lang,
        ua,
        ua_brand,
        ua_mobile,
        ua_platform,
        path,
        ref,
        tz,
        scroll,
        topp,
    });

    return new Response(PIXEL_GIF, {
        status: 202,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Expires: '0',
            Pragma: 'no-cache',
        },
    });
}
