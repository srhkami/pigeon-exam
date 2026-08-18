import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

function chunkModuleMap() {
  return {
    name: 'chunk-module-map',
    generateBundle(this: {emitFile: (file: {type: 'asset'; fileName: string; source: string}) => void}, _options: unknown, bundle: Record<string, unknown>) {
      const chunks = Object.values(bundle).flatMap((output) => {
        if (!output || typeof output !== 'object' || !('type' in output) || output.type !== 'chunk') {
          return [];
        }

        const chunk = output as unknown as {
          fileName: string;
          isEntry: boolean;
          imports: string[];
          dynamicImports: string[];
          modules: Record<string, unknown>;
        };
        return [{
          fileName: chunk.fileName,
          isEntry: chunk.isEntry,
          imports: chunk.imports,
          dynamicImports: chunk.dynamicImports,
          modules: Object.keys(chunk.modules),
        }];
      });

      this.emitFile({
        type: 'asset',
        fileName: 'chunk-module-map.json',
        source: JSON.stringify({chunks}, null, 2),
      });
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    chunkModuleMap(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // ✅ 關鍵設定
    port: 5183        // 🔁 可以自訂 port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
