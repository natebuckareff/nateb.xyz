import { A } from 'solid-start';
import { HttpHeader } from 'solid-start/server';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';

export default function NotFoundPage() {
    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <SiteLayout>
                <SiteHeader />
                <div class="my-8">
                    <h1 class="text-4xl font-bold">Not Found</h1>

                    <div class="mt-8 gap-8">
                        <p>
                            If you think this link is broken,{' '}
                            <A class="x-link" href="/contact">
                                please let me know!
                            </A>
                        </p>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
