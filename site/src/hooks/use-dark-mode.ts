import { createSignal } from 'solid-js';
import { isServer } from 'solid-js/web';

export interface Theme {
    value: 'dark' | 'light';
    system: boolean;
}

export default function useDarkMode() {
    const [getTheme, setThemeSignal] = createSignal<Theme>(getCurrentTheme());

    const setThemeValue = (value: Theme['value']) => {
        sessionStorage.setItem('theme', value);
        applyTheme(value);
        setThemeSignal(getCurrentTheme());
    };

    const clearTheme = () => {
        sessionStorage.removeItem('theme');
        applyTheme(getSystemTheme());
        setThemeSignal(getCurrentTheme());
    };

    const applyTheme = (value: Theme['value']) => {
        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return [getTheme, setThemeValue, clearTheme] as const;
}

const getSystemTheme = () => {
    const query = isServer ? false : window.matchMedia('(prefers-color-scheme: dark)').matches;
    return query ? 'dark' : 'light';
};

const getCurrentTheme = (): Theme => {
    const item = isServer ? null : sessionStorage.getItem('theme');
    if (item === null) {
        const value = getSystemTheme();
        return { value, system: true };
    }
    return { value: item === 'dark' ? 'dark' : 'light', system: false };
};
