import useDarkMode from '~/hooks/use-dark-mode';
import GearIcon from '~/icons/gear-icon';
import MoonIcon from '~/icons/moon-icon';
import SunIcon from '~/icons/sun-icon';

export default function ThemeControls(props: { class?: string }) {
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
        <div class={'group flex gap-2 ' + props.class}>
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
    );
}
