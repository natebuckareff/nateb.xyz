import { Title } from 'solid-start';
import { HttpHeader } from 'solid-start/server';
import SiteHeader from '~/components/site-header';
import SiteLayout from '~/components/site-layout';
import { PrinterIcon } from '~/icons/printer-icon';
import Resume from './resume.mdx';

const CONTACT_SECRET_KEY = [211, 240, 61, 165, 51, 8, 237, 47];

export default function ResumePage() {
    const onPrintClick = () => {
        const originalTitle = document.title;
        document.title = 'nate-buckareff-resume';
        window.print();
        document.title = originalTitle;
    };

    return (
        <>
            {/* Cache for 1 hour */}
            <HttpHeader name="Cache-Control" value="public, max-age=3600, stale-if-error=60" />

            <Title>Resume - Nate Buckareff</Title>

            <SiteLayout classFooter="print:hidden">
                <SiteHeader class="print:hidden" />

                <button
                    class="x-button print:hidden mt-8 flex gap-2 border rounded-md px-4 py-3"
                    onClick={onPrintClick}
                >
                    <PrinterIcon /> Print
                </button>

                <div class="x-article my-8">
                    <Resume secretKey={CONTACT_SECRET_KEY} />
                    <button
                        class="x-button print:hidden flex gap-2 border rounded-md px-4 py-3"
                        onClick={onPrintClick}
                    >
                        <PrinterIcon /> Print
                    </button>
                </div>
            </SiteLayout>
        </>
    );
}
