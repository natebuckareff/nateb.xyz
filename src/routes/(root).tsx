import { Meta, Outlet, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import Analytics from '~/components/analytics/analytics';
import SiteLayout from '~/components/site-layout/site-layout';

export function routeData() {
    return createServerData$((_, event) => {
        return { requestId: event.locals['x-request-id'] as string | undefined };
    });
}

export default function RootLayout() {
    const getRouteData = useRouteData<typeof routeData>();
    const getRequestId = () => getRouteData()?.requestId ?? '';
    return (
        <SiteLayout>
            <Meta name="x-request-id" content={getRequestId()} />
            <Analytics requestId={getRequestId()}>
                <Outlet />
            </Analytics>
        </SiteLayout>
    );
}
