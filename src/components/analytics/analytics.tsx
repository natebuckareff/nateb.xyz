import { JSX, createEffect, onCleanup, onMount } from 'solid-js';
import { useLocation } from 'solid-start';
import { AnalyticsClient } from '~/analytics/analytics-client';

export interface AnalyticsProps {
    requestId: string;
    children: JSX.Element;
}

export default function Analytics(props: AnalyticsProps) {
    let client: AnalyticsClient;

    const location = useLocation();

    onMount(() => {
        client = new AnalyticsClient(props.requestId, {
            updateFreq: 5_000,
            apiEndpoint: '/api/analytics',
        });
    });

    onCleanup(() => {
        client.cleanup();
    });

    createEffect(() => {
        const path = location.pathname;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        client.pageOpen(path, tz);
    });

    return props.children;
}
