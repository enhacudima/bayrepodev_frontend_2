<template>
  <a-layout-sider width="200" style="background: #fff" breakpoint="lg" collapsed-width="0">
    <a-menu v-model:selectedKeys="selectedKeys2" mode="inline" style="height: 100%">
      <a-menu-item key="1">
        <template #icon>
          <team-outlined />
        </template>
        <router-link to="/others-access-user-list">{{ $t('user', 2) }}</router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <template #icon>
          <appstore-add-outlined />
        </template>
        <router-link to="/others-access-roles">{{ $t('role', 2) }}</router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <template #icon>
          <android-outlined />
        </template>
        <router-link to="/others-access-devices">{{ $t('device', 2) }}</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from 'vue'

import { TeamOutlined, AndroidOutlined, AppstoreAddOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    TeamOutlined,
    AndroidOutlined,
    AppstoreAddOutlined
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