import { marked } from 'marked';
import { parse } from 'node-html-parser';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToString } from 'solid-js/web';
import { ServerError } from 'solid-start';
import YAML from 'yaml';
import ArticleSubtitle from '~/components/article-subtitle';

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function readAllArticles() {
    const currentFolder = dirname(fileURLToPath(import.meta.url));
    const articlesFolder = join(currentFolder, 'articles');
    const articlesDir = await readdir(articlesFolder);
    const articles: Article[] = [];

    for (const filename of articlesDir) {
        if (filename.endsWith('.md')) {
            const slug = filename.slice(0, filename.length - 3);
            try {
                const article = await readArticle(slug);
                if (article !== undefined) {
                    articles.push(article);
                }
            } catch (err) {
                if (err instanceof ServerError && err.message === 'Failed to parse article') {
                    continue;
                }
            }
        }
    }

    articles.sort((x, y) => x.modified - y.modified);

    return articles;
}

// TODO: Replace with filesystem cache
const __cachedArticles = new Map<string, Article>();

export async function readArticle(slug: string) {
    if (!SLUG_REGEX.test(slug)) {
        return;
    }

    let cachedArticle = __cachedArticles.get(slug);

    const currentFolder = dirname(fileURLToPath(import.meta.url));
    const articlesFolder = join(currentFolder, 'articles');
    const articlePath = `${articlesFolder}/${slug}.md`;

    try {
        const articleStats = await stat(articlePath);
        const articleModified = articleStats.atime;

        if (cachedArticle !== undefined) {
            if (articleModified.getTime() <= cachedArticle.modified) {
                return cachedArticle;
            }
        }

        const articleText = await readFile(articlePath, 'utf8');
        const article = parseArticle(slug, articleModified, articleText);
        __cachedArticles.set(slug, article);

        return article;
    } catch (err) {
        if (typeof err === 'object' && err !== null && 'code' in err) {
            if (err.code === 'ENOENT') {
                return;
            }
        }
        throw err;
    }
}

export interface Article {
    slug: string;
    title: string;
    modified: number;
    readingtime: number;
    meta?: {
        published?: number;
    };
    html: string;
    summary: string[];
}

const FRAGMENT_REGEX = /\[\[#(?<title>[^\]]+)\]\]/;
const EMBED_REGEX = /!\[\[(?<name>[^\]]+)\]\]/;

function parseArticle(slug: string, modified: Date, text: string): Article {
    try {
        const { frontmatter, content } = parseFrontmatter(text);
        const meta = YAML.parse(frontmatter);

        let title = '';
        let summary: string[] = [];
        let readingtime = 0;
        let published: Date | undefined;

        if (meta.published) {
            published = new Date(meta.published);
        }

        let enabledHeadingRenderer = false;

        marked.use({
            renderer: {
                heading(text, level) {
                    if (!enabledHeadingRenderer) {
                        return `<h${level}>${text}</h${level}>`;
                    }
                    const name = getEscapedTitle(text);
                    let after = '';
                    if (level === 1) {
                        after = renderToString(() => ArticleSubtitle({ readtime: readingtime, published }));
                    }
                    return `<h${level}><a name="${name}" href="#${name}">${text}</a></h${level}>${after}`;
                },
            },
        });

        enabledHeadingRenderer = true;

        const html = marked(content, {
            hooks: {
                preprocess(markdown) {
                    const wpm = 225;
                    const words = getWordCount(markdown);
                    readingtime = Math.ceil(words / wpm);
                    return markdown;
                },
                postprocess(html) {
                    const extract = extractArticleSummaryAndTitle(html, 50);
                    title = extract.title;
                    summary = extract.summary;

                    // Fragment links
                    while (true) {
                        const match = FRAGMENT_REGEX.exec(html);
                        if (!match) {
                            break;
                        }
                        const { index } = match;
                        const str = match[0];
                        const title = match.groups?.title ?? '';
                        const name = getEscapedTitle(title);
                        const before = html.slice(0, index);
                        const after = html.slice(index + str.length);
                        html = before + `<a href="#${name}">${title}</a>` + after;
                    }

                    // Image embeds
                    while (true) {
                        const match = EMBED_REGEX.exec(html);
                        if (!match) {
                            break;
                        }
                        const { index } = match;
                        const str = match[0];
                        const name = match.groups?.name ?? '';
                        const before = html.slice(0, index);
                        const after = html.slice(index + str.length);
                        html = before + `<img src="/${name}.png" alt="${name}" />` + after;
                    }

                    return html;
                },
            },
        });

        enabledHeadingRenderer = false;

        return {
            slug,
            title,
            summary,
            modified: modified.getTime(),
            readingtime,
            meta: {
                ...meta,
                published: published?.getTime(),
            },
            html,
        };
    } catch (error) {
        throw new ServerError('Failed to parse article');
    }
}

function getEscapedTitle(title: string) {
    return title.toLowerCase().replace(/[^\w]+/g, '-');
}

function extractArticleSummaryAndTitle(html: string, maxWordCount: number) {
    const xml = parse(html);
    const elems = xml.querySelectorAll('p');
    const summary: string[] = [];
    let wordCount = 0;
    for (const p of elems) {
        if (p.parentNode.tagName === null) {
            const text = p.textContent;
            const words = extractWords(text);
            wordCount += words.length;
            if (wordCount >= maxWordCount) {
                const wordDiff = wordCount - maxWordCount;
                const truncatedWords = words.slice(0, words.length - wordDiff);
                if (words.length === words.length - wordDiff) {
                    summary.push(truncatedWords.join(' '));
                } else {
                    summary.push(truncatedWords.join(' ') + ' ...');
                }
                break;
            }
            summary.push(text);
        }
    }
    const title = xml.querySelector('h1')?.textContent ?? '';
    return { title, summary };
}

function extractWords(text: string): string[] {
    return text.trim().split(/\s+/);
}

function getWordCount(text: string) {
    return extractWords(text).length;
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
