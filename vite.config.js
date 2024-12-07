import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import topLevelAwait from 'vite-plugin-top-level-await'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log('vite configuration for mode', mode)
  return {
    /*esbuild: {
      supported: {
        'top-level-await': true //browsers can handle top-level-await features
      }
    },*/
    define: {
      __APP_ENV__: JSON.stringify(mode)
    },
    build: {
      mode: mode
    },
    plugins: [
      dynamicImport(/* options */),
      vue(),
      vueJsx(),
      vueDevTools(),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: '__tla',
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`
      }),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'MZ Portal',
          short_name: 'MZPortal',
          filename: '/src/service-worker.js',
          description: 'This is MZ Portal for Bayport Mozambique developed by EVIDEVI',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/img/icons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/img/icons/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    }
  }
})
