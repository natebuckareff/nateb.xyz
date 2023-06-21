import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { env } from '~/env';

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const ARTICLES = new Map<string, Article>();

let ARTICLE_LIST: Article[] | undefined = undefined;

export interface Article {
    slug: string;
    meta: {
        title: string;
        description?: string;
        published: number;
        modified?: number;
        prev?: { slug: string; title: string };
        next?: { slug: string; title: string };
    };
    html: string;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
    if (slug.length < 1 || slug.length > 128 || !SLUG_REGEX.test(slug)) {
        return;
    }

    if (ARTICLES === undefined) {
        await getAllArticles();
    }

    return ARTICLES.get(slug);
}

export function getArticlePaths() {
    const paths: string[] = [];
    for (const filename of fs.readdirSync(env.get('ARTICLES_DIRNAME'))) {
        if (!filename.endsWith('.md')) continue;
        const slug = filename.slice(0, -3);
        paths.push('/' + slug);
    }
    return paths;
}

export async function getAllArticles() {
    if (ARTICLE_LIST !== undefined) {
        return ARTICLE_LIST;
    }

    ARTICLE_LIST = [];

    const articlesDir = fs.readdirSync(env.get('ARTICLES_DIRNAME'));

    for (const filename of articlesDir) {
        if (!filename.endsWith('.md')) {
            continue;
        }

        const slug = filename.slice(0, -3);
        const article = await readArticleFile(slug);

        ARTICLE_LIST.push(article);
    }

    ARTICLE_LIST.sort((x, y) => {
        const a = x.meta.published;
        const b = y.meta.published;
        return b - a;
    });

    for (let i = 0; i < ARTICLE_LIST.length; ++i) {
        const article = ARTICLE_LIST[i];

        if (i > 0) {
            const prev = ARTICLE_LIST[i - 1]!;

            article.meta.prev = {
                slug: prev.slug,
                title: prev.meta.title,
            };

            prev.meta.next = {
                slug: article.slug,
                title: article.meta.title,
            };
        }

        ARTICLES.set(article.slug, article);
    }

    return ARTICLE_LIST;
}

async function readArticleFile(slug: string): Promise<Article> {
    const filename = path.join(env.get('ARTICLES_DIRNAME'), slug + '.md');
    const exists = fs.existsSync(filename);
    if (!exists) throw Error('failed to read article: ' + slug);
    const file = await fs.promises.readFile(filename, { encoding: 'utf-8' });
    return parseArticle(slug, file);
}

function parseArticle(slug: string, file: string): Article {
    try {
        const { frontmatter, content } = parseFrontmatter(file);
        const meta = YAML.parse(frontmatter);
        const html = marked(content, {
            mangle: false,
            headerIds: false,
        });

        const title = meta.title;
        const published = meta.published && new Date(meta.published).getTime();
        const modified = meta.modified && new Date(meta.modified).getTime();

        if (!title) throw Error('title metadata not found');
        if (!published) throw Error('published metadata not found');

        return {
            slug,
            meta: { ...meta, title, published, modified },
            html,
        };
    } catch (error) {
        console.error(error);
        throw new Error('Server error');
    }
}

function parseFrontmatter(file: string) {
    const i = file.indexOf('---');

    if (i === -1) {
        return { frontmatter: 'null', content: file };
    }

    const j = file.indexOf('---', i + 4);

    if (j === -1) {
        return { frontmatter: '{}', content: file };
    }

    const frontmatter = file.slice(i + 4, j);
    const content = file.slice(j + 4);

    return { frontmatter, content };
}
