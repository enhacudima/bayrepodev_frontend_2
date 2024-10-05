<template>
  <a-layout>
    <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="sub1" disabled>
          <a-avatar style="background-color: #1890ff" v-if="userAvatar == 'default.jpg'">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <a-avatar
            :src="$baseUrl + 'storage/uploads/avatars/' + userAvatar"
            style="background-color: #1890ff"
            v-else
          >
          </a-avatar>
          {{ userName }}</a-menu-item
        >

        <I18nView />

        <a-menu-item key="1">
          <template #icon>
            <HomeOutlined />
          </template>
          <router-link to="/home">{{ $t('home') }}</router-link>
        </a-menu-item>
        <a-menu-item key="2" v-if="$can('services')">
          <template #icon>
            <api-outlined />
          </template>
          <router-link to="/services">{{ $t('service', 2) }}</router-link>
        </a-menu-item>
        <a-menu-item key="3" v-if="$can('space')">
          <template #icon>
            <FolderOpenOutlined />
          </template>
          <router-link to="/current">{{ $t('space') }}</router-link>
        </a-menu-item>
        <a-menu-item key="4" v-if="$can('others')">
          <template #icon>
            <plus-outlined />
          </template>
          <router-link to="/others">{{ $t('other', 2) }}</router-link>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <template #icon>
            <SettingOutlined />
          </template>
          <template #title>{{ $t('settings', 2) }}</template>
          <a-menu-item-group>
            <a-menu-item key="setting:5" @click="showUserMe">
              <template #icon>
                <user-outlined />
              </template>
              {{ $t('me') }} - {{ userCategory }}
            </a-menu-item>
            <router-link to="/home">
              <a-menu-item key="setting:1">
                <template #icon>
                  <home-outlined />
                </template>
                {{ $t('home') }}
              </a-menu-item>
            </router-link>
            <router-link to="/others-access-user-password-change">
              <a-menu-item key="setting:2">
                <template #icon>
                  <LockOutlined />
                </template>
                {{ $t('change_password') }}
              </a-menu-item>
            </router-link>
            <a-popconfirm placement="bottom" title="Sure to Logout?" @confirm="userLogout">
              <a-menu-item key="setting:3">
                <template #icon>
                  <PoweroffOutlined :style="{ color: 'hotpink' }" />
                </template>
                {{ $t('logout') }}
              </a-menu-item>
            </a-popconfirm>
            <a-menu-item key="setting:4">
              <template #icon>
                <CopyrightCircleOutlined />
              </template>
              {{ title }}
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 65px">
      <a-breadcrumb style="margin: 16px 0">
        <template v-for="(item, key) in breadcrumb[0]" :key="key">
          <a-breadcrumb-item>{{ $t(item) }}</a-breadcrumb-item>
        </template>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <ClientSider v-if="selectedSider1 == 1" />
        <OutBoundSider v-else-if="selectedSider1 == 2" />
        <AccessSider v-else-if="selectedSider1 == 3" />
        <SettingsSider v-else-if="selectedSider1 == 4" />
        <SmsSettingsSider v-else-if="selectedSider1 == 5" />
        <a-layout-content :style="{ padding: '0 24px', minHeight: '100vh' }">
          <slot />
          <Message />
          <Notification />
          <MeViewVue />
        </a-layout-content>
      </a-layout>
    </a-layout-content>

    <FooterView />
  </a-layout>
  <a-back-top />
</template>
<script>
import { defineComponent, watch, ref, getCurrentInstance, onMounted } from 'vue'
import { useRoute /*useRouter*/ } from 'vue-router'
import FooterView from '../FooterView.vue'
import ClientSider from '../layouts/MasterSateps/ClientSider.vue'
import OutBoundSider from '../layouts/MasterSateps/OutBoundSider.vue'
import AccessSider from '../layouts/MasterSateps/AccessSider.vue'
import SettingsSider from '../layouts/MasterSateps/SettingsSider.vue'
import Message from '../Helpers/MessengesView.vue'
import SmsSettingsSider from '../layouts/MasterSateps/SmsSettingsSider.vue'
import Notification from '../Helpers/NotificationView.vue'
import I18nView from '../Helpers/I18nView.vue'
import { ApiOutlined, FolderOpenOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons-vue'
import {
  UserOutlined,
  PoweroffOutlined,
  LockOutlined,
  CopyrightCircleOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import Cookies from 'js-cookie'
import { useStore } from 'vuex'
import eventBus from '@/Helpers/event-bus'
import MeViewVue from '../User/MeView.vue'

export default defineComponent({
  components: {
    FooterView,
    ClientSider,
    AccessSider,
    Message,
    Notification,
    UserOutlined,
    PoweroffOutlined,
    SettingsSider,
    LockOutlined,
    CopyrightCircleOutlined,
    ApiOutlined,
    FolderOpenOutlined,
    PlusOutlined,
    HomeOutlined,
    MeViewVue,
    I18nView,
    OutBoundSider,
    SettingOutlined,
    SmsSettingsSider
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    //const router = useRouter()
    const userName = Cookies.get('userName' + import.meta.env.VITE_APP_PORT)
    const userAvatar = Cookies.get('userAvatar' + import.meta.env.VITE_APP_PORT)
    const userCategory = Cookies.get('userCategory' + import.meta.env.VITE_APP_PORT)
    const app = getCurrentInstance()
    const meta = app.appContext.config.globalProperties.$route.meta
    const selectedKeys1 = ref([meta.nav])
    const selectedSider1 = ref([meta.sider])
    const breadcrumb = ref([meta.breadcrumb])
    const title = import.meta.env.VITE_APP_TITLE

    // fetch the user information when params change
    watch(
      () => route.meta.nav,
      async (newId) => {
        selectedKeys1.value = [newId]
      }
    )

    watch(
      () => route.meta.sider,
      async (newId) => {
        selectedSider1.value = [newId]
      }
    )

    watch(
      () => route.meta.breadcrumb,
      async (newId) => {
        breadcrumb.value = [newId]
      }
    )

    onMounted(() => {
      const cookieMinutes = Cookies.get('cookieMinutes' + import.meta.env.VITE_APP_PORT)
      const timeOut = 60000 * cookieMinutes

      setInterval(function () {
        const token = Cookies.get('token' + import.meta.env.VITE_APP_PORT)
        if (!token) logout()
      }, timeOut)
    })

    const userLogout = logout

    const showUserMe = () => {
      const userId = Cookies.get('id' + import.meta.env.VITE_APP_PORT)
      eventBus.$emit('Modal-User-Me', userId)
    }

    function logout() {
      store
        .dispatch('logoutAll')
        .then(() => {})
        .catch(() => {})
    }

    return {
      selectedKeys1,
      selectedSider1,
      breadcrumb,
      userName,
      userCategory,
      userLogout,
      title,
      userAvatar,
      showUserMe
    }
  }
})
</script>
<style scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>