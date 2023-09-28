import { JSX, onCleanup, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

export default function AnalyticsProvider(props: { children: JSX.Element }) {
    let id: string;
    let startTime: number = 0;
    let timeOffPage: number = 0;
    let blurStartTime: number = 0;
    let maxScrollAmount: number = 0;
    let timeSinceLastEvent: number = 0;
    let scrollTimeout: NodeJS.Timeout | undefined;
    let scrollAmount: number | undefined;

    const handlePushState = () => {
        const currentTime = Date.now();

        let topp: number | undefined;
        if (startTime) {
            topp = currentTime - startTime - timeOffPage;
        }

        startTime = currentTime;
        timeOffPage = 0;
        maxScrollAmount = 0;

        const ref = encodeURI(document.referrer);
        const path = encodeURI(window.location.pathname);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Page view
        send({ id, params: { path, ref, tz, topp } });
        timeSinceLastEvent = Date.now();
    };

    const handleScroll = () => {
        const element = window.document.documentElement;
        const { scrollTop } = element;

        if (scrollTop > 0) {
            const { scrollHeight, clientHeight } = element;
            const amount = scrollTop ? scrollTop / (scrollHeight - clientHeight) : 0;
            const clampedAmount = Math.floor(amount * 20);

            if (clampedAmount > maxScrollAmount) {
                maxScrollAmount = clampedAmount;

                // Clear pending timeout
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = undefined;
                    scrollAmount = undefined;
                }

                const currentTime = Date.now();

                if (timeSinceLastEvent === 0 || currentTime - timeSinceLastEvent >= 5_000) {
                    // Scroll
                    const scroll = maxScrollAmount * 5;
                    send({ id, params: { scroll } });
                    timeSinceLastEvent = currentTime;
                } else {
                    let timeoutMs: number;
                    if (timeSinceLastEvent === 0) {
                        timeoutMs = 5_000;
                    } else {
                        timeoutMs = 5_000 - (currentTime - timeSinceLastEvent);
                    }

                    scrollAmount = maxScrollAmount * 5;

                    scrollTimeout = setTimeout(() => {
                        const scroll = scrollAmount;
                        scrollAmount = undefined;

                        // Scroll
                        send({ id, params: { scroll } });
                        timeSinceLastEvent = Date.now();
                    }, timeoutMs);
                }
            }
        }
    };

    const handleBlur = () => {
        // Start measuring time-off-page
        blurStartTime = Date.now();
    };

    const handleFocus = () => {
        if (blurStartTime) {
            // Add to the current total timeOffPage
            timeOffPage += Date.now() - blurStartTime;
            blurStartTime = 0;
        }
    };

    const handleBeforeunload = () => {
        const scroll = scrollAmount;
        if (scroll) {
            clearTimeout(scrollTimeout);
            scrollTimeout = undefined;
            scrollAmount = undefined;
        }

        // Measure final time-on-last-page
        const topp = Date.now() - startTime - timeOffPage;
        send({ id, params: { scroll, topp } });
        timeSinceLastEvent = Date.now();
    };

    onMount(() => {
        if (isServer) return;

        id = window.crypto.randomUUID();
        handlePushState();

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
            window.addEventListener('pushState', function () {
                handlePushState();
            });
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('beforeunload', handleBeforeunload);
    });

    onCleanup(() => {
        if (isServer) return;
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('beforeunload', handleBeforeunload);
    });

    return (
        <>
            <noscript>
                <img src="/api/px/noscript.gif" />
            </noscript>
            {props.children}
        </>
    );
}

interface SendArgs {
    id: string;
    params: { [key: string]: string | number | undefined };
}

function send(args: SendArgs) {
    const params: string[] = [];
    for (const k in args.params) {
        const v = args.params[k];
        if (v) {
            params.push(`${k}=${encodeURIComponent(v)}`);
        }
    }
    let src = `/api/px/${args.id}.gif`;
    if (params.length > 0) {
        src += '?' + params.join('&');
    }
    const img = new Image();
    img.src = src;
}
