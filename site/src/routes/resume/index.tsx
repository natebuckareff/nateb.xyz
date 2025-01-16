import { Title } from 'solid-start';
import { HttpHeader } from 'solid-start/server';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';
import Resume from './resume.mdx';
import './style.css';

const CONTACT_SECRET_KEY = [211, 240, 61, 165, 51, 8, 237, 47];

export default function ResumePage() {
    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <Title>Resume - Nate Buckareff</Title>

            <SiteLayout classFooter="print:hidden">
                <SiteHeader class="print:hidden" />

                <div class="mt-8 print:hidden">
                    <a href="/resume.pdf" class="x-link text-lg">
                        Download PDF
                    </a>
                </div>

                <div class="x-article my-8">
                    <Resume secretKey={CONTACT_SECRET_KEY} />
                    <a href="/resume.pdf" class="x-link print:hidden">
                        Download PDF
                    </a>
                </div>
            </SiteLayout>
        </>
    );
}
