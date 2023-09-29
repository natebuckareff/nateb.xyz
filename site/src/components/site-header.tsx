import { A } from 'solid-start';
import Link from './link';
import ThemeControls from './theme-controls';

export default function SiteHeader() {
    return (
        <header class="flex items-center">
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

            <ThemeControls class="ml-auto" />
        </header>
    );
}
