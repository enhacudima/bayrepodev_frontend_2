<template>
  <a-layout-sider width="200" style="background: #fff" breakpoint="lg" collapsed-width="0">
    <a-menu v-model:selectedKeys="selectedKeys2" mode="inline" style="height: 100%">
      <a-menu-item key="4">
        <template #icon>
          <PieChartOutlined />
        </template>
        <router-link to="/services-sms-bound-dashboard">{{ $t('dashboard') }}</router-link>
      </a-menu-item>
      <a-menu-item key="5">
        <template #icon>
          <DashboardOutlined />
        </template>
        <router-link to="/services-sms-bound-queue">{{ $t('queue') }}</router-link>
      </a-menu-item>
      <a-menu-item key="1">
        <template #icon>
          <SendOutlined />
        </template>
        <router-link to="/services-sms-bound">{{ $t('smsBound') }}</router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <template #icon>
          <appstore-outlined />
        </template>
        <router-link to="/services-sms-bound-template">{{ $t('template', 2) }}</router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <template #icon>
          <cloud-upload-outlined />
        </template>
        <router-link to="/services-sms-bound-upload">{{ $t('upload', 2) }}</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'

import {
  SendOutlined,
  AppstoreOutlined,
  CloudUploadOutlined,
  PieChartOutlined,
  DashboardOutlined
} from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    SendOutlined,
    AppstoreOutlined,
    CloudUploadOutlined,
    PieChartOutlined,
    DashboardOutlined
  },
  setup() {
    const app = getCurrentInstance()
    const menu = app.appContext.config.globalProperties.$route.meta.menu
    const selectedKeys2 = ref([menu])
    return {
      selectedKeys2
    }
  }
})
</script>