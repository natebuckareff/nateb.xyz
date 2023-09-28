import { JSX } from 'solid-js';

export default function Link(props: JSX.IntrinsicElements['a']) {
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
