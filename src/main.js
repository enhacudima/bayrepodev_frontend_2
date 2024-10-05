//import './assets/main.css'
import '../node_modules/nprogress/nprogress.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import i18n from './Locale/i18n.js'
import VueCookieComply from 'vue-cookie-comply'
import 'vue-cookie-comply/dist/style.css'
import './Helpers/interceptors'
import timeago from 'vue-timeago3'
import { ServerTable } from 'v-tables-3'
import { abilitiesPlugin } from '@casl/vue'
import { ability } from './Helpers/ability.js'
import store from './stores/index'

const app = createApp(App)

app.config.globalProperties.$baseUrl = import.meta.env.VITE_APP_API_RESOURCE_URL
app.config.globalProperties.$baseUrlAPI = import.meta.env.VITE_APP_API_URL

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)
app.use(VueCookieComply)
app.use(timeago)
app.use(store)
app.use(ServerTable, {}, 'bootstrap4')
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true
})

app.mount('#app')
