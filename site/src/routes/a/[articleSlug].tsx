import { Show } from 'solid-js';
import { ErrorBoundary, RouteDataArgs, ServerError, Title, useRouteData } from 'solid-start';
import { HttpHeader, HttpStatusCode, createServerData$ } from 'solid-start/server';
import { readArticle } from '~/article';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';

export function routeData({ params }: RouteDataArgs) {
    const getArticle = createServerData$(
        async ([articleSlug]) => {
            const article = await readArticle(articleSlug);
            if (article === undefined) {
                throw new ServerError('Article not found', { status: 404 });
            }
            return article;
        },
        { key: () => [params.articleSlug] },
    );
    return { getArticle };
}

export default function ArticlePage() {
    const { getArticle } = useRouteData<typeof routeData>();
    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <Show when={getArticle()?.title}>{title => <Title>{title()} - Nate Buckareff</Title>}</Show>

            <SiteLayout>
                <SiteHeader />
                <ErrorBoundary
                    fallback={e => (
                        <Show when={e.message === 'Article not found'}>
                            <HttpStatusCode code={404} />
                            Article Not Found
                        </Show>
                    )}
                >
                    <article class="x-article">
                        <div innerHTML={getArticle()?.html ?? ''} />

                        {/* <HireMeCallout /> */}

                        <div>
                            <hr />
                        </div>
                    </article>
                </ErrorBoundary>
            </SiteLayout>
        </>
    );
}
