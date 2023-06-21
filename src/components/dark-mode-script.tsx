export default function DarkModeScript() {
    const code = SCRIPT.trim();
    return <script>{code}</script>;
}

const SCRIPT = `
let x='dark',
l=localStorage,
d=l.theme===x,
s=(!('theme'in l)&&window.matchMedia('(prefers-color-scheme: dark)').matches),
c=document.documentElement.classList;
d||s?c.add(x):c.remove(x);
`;
