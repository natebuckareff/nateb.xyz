import { For } from 'solid-js';
import { A, useRouteData } from 'solid-start';
import { HttpHeader, createServerData$ } from 'solid-start/server';
import { readAllArticles } from '~/article';
import ArticleSubtitle from '~/components/article-subtitle';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';
import { or } from '~/util';

export function routeData() {
    const getArticleList = createServerData$(async () => {
        return readAllArticles();
    });
    return { getArticleList };
}

export default function HomePage() {
    const { getArticleList } = useRouteData<typeof routeData>();
    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <SiteLayout>
                <SiteHeader />
                <div class="flex flex-col gap-4 my-6">
                    <For each={getArticleList() ?? []}>
                        {article => (
                            <A
                                class="block border border-transparent dark:hover:border-slate-700 hover:border-slate-300 rounded-md shadow-sm hover:shadow-slate-200 dark:hover:shadow-slate-700"
                                href={`/a/${article.slug}`}
                            >
                                <article class="x-article x-article-card">
                                    <h1>{article.title}</h1>
                                    <ArticleSubtitle
                                        readtime={article.readingtime}
                                        published={or(article.meta?.published, x => new Date(x))}
                                    />
                                    <For each={article.summary}>{summary => <p>{summary}</p>}</For>
                                </article>
                            </A>
                        )}
                    </For>
                </div>
            </SiteLayout>
        </>
    );
}
