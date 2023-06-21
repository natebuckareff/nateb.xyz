import { A } from 'solid-start';

export default function NotFound() {
    return (
        <main class="flex items-center justify-center h-full">
            <A href="/" class="max-w-fit text-center">
                <h1 class="max-6-xs text-9xl font-bold italic text-gray-400 uppercase">404</h1>
                <h2 class="max-6-xs text-4xl font-bold italic text-gray-400">Not found</h2>
            </A>
        </main>
    );
}
