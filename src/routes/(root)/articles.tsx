import { For, Show } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import ArticleCard from '~/components/article-card';
import { getAllArticles } from './[article]/get-articles';

export function routeData() {
    return createServerData$(async () => {
        const articles = await getAllArticles();
        return { articles };
    });
}

export default function Articles() {
    const getRouteData = useRouteData<typeof routeData>();
    return (
        <main class="flex flex-col gap-4">
            <h1 class="ml-4 text-4xl font-bold">Articles</h1>

            <Show when={getRouteData()?.articles}>
                {articles => (
                    <For each={articles()}>{article => <ArticleCard article={article} />}</For>
                )}
            </Show>
        </main>
    );
}
