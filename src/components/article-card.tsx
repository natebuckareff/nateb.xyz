import type { Article } from '~/routes/(root)/[article]/get-articles';
import { MONTHS_SHORT } from '~/util';

export default function ArticleCard(props: { article: Article }) {
    const getPublished = () => new Date(props.article.meta.published);
    const getTitle = () => props.article.meta.title;
    const getDescription = () => props.article.meta.description ?? '';
    const getMonth = () => MONTHS_SHORT[getPublished().getMonth()];
    const getDay = () => getPublished().getDate();
    const getYear = () => getPublished().getFullYear();
    return (
        <a
            class="group flex flex-col gap-1 p-4 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
            href={`/${props.article.slug}`}
        >
            <div>
                <span class="text-gray-500 dark:text-gray-300">{`${getMonth()} ${getDay()}, ${getYear()}`}</span>
                <h4 class="group-hover:underline text-lg font-bold">{getTitle()}</h4>
            </div>
            <p class="text-lg text-gray-600 dark:text-gray-400">{getDescription()}</p>
        </a>
    );
}
