import { createSSRApp } from 'vue';
import App from './App.vue';
import uviewPlus from 'uview-plus';

import '@/styles/uview-plus.theme.scss';
import 'uview-plus/index.scss';
import 'uno.css';

export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus);
  return {
    app
  };
}
