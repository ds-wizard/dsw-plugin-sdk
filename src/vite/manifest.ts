import { PluginMetadata } from 'src/types'
import { PluginApiVersion } from 'src/version'

export function emitManifestPlugin(pluginMetadata: PluginMetadata) {
    return {
        name: 'emit-manifest',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async generateBundle(this: any) {
            const manifest = { ...pluginMetadata, pluginApiVersion: PluginApiVersion }

            this.emitFile({
                type: 'asset',
                fileName: 'manifest.js',
                source: `export default function(){return ${JSON.stringify(manifest)}}`,
            })
        },
    }
}
