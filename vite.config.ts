import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const UnoCSS = (await import('unocss/vite')).default;
  return {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    plugins: [
      // @ts-expect-error esmodule
      uni.default(),
      vueJsx(),
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/typings/auto-imports.d.ts'
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 取消sass废弃API的报警
          silenceDeprecations: ['legacy-js-api', 'color-functions', 'import']
        }
      }
    },
  };
});
