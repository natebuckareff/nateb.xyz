import type ApexCharts from 'apexcharts';
import { onMount } from 'solid-js';

export interface ChartProps {
    cls: new (el: any, options: any) => ApexCharts;
    data: unknown[];
}

export default function Chart(props: ChartProps) {
    let divRef: HTMLDivElement;

    onMount(() => {
        console.log(props.data[0]);
        const options: any = {
            series: [
                {
                    name: 'Visitors',
                    data: props.data,
                },
            ],
            chart: {
                type: 'area',
                stacked: false,
                height: 400,
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true,
                },
                // toolbar: false,
            },
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100],
                },
            },
            yaxis: {
                labels: {
                    // formatter: function (val) {
                    //     return (val / 1000000).toFixed(0);
                    // },
                },
            },
            xaxis: {
                type: 'datetime',
            },
        };

        const chart = new props.cls(divRef, options);
        chart.render();
    });

    return <div ref={divRef!} />;
}
