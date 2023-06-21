import ApexCharts from 'apexcharts';
import { JSX, Show, createSignal, onMount } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { analyticsService } from '~/analytics-service';
import Chart from './(components)/chart';

export function routeData() {
    return createServerData$(() => {
        const data = analyticsService.config.storage.getVisitorsTest();
        return { data };
    });
}

export default function Analytics() {
    const getRouteData = useRouteData<typeof routeData>();
    const getApexCharts = useApexCharts();

    return (
        <main class="w-full">
            <Card class="w-full min-h-[400px]">
                <Show when={getApexCharts()}>
                    {apexCharts => (
                        <Show when={getRouteData()?.data}>
                            {data => <Chart data={data()} cls={apexCharts()} />}
                        </Show>
                    )}
                </Show>
            </Card>
        </main>
    );
}

const Card = (props: { class?: string; children: JSX.Element }) => (
    <div
        class={
            'block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ' +
            props.class
        }
    >
        {props.children}
    </div>
);

function useApexCharts() {
    const [getModule, setModule] = createSignal<new (el: any, options: any) => ApexCharts>();

    onMount(() => {
        import('apexcharts').then(x => {
            setModule(() => x.default as any);
        });
    });

    return getModule;
}
