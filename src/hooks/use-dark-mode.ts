import { createSignal, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

export interface Theme {
    system: boolean;
    dark: boolean;
}

export default function useDarkMode() {
    const [getTheme, setTheme] = createSignal<Theme>(getWindowTheme());

    onMount(() => {
        setTheme(getWindowTheme());
    });

    const setDarkMode = (arg: boolean | ((prev: Theme) => boolean)) => {
        const dark = typeof arg === 'function' ? arg(getTheme()) : arg;
        setTheme({ system: false, dark });
        setWindowTheme(dark);
    };

    const unsetTheme = () => {
        localStorage.removeItem('theme');
        setTheme(getWindowTheme());
    };

    return [getTheme, setDarkMode, unsetTheme] as const;
}

export const getWindowTheme = (): Theme => {
    const theme = isServer ? null : localStorage.getItem('theme');
    const themeDark = theme === 'dark';
    const themeNone = theme === null;
    const query = '(prefers-color-scheme: dark)';
    const themeSystemDark = isServer ? false : window.matchMedia(query).matches;
    return {
        system: themeNone,
        dark: themeDark || (themeNone && themeSystemDark),
    };
};

export const setWindowTheme = (dark: boolean): void => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    if (dark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
