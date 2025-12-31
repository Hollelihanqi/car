import { presetUni } from '@uni-helper/unocss-preset-uni';
import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: '#FF6B00', // 主色 - 橙色
      primary2: '#FF8F00' // 辅色
    }
  }
});
