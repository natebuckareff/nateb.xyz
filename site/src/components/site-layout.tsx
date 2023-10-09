import { JSX } from 'solid-js';
import SiteFooter from './site-footer';

export default function SiteLayout(props: { children: JSX.Element }) {
    return (
        <div class="flex flex-col justify-between p-4 min-h-[100vh] max-w-[90ch] mx-auto">
            <div>{props.children}</div>
            <SiteFooter />
        </div>
    );
}
