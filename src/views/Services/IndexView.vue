<template>
  <a-card :title="$t('option', 2)">
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/services-sms-bound-dashboard">
        <send-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>{{ $t('smsBound') }}</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/services-outbound">
        <shop-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>OutBound</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/services-bigfiles">
        <dropbox-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>Big Files</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/box-search">
        <code-sandbox-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>Box View</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <router-link to="/shared-files">
        <file-search-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>Shared Files</template>
        </a-card-meta>
      </router-link>
    </a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">
      <a :href="$baseUrl + 'wh-pending-approval/box-input'" target="_blank">
        <medicine-box-outlined :style="{ fontSize: '25px', color: '#08c' }" />
        <a-card-meta>
          <template #description>Box Upload</template>
        </a-card-meta>
      </a>
    </a-card-grid>
  </a-card>
</template>


<script>
import {
  SendOutlined,
  DropboxOutlined,
  FileSearchOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    SendOutlined,
    DropboxOutlined,
    FileSearchOutlined,
    ShopOutlined,
    MedicineBoxOutlined,
    CodeSandboxOutlined
  },
  setup() {}
})
</script>