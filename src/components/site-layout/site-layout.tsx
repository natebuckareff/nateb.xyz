import { cva } from 'class-variance-authority';
import { JSX, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { A, useLocation } from 'solid-start';
import { env } from '~/env';
import useDarkMode from '~/hooks/use-dark-mode';
import GithubIcon from '../icons/github-icon';
import { LinkedinIcon } from '../icons/linkedin-icon';
import { MessageIcon } from '../icons/message-icon';
import MoonIcon from '../icons/moon-icon';
import SunIcon from '../icons/sun-icon';
import TwitterIcon from '../icons/twitter-icon';
import './site-layout.css';

export interface SiteLayoutProps {
    children: JSX.Element;
}

export default function SiteLayout(props: SiteLayoutProps) {
    return (
        <div class="dark:bg-slate-900 dark:text-slate-200">
            <div class="flex flex-col min-h-screen mx-auto max-w-6xl">
                <Nav />
                <div class="flex flex-col w-full mx-auto max-w-3xl gap-8 pt-4 sm:pt-8 p-4 py-0 sm:p-10">
                    {props.children}
                </div>
                <Footer />
            </div>
        </div>
    );
}

const Nav = () => {
    const location = useLocation();
    const matches = (value: string) => location.pathname === value;
    const [, setDarkMode] = useDarkMode();

    const itemStyle = cva(['hover:underline'], {
        variants: {
            active: {
                true: 'underline text-black dark:text-slate-200',
                false: 'no-underline text-gray-500 dark:text-slate-400',
            },
        },
    });

    const iconItemStyle = cva(['flex flex-col items-center text-gray-500 hover:text-black']);
    const linkItemStyle = cva(['inline-block hover:bg-gray-200 p-1 rounded-md']);

    return (
        <nav class="flex p-4 sm:p-4 sm:pt-8 sm:px-10">
            <div class="sm:ml-auto flex flex-wrap gap-2">
                <ul class="flex items-center gap-4">
                    <li class={iconItemStyle()}>
                        <a class={linkItemStyle()} href="https://github.com/natebuckareff">
                            <GithubIcon class="w-5 h-5" />
                        </a>
                    </li>

                    <li class={iconItemStyle()}>
                        <a
                            class={linkItemStyle()}
                            href="https://www.linkedin.com/in/nate-buckareff-08b527144/"
                        >
                            <LinkedinIcon class="w-5 h-5" />
                        </a>
                    </li>

                    <li class={iconItemStyle()}>
                        <a class={linkItemStyle()} href="https://twitter.com/anynate">
                            <TwitterIcon class="w-5 h-5" />
                        </a>
                    </li>

                    <li class={iconItemStyle() + ' mr-4'}>
                        <a class={linkItemStyle()} href="mailto:n@nateb.xyz">
                            <MessageIcon class="w-5 h-5" />
                        </a>
                    </li>
                </ul>

                <ul class="flex flex-wrap items-center w-full sm:w-auto justify-between gap-x-4 gap-y-1 text-lg">
                    <li class={itemStyle({ active: matches('/') })}>
                        <A href="/">Home</A>
                    </li>

                    <li class={itemStyle({ active: matches('/consulting') })}>
                        <A href="/consulting">Consulting</A>
                    </li>

                    <li class={itemStyle({ active: matches('/contact') })}>
                        <A href="/contact">Contact</A>
                    </li>

                    {/* <li class={itemStyle({ active: matches('/resume') })}>
                        <A href="/resume">Resume</A>
                    </li> */}

                    <li class={itemStyle({ active: matches('/articles') })}>
                        <A href="/articles">Articles</A>
                    </li>

                    <li class="ml-auto mt-1">
                        <button onClick={() => setDarkMode(theme => !theme.dark)}>
                            <SunIcon class={'dark-theme-button w-4 h-4'} />
                            <MoonIcon class={'light-theme-button w-4 h-4'} />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

const Footer = () => {
    const location = useLocation();
    return (
        <footer class="flex flex-wrap justify-center gap-3 text mt-auto px-4 sm:px-10 py-4 sm:pb-8 text-gray-500 dark:text-gray-400">
            <Show when={location.pathname !== '/about'}>
                <A class="hover:underline" href="/about">
                    About this site
                </A>
                {'—'}
            </Show>

            <Show when={location.pathname !== '/analytics'}>
                <A class="hover:underline" href="/analytics">
                    Stats
                </A>
                {'—'}
            </Show>

            <DeploymentLink />
        </footer>
    );
};

const DeploymentLink = () => {
    const commit = env.get('DEPLOY_COMMIT');
    const timestamp = env.get('DEPLOY_TIMESTAMP');
    const gitUrl = 'https://github.com/natebuckareff/nateb.xyz/commit/' + commit;
    const getTime = useTimestampRelativeDistance(timestamp);
    const [getExpanded, setExpanded] = createSignal(false);

    const handleClick = () => {
        setExpanded(x => !x);
        window.scrollTo(0, document.documentElement.scrollHeight);
    };

    const linkStyle = cva(['text-sm inline animate-pulse'], {
        variants: {
            expanded: {
                true: 'inline',
                false: 'hidden',
            },
        },
    });

    return (
        <div class="inline">
            <span class="hover:underline cursor-pointer" onClick={handleClick}>
                {commit.slice(0, 7)}
            </span>{' '}
            <a class={linkStyle({ expanded: getExpanded() })} href={gitUrl}>
                (deployed {getTime()})
            </a>
        </div>
    );
};

function useTimestampRelativeDistance(time: number) {
    let intervalRef: NodeJS.Timer;
    const [getDistance, setDistance] = createSignal(Date.now() - time);

    onMount(() => {
        intervalRef = setInterval(() => {
            setDistance(Date.now() - time);
        }, 1_000);
    });

    onCleanup(() => {
        clearInterval(intervalRef);
    });

    const getFormattedDistance = () => {
        const distance = getDistance();
        const seconds = Math.floor(distance / 1_000);

        if (seconds < 60) {
            if (seconds === 1) {
                return `less than 1 second ago`;
            } else {
                return `${seconds} seconds ago`;
            }
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            if (minutes === 1) {
                return `less than 1 minute ago`;
            } else {
                return `${minutes} minutes ago`;
            }
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            if (hours === 1) {
                return `less than 1 hour ago`;
            } else {
                return `${hours} hours ago`;
            }
        }

        const days = Math.floor(hours / 24);

        if (days < 365) {
            if (days === 1) {
                return `less than 1 day ago`;
            } else {
                return `${days} days ago`;
            }
        }

        const years = Math.floor(days / 365);
        const yearDays = days % 365;

        if (yearDays <= 1) {
            return `${years} ${years === 1 ? 'year' : 'years'} ago 😞`;
        } else {
            return `${years} ${years === 1 ? 'year' : 'years'} and ${yearDays % 365} days ago 😞`;
        }
    };

    return getFormattedDistance;
}
