import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'scripts/index.js'),
            name: 'index',
            fileName: 'index',
        },
        outDir: resolve(__dirname, 'dist/scripts'),
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css') return 'style.css';
                    return assetInfo.name;
                },
            },
        },
    },
});
