import { marked } from 'marked';
import { renderToString } from 'solid-js/web';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { MessageIcon } from '~/components/icons/message-icon';
import Document from './consulting.md?raw';

export function routeData() {
    return createServerData$(() => {
        const markdown = marked(Document, {
            mangle: false,
            headerIds: false,
            hooks: {
                preprocess(markdown) {
                    return markdown;
                },
                postprocess(html) {
                    return html.replace('🇨🇦', renderToString(CanadaFlag));
                },
            },
        });
        return { markdown };
    });
}

const CanadaFlag = () => (
    <img
        style={{ margin: '0 0 4px 0 !important' }}
        class="w-[1.6rem] h-[1.6rem] inline-block"
        src="/canada.png"
    />
);

export default function Consulting() {
    const getRouteData = useRouteData<typeof routeData>();
    return (
        <div class="flex flex-col gap-8 mx-auto">
            <img
                class="border border-transparent dark:border-slate-500 rounded-md w-full max-w-[400px] sm:mx-[none]"
                src="/avatar.jpeg"
            />

            <div class="flex flex-col gap-2">
                <h1 class="text-4xl sm:text-4xl">Nate Buckareff</h1>
                <h2 class="text-xl sm:text-2xl text-gray-500 dark:text-gray-400">
                    Custom software development and consulting
                </h2>
            </div>

            <ContactC2A class="max-w-[400px]">Let's get in touch</ContactC2A>

            <article
                class="prose lg:prose-xl dark:prose-invert"
                innerHTML={getRouteData()?.markdown}
            />

            <ContactC2A class="mx-auto p-4 max-w-[400px]">Contact me</ContactC2A>
        </div>
    );
}

const ContactC2A = (props: { class?: string; children: string }) => (
    <a class={'inline-block w-full ' + props.class} href="/contact">
        <p class="text-center hover:border-blue-200 dark:hover:border-blue-400 hover:animate-pulse rounded-lg border-2 border-slate-400 dark:border-gray-400 p-4 text-xl">
            {props.children} <MessageIcon class="inline w-5 h-5 ml-1 mb-1" />
        </p>
    </a>
);
