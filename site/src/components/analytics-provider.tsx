import { JSX, onMount } from 'solid-js';
import { ClientMetricsState, createClientMetrics, createClientMetricsState } from '~/analytics/client';

export default function AnalyticsProvider(props: { children: JSX.Element }) {
    let state: ClientMetricsState;

    onMount(() => {
        state = createClientMetricsState();
        createClientMetrics(state, {
            host: import.meta.env.VITE_DOMAIN,
            pixelPath: '/api/px/tiny.gif',
        });
    });

    return (
        <>
            <noscript>
                <img src="/api/px/tiny.gif?type=nojs" />
            </noscript>
            {props.children}
        </>
    );
}
