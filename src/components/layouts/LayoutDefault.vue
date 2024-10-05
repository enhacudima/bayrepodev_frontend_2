<template>
  <a-layout class="layout">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          {{ $t('welcome') }}
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ padding: '75px', minHeight: '100vh' }">
      <slot />
      <Message />
      <Notification />
    </a-layout-content>
    <FooterView />
  </a-layout>
  <a-back-top />
</template>
<script>
import i18n from '@/Locale/i18n'
import Message from '../Helpers/MessengesView.vue'
import Notification from '../Helpers/NotificationView.vue'
import { defineComponent, ref } from 'vue'
import FooterView from '../FooterView.vue'
export default defineComponent({
  components: { FooterView, Message, Notification },
  setup() {
    const t = i18n
    return {
      selectedKeys: ref(['1']),
      t
    }
  }
})
</script>
<style>
.site-layout-content {
  background: #fff;
}

#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
</style>