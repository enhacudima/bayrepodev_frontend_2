<template>
  <a-row type="flex" justify="space-around" align="middle">
    <a-col>
      <p class="height-100">
        <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :action="$baseUrlAPI + '/v1/me/avatar-upload'"
          :headers="headers"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <a-image v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </p>
    </a-col>
  </a-row>
</template>
<script>
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import Cookies from 'js-cookie'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default defineComponent({
  components: {
    LoadingOutlined,
    PlusOutlined
  },
  setup() {
    const fileList = ref([])
    const loading = ref(false)
    const imageUrl = ref('')
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        loading.value = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url) => {
          imageUrl.value = base64Url
          loading.value = false
        })
      }
      if (info.file.status === 'error') {
        loading.value = false
        message.error('upload error')
      }
    }
    //jpeg,jpg,png,gif
    const beforeUpload = (file) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/gif'
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    }
    const token = Cookies.get('token' + import.meta.env.VITE_APP_PORT)
    const headers = {
      Authorization: `Bearer ${token}`
    }
    return {
      headers,
      fileList,
      loading,
      imageUrl,
      handleChange,
      beforeUpload
    }
  }
})
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 512px;
  max-width: 512px;
  margin-top: 10px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>