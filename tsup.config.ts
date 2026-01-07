import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/core/index.ts',
        'src/elements/index.ts',
        'src/data/index.ts',
        'src/utils/index.ts',
        'src/types.ts',
        'src/protocol.ts',
        'src/version.ts',
    ],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    splitting: false,
    treeshake: true,
})
