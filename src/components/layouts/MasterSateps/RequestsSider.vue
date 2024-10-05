<template>
  <a-layout-sider
    width="200"
    style="background: #fff"
    breakpoint="lg"
    collapsed-width="0"
  >
    <a-menu
      v-model:selectedKeys="selectedKeys2"
      mode="inline"
      style="height: 100%"
    >
      <a-menu-item key="1">
        <router-link to="/others-requests-transactions">
          Transactions
        </router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <router-link to="/others-requests-transactions-loans">
          Loan
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from "vue";

export default defineComponent({
  components: {},
  setup() {
    const app = getCurrentInstance();
    const meta = app.appContext.config.globalProperties.$route.meta;
    const selectedKeys2 = ref([meta.menu]);
    return {
      selectedKeys2,
    };
  },
});
</script>