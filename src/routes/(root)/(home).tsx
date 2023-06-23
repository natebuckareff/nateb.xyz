import { cva } from 'class-variance-authority';
import { For, Show } from 'solid-js';
import { A, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import ArticleCard from '~/components/article-card';
import StarIcon from '~/components/icons/star-icon';
import TypeScriptIcon from '~/components/icons/typescript-icon';
import styles from './(home).module.css';
import { getAllArticles } from './[article]/get-articles';

export function routeData() {
    return createServerData$(async () => {
        const articles = await getAllArticles();
        return { articles };
    });
}

export default function Home() {
    const getRouteData = useRouteData<typeof routeData>();
    return (
        <main class="mx-auto flex flex-col gap-12 max-w-3xl">
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-4">
                    <img
                        class="rounded-md dark:border dark:border-slate-600"
                        src="/avatar.jpeg"
                        width="128px"
                    />

                    <div class="flex flex-col gap-1">
                        <h1 class="text-4xl">Nate Buckareff</h1>
                        <h2 class="text-2xl">Full-stack developer</h2>
                    </div>
                </div>

                <p class="text-lg">
                    <span class={styles['waving-hand']}>👋</span> Hello! I love to build things, especially
                    tools that help people create. I'm interested in computers, tech, physics, philosophy, and
                    politics.
                </p>

                <A href="/consulting">
                    <p class="text-center group hover:border-blue-200 dark:hover:border-blue-400 rounded-lg border-2 border-gray-200 dark:border-gray-400 p-5 text-2xl">
                        I'm currently working as a consultant and{' '}
                        <span class="underline">open to new projects</span>
                    </p>
                </A>
            </div>

            <div class="flex flex-col gap-3">
                <h3 class="text-2xl font-semibold">Projects</h3>

                <div class="flex flex-col gap-4">
                    <ProjectCard
                        href="https://github.com/natebuckareff/chronoflow#readme"
                        title="Chronoflow"
                        content="Message passing process for TypeScript."
                        stars={2}
                    />

                    <ProjectCard
                        href="https://github.com/natebuckareff/typedex#readme"
                        title="Typedex"
                        content="Serialization and model mapping for TypeScript."
                    />
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <h3 class="text-2xl font-semibold">Articles</h3>

                <div class="flex flex-col gap-4">
                    <Show when={getRouteData()?.articles}>
                        {articles => (
                            <For each={articles()}>{article => <ArticleCard article={article} />}</For>
                        )}
                    </Show>
                </div>
            </div>
        </main>
    );
}

const ProjectCard = (props: { href: string; title: string; content: string; stars?: number }) => {
    const linkStyle = cva([
        'flex flex-col gap-1 rounded-lg bg-slate-100 dark:bg-slate-700 p-4',
        'border-transparent border-2 hover:border-slate-300 dark:hover:border-slate-500',
    ]);
    return (
        <a href={props.href} class={linkStyle()} target="_blank" rel="noopener noreferrer">
            <h4 class="flex items-center gap-2 text-lg">
                <TypeScriptIcon class="w-5 h-5" />

                <span>{props.title}</span>

                <Show when={props.stars}>
                    {stars => (
                        <span class="ml-1 bg-gray-200 dark:bg-gray-500 px-2 py-1 rounded-md flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <StarIcon class="w-4 h-4" />
                            <span class="text-sm">{stars()}</span>
                        </span>
                    )}
                </Show>
            </h4>
            <p>{props.content}</p>
        </a>
    );
};
