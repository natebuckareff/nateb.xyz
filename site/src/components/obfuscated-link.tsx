import { JSX, Match, Switch, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export interface ObfuscatedLinkProps {
    as?: (props: JSX.HTMLElementTags['a']) => JSX.Element;
    class?: string;
    href: string;
    text: string;
    secretKey: number[];
    autohide?: boolean;
}

export default function ObfuscatedLink(props: ObfuscatedLinkProps) {
    let ref: HTMLAnchorElement;

    onMount(() => {
        if (!props.autohide) {
            ref.setAttribute('href', decrypt(props.href, props.secretKey));
        }
        ref.innerText = decrypt(props.text, props.secretKey).split('').reverse().join('');
    });

    const onMouseEnter: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = e => {
        e.currentTarget.setAttribute('href', decrypt(props.href, props.secretKey));
    };

    const onMouseLeave: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = e => {
        e.currentTarget.setAttribute('href', '');
    };

    return (
        <Switch>
            <Match when={props.autohide}>
                <Dynamic
                    component={props.as ?? 'a'}
                    ref={ref!}
                    class={props.class}
                    style="unicode-bidi:bidi-override; direction: rtl;"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <span class="invisible">&#9633;</span>
                </Dynamic>
            </Match>
            <Match when={!props.autohide}>
                <Dynamic
                    component={props.as ?? 'a'}
                    ref={ref!}
                    class={props.class}
                    style="unicode-bidi:bidi-override; direction: rtl;"
                >
                    <span class="invisible">&#9633;</span>
                </Dynamic>
            </Match>
        </Switch>
    );
}

// function encrypt(cleartext: string, key: number[]) {
//     const encoder = new TextEncoder();
//     const bytes = encoder.encode(cleartext);
//     for (let i = 0; i < bytes.length; ++i) {
//         bytes[i] = bytes[i] ^ key[i % 8];
//     }
//     return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
// }

function decrypt(ciphertext: string, key: number[]) {
    const bytes = Uint8Array.from(ciphertext.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    for (let i = 0; i < bytes.length; ++i) {
        bytes[i] = bytes[i] ^ key[i % 8];
    }
    return new TextDecoder().decode(bytes);
}
