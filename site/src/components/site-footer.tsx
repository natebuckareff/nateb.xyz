import { Show, createSignal, onMount } from 'solid-js';
import ThemeControls from './theme-controls';

const START_YEAR = 2022;
const CURRENT_YEAR = new Date().getFullYear();
const COPYRIGHT_YEAR = `${START_YEAR}-${CURRENT_YEAR}`;

export default function SiteFooter() {
    const [getScrollable, setScrollable] = createSignal(false);

    onMount(() => {
        if (document.body.clientHeight > window.innerHeight) {
            setScrollable(true);
        }
    });

    return (
        <footer class="flex justify-between text-slate-500 text-sm sm:text-base">
            <div class="flex flex-wrap gap-1">
                <span>Copyright {COPYRIGHT_YEAR} Nate B</span>
                <span>(Nathaniel Buckareff)</span>
            </div>

            <Show when={getScrollable()}>
                <ThemeControls class="ml-[16px] " />
            </Show>
        </footer>
    );
}
