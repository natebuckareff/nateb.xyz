export type PageEvent = PageLoadNoJSAction | PageLoadEvent | PageLeftEvent | PageNavigateEvent;

// TODO
export interface PageLoadNoJSAction {
    type: 'page_load_nojs';
    time: number;
    path: string; // manually provided
    ua?: string;
    uaMobile?: boolean;
    uaPlatform?: string;
    uaBrands?: string;
}

export interface PageLoadEvent {
    type: 'page_load';
    time: number;
    sid: string;
    pid: string;
    path: string;
    referrer: string;
    unique: boolean;
    tz?: string;
    ua?: string;
    uaMobile?: boolean;
    uaPlatform?: string;
    uaBrands?: string;
    vw?: number;
    vh?: number;
    sw?: number;
    sh?: number;
}

export interface PageLeftEvent {
    type: 'page_left';
    time: number;
    sid: string;
    pid: string;
    absent?: number;
    scroll?: number;
}

export interface PageNavigateEvent {
    type: 'page_navigate';
    time: number;
    sid: string;
    pid: string;
    path: string;
    prevPage?: {
        pid: string;
        absent?: number;
        scroll?: number;
    };
}
