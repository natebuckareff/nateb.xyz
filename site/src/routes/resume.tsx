import { marked } from 'marked';
import { createEffect } from 'solid-js';
import { createRouteData, useRouteData } from 'solid-start';
import { HttpHeader } from 'solid-start/server';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';
import Resume from '~/resume.md?raw';

export function routeData() {
    const getHtml = createRouteData(() => {
        return marked(Resume);
    });
    return { getHtml };
}

export default function ResumePage() {
    const { getHtml } = useRouteData<typeof routeData>();

    createEffect(() => {
        console.log(getHtml());
    });

    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <SiteLayout>
                <SiteHeader />
                <div class="x-article my-8">
                    <div innerHTML={getHtml()} />
                </div>
            </SiteLayout>
        </>
    );
}
