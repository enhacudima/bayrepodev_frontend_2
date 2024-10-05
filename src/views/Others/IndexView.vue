<template>
  <a-card title="Settings">
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/others-access-user-list">
        <team-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>User Access</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/others-apps-approvals">
        <CheckSquareOutlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>App Aprovals </template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/others-products">
        <GoldOutlined  :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>Products</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/others-settings-sms">
        <MessageOutlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>SMS Settings</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
  </a-card>
</template>


<script>
import {
  TeamOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  GoldOutlined,
} from "@ant-design/icons-vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    TeamOutlined,
    MessageOutlined,
    CheckSquareOutlined,
    GoldOutlined,
  },
  setup() {},
});
</script>