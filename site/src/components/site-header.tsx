import { A } from 'solid-start';
import HireMeCallout from './hire-me-callout';
import Link from './link';
import ThemeControls from './theme-controls';

export default function SiteHeader() {
    return (
        <div>
            <header class="flex items-center">
                <nav class="text-lg flex gap-3 flex-wrap xs:justify-start">
                    <A class="x-link" href="/">
                        Nate Buckareff
                    </A>

                    <Link class="x-link" href="https://github.com/natebuckareff">
                        GitHub
                    </Link>

                    <A class="x-link" href="/resume">
                        Resume
                    </A>

                    <A class="x-link" href="/contact">
                        Contact
                    </A>
                </nav>

                <ThemeControls class="ml-auto" />
            </header>

            <HireMeCallout class="mt-8" />
        </div>
    );
}
