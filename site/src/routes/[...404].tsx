import SiteError from '~/components/site-error';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';

export default function NotFoundPage() {
    return (
        <SiteLayout>
            <SiteHeader />
            <SiteError>
                <h1>Not Found</h1>
                <p>Woop woop woop woop</p>
            </SiteError>
        </SiteLayout>
    );
}
