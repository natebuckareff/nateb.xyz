import { A } from 'solid-start';
import CAIcon from '~/icons/ca-icon';

export default function HireMeCallout(props: { class?: string }) {
    return (
        <div
            class={`flex items-center gap-4 border-sky-200 bg-sky-50 dark:border-slate-500 dark:bg-slate-900 px-5 py-4 rounded-lg ${props.class}`}
        >
            <div class="leading-relaxed text-sky-900 dark:text-white text-sm sm:text-base">
                I'm currently available for employment. Should you or your company be interested, please{' '}
                <A class="x-link" href="/contact">
                    contact me
                </A>{' '}
                for details. I am located in Canada <CAIcon class="inline w-4 h-4" />. Remote positions only.
            </div>
        </div>
    );
}
