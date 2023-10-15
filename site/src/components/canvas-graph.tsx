import { For, createSignal, onMount } from 'solid-js';

export interface GraphConfig<T, Bin> {
    data: T[];
    group: (value: T) => number;
    fill: (x: number) => T;
    initial: (x: number, value: T) => Bin;
    reduce: (x: number, bin: Bin, value: T) => void;
    range: (x: number, bin: Bin) => number;
}

export class Graph<T, Bin> {
    private _bins: Bin[] = [];

    constructor(public readonly config: GraphConfig<T, Bin>) {}

    get(x: number): Bin {
        let bin = this._bins[x];
        if (!bin) {
            const value = this.config.fill(x);
            bin = this.config.initial(x, value);
            this._bins[x] = bin;
        }
        return bin;
    }

    group() {
        const rect = {
            x: { min: +Infinity, max: -Infinity },
            y: { min: +Infinity, max: -Infinity },
        };

        for (const value of this.config.data) {
            const x = this.config.group(value);

            let bin = this._bins[x];

            if (!bin) {
                bin = this.config.initial(x, value);
                this._bins[x] = bin;

                const y = this.config.range(x, bin);
                rect.x.min = Math.min(rect.x.min, x);
                rect.x.max = Math.max(rect.x.max, x);
                rect.y.min = Math.min(rect.y.min, y);
                rect.y.max = Math.max(rect.y.max, y);
                continue;
            }

            this.config.reduce(x, bin, value);
        }

        return rect;
    }
}

export interface CanvasGraphProps<T, Bin> {
    graph: Graph<T, Bin>;
}

export default function CanvasGraph<T, Bin>(props: CanvasGraphProps<T, Bin>) {
    let container: HTMLDivElement;
    let canvas: HTMLCanvasElement;

    const [getXAxisRange, setXAxisRange] = createSignal<{ x: number; y: number; label: string }[]>();
    const [getYAxisRange, setYAxisRange] = createSignal<{ x: number; y: number; label: string }[]>();

    onMount(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const region = {
            x: 0,
            y: 0,
            width: canvas.width - 0,
            height: canvas.height - 0,
        };

        const gridX = 24;
        const gridY = 40;

        const range = props.graph.group();
        range.x.min = Math.floor(range.x.min / gridX) * gridX + gridX;
        range.x.max = Math.ceil(range.x.max / gridX) * gridX - gridX;
        range.y.min = Math.floor(range.y.min / gridY) * gridY;
        range.y.max = Math.ceil(range.y.max / gridY) * gridY + gridY;

        const extentX = Math.abs(range.x.max - range.x.min);
        const extentY = Math.abs(range.y.max - range.y.min);

        function transform(x: number, y: number) {
            const normX = (x - range.x.min) / extentX;
            const normY = (y - range.y.min) / extentY;
            const rx = region.x;
            const ry = region.y;
            const rw = region.width;
            const rh = region.height;
            return {
                x: rx + normX * rw,
                y: canvas.height - (ry + normY * rh),
            };
        }

        const gridExtentX = Math.floor(extentX / gridX);
        const xAxisRange: { x: number; y: number; label: string }[] = [];
        if (Number.isInteger(gridExtentX)) {
            for (let i = 0; i < gridExtentX; ++i) {
                const x = range.x.min + i * gridX;
                const { x: screenX } = transform(x, 0);

                if (i >= 1 && i < gridExtentX) {
                    ctx.beginPath();
                    ctx.moveTo(screenX, canvas.height - region.y);
                    ctx.lineTo(screenX, canvas.height - (region.y + region.height));
                    ctx.strokeStyle = '#aaa';
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.moveTo(screenX, canvas.height - region.y + 8);
                ctx.lineTo(screenX, canvas.height - (region.y + region.height));
                ctx.strokeStyle = '#aaa';
                ctx.stroke();

                {
                    const { x: screenX } = transform(x, 0);
                    xAxisRange.push({ x: screenX, y: canvas.height - region.y, label: x + '' });
                }
            }
        }
        setXAxisRange(xAxisRange);

        const gridExtentY = Math.floor(extentY / gridY);
        const yAxisRange: { x: number; y: number; label: string }[] = [];
        if (Number.isInteger(gridExtentY)) {
            for (let i = 0; i <= gridExtentY; ++i) {
                const y = range.y.min + i * gridY;
                const { y: screenY } = transform(0, y);

                if (i >= 1 && i < gridExtentY) {
                    ctx.beginPath();
                    ctx.moveTo(region.x, screenY);
                    ctx.lineTo(region.x + region.width, screenY);
                    ctx.strokeStyle = '#aaa';
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.moveTo(region.x - 8, screenY);
                ctx.lineTo(region.x, screenY);
                ctx.strokeStyle = '#aaa';
                ctx.stroke();

                {
                    const { y: screenY } = transform(0, y);
                    yAxisRange.push({ x: region.x, y: screenY, label: y + '' });
                }
            }
        }
        setYAxisRange(yAxisRange);

        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.moveTo(region.x, canvas.height - region.y);
        for (let x = range.x.min; x <= range.x.max; ++x) {
            const bin = props.graph.get(x);
            const y = props.graph.config.range(x, bin);
            const { x: screenX, y: screenY } = transform(x, y);
            ctx.lineTo(screenX, screenY);
        }
        ctx.lineTo(region.x + region.width, canvas.height - region.y);
        ctx.lineTo(region.x, canvas.height - region.y);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        const rx = region.x;
        const ry = canvas.height - (region.y + region.height);
        ctx.rect(rx, ry, region.width, region.height);
        ctx.strokeStyle = '#aaa';
        ctx.stroke();
    });

    return (
        <div ref={container!} class="relative border border-blue-500">
            <canvas ref={canvas!} class="w-full h-[40vh]" />

            <For each={getXAxisRange()}>
                {({ x, y, label }) => (
                    <div
                        class="absolute pt-2 -translate-x-1/2 text-xs bg-red-500"
                        style={{ left: `${x}px`, top: `${y}px` }}
                    >
                        {label}
                    </div>
                )}
            </For>

            <For each={getYAxisRange()}>
                {({ x, y, label }) => (
                    <div
                        class="absolute pr-3 pb-[2px] -translate-x-full -translate-y-1/2 text-xs bg-green-500"
                        style={{ left: `${x}px`, top: `${y}px` }}
                    >
                        {label}
                    </div>
                )}
            </For>
        </div>
    );
}
