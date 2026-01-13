import { PluginMetadata } from '../types'
import { PluginApiVersion } from '../version'

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
