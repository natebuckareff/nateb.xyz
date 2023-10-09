export default function DarkModeScript() {
    const code = SCRIPT.replace('\n', '').trim();
    return <script defer>{code}</script>;
}

const SCRIPT = `
let t=sessionStorage.getItem('theme'),
v='dark',
c=t===v||!t&&window.matchMedia('(prefers-color-scheme: dark)').matches,
d=document.documentElement.classList;
c?d.add(v):d.remove(v);
`;
