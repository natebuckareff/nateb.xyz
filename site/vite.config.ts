import mdx from '@mdx-js/rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [mdx({ jsxImportSource: 'solid-jsx' }), solid(), visualizer({ template: 'treemap' })],
    ssr: {
        external: ['better-sqlite3'],
    },
});
