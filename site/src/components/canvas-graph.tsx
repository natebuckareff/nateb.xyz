import { onMount } from 'solid-js';

/*
TODO:
- Histogram
    - User defines an `initial` function to initialize bins
    - User defines `group` function to identify bins
    - User defines some `reduce` function to aggregate
- X extent is just the first and last bins
- Y extent is the min and max of the range
- X axis divides bins evenly and then iterates over them
- Y axis divides range min and max evenly and then iterates them
- Axis
    - The number of X and Y divisions is based on pixel sizes
    - User provides pixel width of X axis labels
    - User provides pixel height of Y axis labels
    - User provides render function for labels
- Mouse
    - Convert from mouse position to nearest bin

- Histogram takes non-linear data and bins it
- Linear data can then be contiguously iterated over
*/

interface Histogram {
    buckets: {
        label: string;
        x: number;
        y: number;
        count: number;
    }[];
    range: {
        min: number;
        max: number;
    };
}

export interface CanvasGraphProps<T> {
    data: T[];
    getX: (row: T) => number;
    getY: (row: T) => number;
    getLabel: (row: T) => string;
}

export default function CanvasGraph<T>(props: CanvasGraphProps<T>) {
    let container: HTMLDivElement;
    let canvas: HTMLCanvasElement;

    const getHistogram = (scale: number) => {
        const histogram: Histogram = {
            buckets: [],
            range: { min: 0, max: 0 },
        };
        const { buckets, range } = histogram;
        const start = Math.floor(props.getX(props.data[0]) / scale);

        for (let i = 0; i < props.data.length; ++i) {
            const label = props.getLabel(props.data[i]);
            const x = Math.floor(props.getX(props.data[i]) / scale);
            const y = props.getY(props.data[i]);
            const index = x - start;
            const bucket = (buckets[index] ??= { label, x, y: 0, count: 1 });
            bucket.y += y;
            // bucket.count += 1;b
        }

        range.min = buckets[0].y / buckets[0].count;
        range.max = buckets[0].y / buckets[0].count;

        for (let i = 1; i < buckets.length; ++i) {
            if (buckets[i] === undefined) {
                buckets[i] = { label: '???', x: start + i, y: 0, count: 0 };
            } else {
                const value = buckets[i].y / buckets[i].count;
                range.min = Math.min(range.min, value);
                range.max = Math.max(range.max, value);
            }
        }

        return histogram;
    };

    onMount(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        console.log({
            w: canvas.width,
            n: props.data.length,
            r: canvas.width / props.data.length,
        });

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const region = {
            x: 10,
            y: 10,
            width: canvas.width,
            height: canvas.height - 150,
        };

        const histogram = getHistogram(1);
        const { buckets, range } = histogram;
        const strideX = region.width / (buckets.length + 1);

        ctx.beginPath();
        for (let i = 0; i < buckets.length; ++i) {
            const { x, y, height } = region;
            const bucket = histogram.buckets[i];
            const dataY = bucket ? bucket.y / bucket.count : 0;
            const screenY = 1 - ((dataY - range.min) / (range.max - range.min)) * height + height + y;
            const screenX = x + strideX * (i + 1);
            if (i === 0) {
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.strokeStyle = 'rgb(255,0,0)';
        ctx.stroke();

        for (let i = 0; i < buckets.length; ++i) {
            const screenX = region.x + strideX * (i + 1);
            const screenY = region.y + region.height + 20;

            ctx.beginPath();
            ctx.save();
            ctx.translate(screenX - 8, screenY);
            ctx.rotate(Math.PI / 4);
            ctx.font = '12px monospace';
            ctx.fillStyle = 'rgb(255,0,0)';
            ctx.fillText(buckets[i].label, 0, 0);
            ctx.restore();
        }
    });

    return (
        <div ref={container!} class="border border-red-500 border-opacity-20">
            <canvas ref={canvas!} class="w-full h-[40vh]" />
        </div>
    );
}
