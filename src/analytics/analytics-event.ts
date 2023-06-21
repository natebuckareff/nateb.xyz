export type AnalyticsEvent =
    | AnalyticsEvent.PageRequest
    | AnalyticsEvent.PageOpen
    | AnalyticsEvent.PageScroll
    | AnalyticsEvent.PageBlur
    | AnalyticsEvent.PageFocus;

export namespace AnalyticsEvent {
    export interface PageRequest {
        type: 'PAGE_REQUEST';
        time: number;
        id: string;
        path: string;
        referer?: string;
        ua?: string;
        uaBrand?: string;
        uaMobile?: string;
        uaPlatform?: string;
        lang?: string;
    }

    export interface PageOpen {
        type: 'PAGE_OPEN';
        time: number;
        request: string;
        page: string;
        path: string;
        tz: string;
        viewport: [number, number];
        screen: [number, number];
    }

    export interface PageScroll {
        type: 'PAGE_SCROLL';
        time: number;
        page: string;
        amount: number;
    }

    export interface PageBlur {
        type: 'PAGE_BLUR';
        time: number;
        page: string;
    }

    export interface PageFocus {
        type: 'PAGE_FOCUS';
        time: number;
        page: string;
        elapsed: number; // `blur_elapsed`
    }
}
