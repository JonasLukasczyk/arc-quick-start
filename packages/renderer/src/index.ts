import { createApp } from 'vue';
import App from '/@/App.vue';

const app = createApp(App);

// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// app.use(ElementPlus);
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// app.use(ElementPlus

import { Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.mount('#app');

