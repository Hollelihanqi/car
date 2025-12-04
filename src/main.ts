import { createSSRApp } from 'vue';
import App from './App.vue';

// import 'uview-plus/index.scss';
import 'uno.css';

export function createApp() {
  const app = createSSRApp(App);
  return {
    app
  };
}
