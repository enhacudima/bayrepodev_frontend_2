<script setup>
import AppLayoutDefault from './components/layouts/LayoutDefault.vue'
import AppLayoutMaster from './components/layouts/LayoutMaster.vue'
import { markRaw, ref, watch, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { notification } from 'ant-design-vue'

const layout = ref()
const route = useRoute()
const open = ref(false)
let pwaInstallEvent

onBeforeMount(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    pwaInstallEvent = e
    // Stash the event so it can be triggered later.
    if (Cookies.get('add-to-home-screen') === undefined) {
      open.value = true
    }
  })
  window.addEventListener('appinstalled', () => {
    open.value = false
  })
})

const pwaInstall = async () => {
  pwaInstallEvent.prompt()
  const { outcome } = await pwaInstallEvent.userChoice
  if (outcome === 'accepted') {
    open.value = false
    // Take extra actions if the user opted for installation.
  } else {
    openNotification('Installation Cancelled')
  }
}

const openNotification = (t) => {
  notification.warning({
    message: t,
    description: 'We will soon remind you.'
  })
}

watch(
  () => route.meta.layout,
  async (metaLayout) => {
    try {
      //const component =
      // metaLayout &&
      // (await import(/* @vite-ignore */ `../src/components/layouts/${metaLayout}.vue`))

      //layout.value = markRaw(AppLayoutMaster || AppLayoutDefault)

      switch (metaLayout) {
        case 'LayoutMaster':
          layout.value = markRaw(AppLayoutMaster)
          break

        default:
          layout.value = markRaw(AppLayoutDefault)
          break
      }
    } catch (e) {
      layout.value = markRaw(AppLayoutDefault)
    }
  },
  { immediate: true }
)

const dismiss = () => {
  Cookies.set('add-to-home-screen', null, { expires: 7 })
  openNotification('Installation later')
  open.value = false
}
</script>
<template>
  <component :is="layout">
    <nointernet />
    <a-modal
      :open="open"
      :title="$t('install_app_in_device')"
      @ok="pwaInstall"
      @cancel="dismiss"
      :okText="$t('install_now')"
      :cancelText="$t('install_next_time')"
    >
      <p>{{ $t('install_app') }}</p>
    </a-modal>

    <RouterView />

    <a-modal :open="updateExists" title="New update" ok-text="Update" @ok="refreshApp">
      <p>A new system update {{ title }} has been found. Click update to enjoy all updates</p>
    </a-modal>
  </component>
</template>

<script >
import update from './mixins/update'
import Cookies from 'js-cookie'
//const nointernet = () => import("./components/Helpers/Errors/NoInternet.vue");
import nointernet from './components/Helpers/Errors/NoInternet.vue'
export default {
  components: {
    nointernet
  },

  data: () => ({
    deferredPrompt: null,
    onLine: null
  }),
  mixins: [update]
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
