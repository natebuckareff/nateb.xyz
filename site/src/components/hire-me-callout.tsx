import { A } from 'solid-start';
import { AlertCircleIcon } from '~/icons/alert-circle-icon';
import CAIcon from '~/icons/ca-icon';

export default function HireMeCallout(props: { class?: string }) {
    const cls = `flex items-center gap-4 border border-sky-200 bg-sky-50 text-sky-900 dark:border-slate-500 dark:bg-slate-900 dark:text-white px-4 py-3 rounded-lg text-sm sm:text-base ${props.class}`;
    return (
        <div class={cls}>
            <div>
                <AlertCircleIcon class="w-5 h-5" />
            </div>

            <div>
                I'm currently available for employment. Should you or your company be interested, please{' '}
                <A class="x-link" href="/contact">
                    contact me
                </A>{' '}
                for details. I am located in Canada <CAIcon class="inline w-4 h-4" />. Remote positions only.
            </div>
        </div>
    );
}
