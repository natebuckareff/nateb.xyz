import { Show } from 'solid-js';
import { redirect, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { MONTHS_FULL } from '~/util';
import type { Article } from './get-articles';
import { getArticle } from './get-articles';

export function routeData() {
    return createServerData$(async (_, event) => {
        const [, slug] = new URL(event.request.url).pathname.split('/');

        if (slug === undefined) {
            throw redirect('/404');
        }

        const article = await getArticle(slug);

        if (article === undefined) {
            throw redirect('/404');
        }

        return article;
    });
}

export default function Article() {
    const getArticle = useRouteData<typeof routeData>();
    return (
        <Show when={getArticle()}>
            {article => (
                <article class="prose pronse-stone xl:prose-xl mx-auto dark:prose-invert">
                    <ArticleMeta meta={article().meta} />

                    <section innerHTML={article().html} />

                    <p class="border-b border-b-gray-200 dark:border-b-gray-600" />

                    {/* <p class="mb-4">
                        TODO: thanks for reading!
                    </p> */}

                    <div class="mb-4 flex justify-between prose-blue text-lg">
                        <Show when={article().meta.prev}>
                            {prev => (
                                <a
                                    class="no-underline hover:underline mr-auto dark:text-blue-400"
                                    href={'/' + prev().slug}
                                >
                                    <div class="font-normal">← Older</div>
                                    <div>{prev().title}</div>
                                </a>
                            )}
                        </Show>

                        <Show when={article().meta.next}>
                            {next => (
                                <a
                                    class="no-underline hover:underline ml-auto dark:text-blue-400"
                                    href={'/' + next().slug}
                                >
                                    <div class="font-normal">Newer →</div>
                                    <div>{next().title}</div>
                                </a>
                            )}
                        </Show>
                    </div>
                </article>
            )}
        </Show>
    );
}

function ArticleMeta(props: { meta: Article['meta'] }) {
    const getPublished = () => new Date(props.meta.published);
    return (
        <div class="mb-8">
            <div class="text-gray-700 dark:text-gray-200">{formatDate(getPublished())}</div>
            <Show when={props.meta.modified}>
                {modified => (
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        Last modified {formatDate(new Date(modified()))}
                    </div>
                )}
            </Show>
        </div>
    );
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = MONTHS_FULL[date.getMonth()];
    const day = date.getDate();
    return `${month} ${formatOrdinalSuffix(day)}, ${year}`;
}

function formatOrdinalSuffix(day: number) {
    // 1st
    if (day % 10 === 1 && day !== 11) {
        return day + 'st';
    }

    // 2nd
    if (day % 10 === 2 && day !== 12) {
        return day + 'nd';
    }

    // 3rd
    if (day % 10 === 3 && day !== 13) {
        return day + 'rd';
    }

    // nth
    return day + 'th';
}
