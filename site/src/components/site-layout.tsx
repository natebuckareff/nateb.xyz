import { JSX } from 'solid-js';
import SiteFooter from './site-footer';

export interface SiteLayoutProps {
    children: JSX.Element;
    classFooter?: string;
}

export default function SiteLayout(props: SiteLayoutProps) {
    return (
        <div class="flex flex-col justify-between p-4 print:p-0 min-h-[100vh] max-w-[90ch] mx-auto">
            <div>{props.children}</div>
            <SiteFooter class={props.classFooter} />
        </div>
    );
}
