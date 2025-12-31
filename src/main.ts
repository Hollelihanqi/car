import { createSSRApp } from 'vue';
import App from './App.vue';
import * as Pinia from 'pinia';
import { createUniPersistPlugin } from 'pinia-plugin-uni-persist-next';
import 'uno.css';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();
  pinia.use(createUniPersistPlugin({ keyPrefix: 'bank_' }));
  app.use(pinia);
  return {
    app
  };
}
