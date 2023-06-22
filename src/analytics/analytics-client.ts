import { AnalyticsEvent } from './analytics-event';

export interface AnalyticsClientConfig {
    updateFreq?: number;
    scrollThreshold?: number;
    apiEndpoint: string;
}

export class AnalyticsClient {
    private _request: string;
    private _page?: string;
    private _scrollState: number | undefined;
    private _timeout: NodeJS.Timeout | undefined;
    private _events: AnalyticsEvent[];

    private _handleScroll: () => void;
    private _handleWindowBlur: () => void;
    private _handleWindowFocus: () => void;

    constructor(request: string, public readonly config: AnalyticsClientConfig) {
        this._request = request;
        this._events = [];

        this._setTimeout();

        this._handleScroll = () => this._scroll();
        this._handleWindowBlur = () => this.pageBlur();
        this._handleWindowFocus = () => this.pageFocus();

        window.addEventListener('scroll', this._handleScroll);
        window.addEventListener('blur', this._handleWindowBlur);
        window.addEventListener('focus', this._handleWindowFocus);
    }

    private _setTimeout() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this._handleTimeout(), this.config.updateFreq);
    }

    private _handleTimeout() {
        this._setTimeout();
        this._send();
    }

    private _scroll() {
        const element = window.document.documentElement;

        const { scrollTop } = element;

        if (scrollTop > 0) {
            const { scrollHeight, clientHeight } = element;

            const amount = scrollTop ? scrollTop / (scrollHeight - clientHeight) : 0;

            this._scrollState ??= amount;

            const change = Math.abs(amount - this._scrollState);

            if (change >= this.scrollThreshold) {
                this._scrollState = amount;
                this.pageScroll(amount);
            }
        }
    }

    get updateFreq(): number {
        return this.config.updateFreq ?? 5_000;
    }

    get scrollThreshold(): number {
        return this.config.scrollThreshold ?? 0.05;
    }

    get blurTime(): number {
        const last = this._events[this._events.length - 1];
        return last?.type === 'PAGE_BLUR' ? Date.now() - last.time : 0;
    }

    cleanup() {
        window.removeEventListener('focus', this._handleWindowFocus);
        window.removeEventListener('blur', this._handleWindowBlur);
        window.removeEventListener('scroll', this._handleScroll);
    }

    pageOpen(path: string, tz: string): void {
        this._page = window.crypto.randomUUID
            ? window.crypto.randomUUID()
            : '00000000-0000-0000-0000-000000000000';

        const { innerWidth, innerHeight } = window;
        const { width, height } = screen;

        this._emit({
            type: 'PAGE_OPEN',
            time: Date.now(),
            request: this._request,
            page: this._page,
            path,
            tz,
            viewport: [innerWidth, innerHeight],
            screen: [width, height],
        });
    }

    pageScroll(amount: number): void {
        if (!this._page) throw Error('page id not set');

        const last = this._events[this._events.length - 1];

        if (last && last.type === 'PAGE_SCROLL' && last.page === this._page) {
            if (amount > last.amount) {
                last.time = Date.now();
                last.amount = amount;
                this._update();
            }
            return;
        }

        this._emit({
            type: 'PAGE_SCROLL',
            time: Date.now(),
            page: this._page,
            amount,
        });
    }

    pageFocus(): void {
        if (!this._page) throw Error('page id not set');
        this._emit({
            type: 'PAGE_FOCUS',
            time: Date.now(),
            page: this._page,
            elapsed: this.blurTime,
        });
    }

    pageBlur(): void {
        if (!this._page) throw Error('page id not set');
        const time = Date.now();
        this._emit({
            type: 'PAGE_BLUR',
            time,
            page: this._page,
        });
        this._send();
    }

    private _emit(event: AnalyticsEvent): void {
        this._events.push(event);
        this._update();
    }

    private _update(): void {
        if (this._events.length > 1) {
            const first = this._events[0];
            const last = this._events[this._events.length - 1];
            const elapsed = last.time - first.time;
            if (elapsed >= this.updateFreq) {
                this._send();
            }
        }
    }

    private async _send(): Promise<void> {
        if (this._events.length === 0) return;
        const { _events } = this;
        this._events = [];

        fetch(this.config.apiEndpoint, {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ events: _events }),
        });
    }
}
