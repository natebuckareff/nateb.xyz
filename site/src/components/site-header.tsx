import { A } from 'solid-start';
import useDarkMode from '~/hooks/use-dark-mode';
import MoonIcon from '~/icons/moon-icon';
import SunIcon from '~/icons/sun-icon';

export default function SiteHeader() {
    const [, setDarkMode] = useDarkMode();
    return (
        <header class="flex">
            <nav class="text-lg flex gap-3 flex-wrap xs:justify-start">
                <A class="x-link" href="/">
                    Nate Buckareff
                </A>

                <a
                    class="x-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/natebuckareff"
                >
                    GitHub
                </a>

                {/* <A class="x-link" href="/contact">
                    Contact
                </A> */}

                {/* <A class="x-link" href="/resume">
                    Resume
                </A> */}
            </nav>

            <div class="ml-auto flex gap-2 self-start mt-[7px]">
                {/* <Show when={!getTheme().system}>
                    <button
                        onClick={() => {
                            unsetTheme();
                        }}
                    >
                        <GearIcon class="stroke-slate-500 dark:stroke-yellow-500 w-4 h-4" />
                    </button>
                </Show> */}

                <button onClick={() => setDarkMode(theme => !theme.dark)}>
                    <SunIcon class="dark-theme-button w-4 h-4" />
                    <MoonIcon class="light-theme-button w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
