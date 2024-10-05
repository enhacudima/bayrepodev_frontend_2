<template>
  <vue-identify-network @network-type="status">
  </vue-identify-network>
  <a-alert
      v-if="onLine == 'unidentifyable'"
        message="Warning"
        description="No internet connection."
        type="warning"
        show-icon
      >
      <template #icon><wifi-outlined /></template>
  </a-alert>
</template>

<script >
import { defineComponent } from 'vue';
import { VueIdentifyNetwork } from 'vue-identify-network';
import { WifiOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    VueIdentifyNetwork,
    WifiOutlined
  },
    data: () => ({
    onLine: null,
  }),

  methods: {
    status(ele) {
      this.onLine = ele;
      //console.log(ele)
    },
  },
});
</script>