// @refresh reload
import { Suspense } from 'solid-js';
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from 'solid-start';
import AnalyticsProvider from './components/analytics-provider';
import DarkModeScript from './components/dark-mode-script';
import './root.css';

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>nateb.xyz</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
                <DarkModeScript />
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <AnalyticsProvider>
                            <Routes>
                                <FileRoutes />
                            </Routes>
                        </AnalyticsProvider>
                    </ErrorBoundary>
                </Suspense>
                <Scripts />
            </Body>
        </Html>
    );
}
