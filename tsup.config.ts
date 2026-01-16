import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/core/index.ts',
        'src/elements/index.ts',
        'src/project-importer/index.ts',
        'src/data/index.ts',
        'src/types.ts',
        'src/protocol.ts',
        'src/ui/SimpleImporter.tsx',
        'src/utils/index.ts',
        'src/version.ts',
        'src/vite/index.ts',
    ],
    external: ['react', 'react-dom'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    splitting: false,
    treeshake: true,
})
