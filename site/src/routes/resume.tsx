import differenceInMonths from 'date-fns/differenceInMonths';
import { marked } from 'marked';
import { onMount } from 'solid-js';
import { createRouteData, useRouteData } from 'solid-start';
import { HttpHeader } from 'solid-start/server';
import ObfuscatedLink from '~/components/obfuscated-link';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';
import { PrinterIcon } from '~/icons/printer-icon';
import Resume from '~/resume.md?raw';

const CONTACT_DATA_KEY = [211, 240, 61, 165, 51, 8, 237, 47];

export function routeData() {
    const getHtml = createRouteData(() => {
        return marked(Resume);
    });
    return { getHtml };
}

export default function ResumePage() {
    const { getHtml } = useRouteData<typeof routeData>();

    const onPrintClick = () => {
        const originalTitle = document.title;
        document.title = 'nate-buckareff-resume';
        window.print();
        document.title = originalTitle;
    };

    onMount(() => {
        const els = document.getElementsByClassName('x-date-range');
        if (els.length === 0) return;
        const el = els[0] as HTMLDivElement;

        const startDate = new Date(el.dataset.date ?? 0);
        const currentDate = new Date();
        const difference = differenceInMonths(currentDate, startDate);
        const months = difference % 12;
        const years = Math.floor(difference / 12);

        el.innerHTML = `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    });

    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <SiteLayout classFooter="print:hidden">
                <SiteHeader class="print:hidden" />

                <button
                    class="x-button print:hidden mt-8 flex gap-2 border rounded-md px-4 py-3"
                    onClick={onPrintClick}
                >
                    <PrinterIcon /> Print
                </button>

                <div class="x-article my-8">
                    <div innerHTML={getHtml()} />
                    <div class="hidden print:block mb-8 text-lg">
                        <h3>Contact</h3>
                        <ul>
                            <li>
                                <a href="https://nateb.xyz">nateb.xyz</a>
                            </li>
                            <li>
                                <ObfuscatedLink
                                    href="bb8449d54032c200b49949cd466ac34cbc9d12cb527c884da69356c4416d8b49"
                                    text="b49949cd466ac34cbc9d12cb527c884da69356c4416d8b49"
                                    key={CONTACT_DATA_KEY}
                                />
                            </li>
                            <li>
                                <ObfuscatedLink
                                    href="bb8449d54032c200a4874a8b5f618344b69454cb1d6b8242fc99538a5d69994afe9248c658699f4ab59610950b6ad81de4c109911c"
                                    text="bf9953ce566c8441fd9352c81c618300bd9149c01e6a984cb8914fc0556ec01feb9208970439d91b"
                                    key={CONTACT_DATA_KEY}
                                />
                            </li>
                            <li>
                                <ObfuscatedLink
                                    href="be9154c94767d741b284588b517d8e44b28258c355488a42b299518b506780"
                                    text="bd9149c01d6a984cb8914fc0556ead48be9154c91d6b8242"
                                    key={CONTACT_DATA_KEY}
                                />
                            </li>
                            <li>
                                <ObfuscatedLink
                                    href="a795519f1839d81eeac70d9c0a31db1e"
                                    text="f8c11d900231cd18e3c9109c0a3edc"
                                    key={CONTACT_DATA_KEY}
                                />
                            </li>
                        </ul>
                    </div>

                    <button
                        class="x-button print:hidden flex gap-2 border rounded-md px-4 py-3"
                        onClick={onPrintClick}
                    >
                        <PrinterIcon /> Print
                    </button>
                </div>
            </SiteLayout>
        </>
    );
}
