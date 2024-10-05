<template>
  <a-tabs defaultActiveKey="1" @change="handle()">
    <a-tab-pane key="1">
      <template #tab>
        <span>
          <upload-outlined />
          Upload
        </span>
      </template>

      <BigUpload />
    </a-tab-pane>
    <a-tab-pane key="2" force-render>
      <template #tab>
        <span>
          <folder-open-outlined />
          Files
        </span>
      </template>
      <BigFiles />
    </a-tab-pane>
  </a-tabs>
</template>

<script >
import { UploadOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import BigUpload from './BigFileUpload.vue'
import BigFiles from './BigFileFiles.vue'
import EventBus from '@/Helpers/event-bus'
export default {
  components: { BigUpload, BigFiles, UploadOutlined, FolderOpenOutlined },
  setup() {},
  methods: {
    handle() {
      EventBus.$emit('big-files-change')
    }
  }
}
</script>

