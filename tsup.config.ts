import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
    entry: [
        'src/index.ts',
        'src/core/index.ts',
        'src/elements/index.ts',
        'src/project-importer/index.ts',
        'src/data/index.ts',
        'src/types.ts',
        'src/protocol.ts',
        'src/requests/index.ts',
        // One entry per UI module, so a plugin carries only what it imports.
        'src/ui/*.ts',
        'src/ui/*.tsx',
        'src/utils/index.ts',
        'src/version.ts',
        'src/vite/index.ts',
    ],
    external: ['react', 'react-dom'],
    format: ['esm'],
    dts: {
        // tsup sets `baseUrl` for its declaration build itself, which TypeScript 6
        // deprecates; the project's own tsconfig has none.
        compilerOptions: { ignoreDeprecations: '6.0' },
    },
    sourcemap: true,
    // Not while watching: a dist emptied before every rebuild is one a plugin
    // that watches it (packages/plugin-example) fails to build from meanwhile.
    clean: !options.watch,
    outDir: 'dist',
    // Code the entries share is one chunk, not a copy in each.
    splitting: true,
    treeshake: true,
}))
