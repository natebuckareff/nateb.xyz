import { JSX } from 'solid-js';

export default function SiteError(props: { children: JSX.Element[] }) {
    return <article>{props.children}</article>;
}
