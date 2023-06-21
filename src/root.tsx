// @refresh reload
import { Suspense } from 'solid-js';
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Link,
    Meta,
    Routes,
    Scripts,
    Title,
} from 'solid-start';
import DarkModeScript from './components/dark-mode-script';
import './root.css';

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>nateb.xyz</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
                <Link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <DarkModeScript />
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <Routes>
                            <FileRoutes />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <Scripts />
            </Body>
        </Html>
    );
}
