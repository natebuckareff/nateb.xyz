import { marked } from 'marked';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import Document from './about.md?raw';

export function routeData() {
    return createServerData$(() => {
        const markdown = marked(Document, { mangle: false, headerIds: false });
        return { markdown };
    });
}

export default function About() {
    const getRouteData = useRouteData<typeof routeData>();
    return (
        <main>
            <div class="max-w-[70ch] mx-auto">
                <article
                    class="prose lg:prose-xl dark:prose-invert"
                    innerHTML={getRouteData()?.markdown}
                />
            </div>
        </main>
    );
}
