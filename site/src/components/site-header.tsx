import { A } from 'solid-start';
import useDarkMode from '~/hooks/use-dark-mode';
import GearIcon from '~/icons/gear-icon';
import MoonIcon from '~/icons/moon-icon';
import SunIcon from '~/icons/sun-icon';
import Link from './link';

export default function SiteHeader() {
    const [getTheme, setThemeValue, clearTheme] = useDarkMode();

    const handleSystemThemeClick = () => {
        clearTheme();
    };

    const handleAppThemeClick = () => {
        const theme = getTheme();
        if (theme.value === 'dark') {
            setThemeValue('light');
        } else {
            setThemeValue('dark');
        }
    };

    return (
        <header class="flex">
            <nav class="text-lg flex gap-3 flex-wrap xs:justify-start">
                <A class="x-link" href="/">
                    Nate Buckareff
                </A>

                <Link class="x-link" href="https://github.com/natebuckareff">
                    GitHub
                </Link>

                <A class="x-link" href="/contact">
                    Contact
                </A>

                {/* <A class="x-link" href="/resume">
                    Resume
                </A> */}
            </nav>

            <div class="group ml-auto flex gap-2 self-start mt-[7px]">
                <button
                    style={{ display: getTheme().system ? 'none' : 'block' }}
                    onClick={handleSystemThemeClick}
                >
                    <GearIcon class="transition-opacity ease-in-out opacity-0 group-hover:opacity-50 stroke-slate-500 dark:stroke-yellow-500 w-4 h-4" />
                </button>

                <button onClick={handleAppThemeClick}>
                    <SunIcon class="dark-theme-button w-4 h-4" />
                    <MoonIcon class="light-theme-button w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
