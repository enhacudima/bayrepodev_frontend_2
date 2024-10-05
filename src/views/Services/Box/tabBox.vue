<template>
  <a-row justify="end" :style="{ marginBottom: '24px' }">
    <a-col :span="4">
      <a-button shape="round" @click="doCopy">
        <template #icon>
          <copy-outlined />
        </template>
        Copy
      </a-button>
    </a-col>
    <a-col :span="4">
      <a-button shape="round" @click="share">
        <template #icon>
          <qrcode-outlined v-if="filesV" />
          <FileTextOutlined v-if="!filesV" />
        </template>
        <template v-if="filesV"> QRCode </template>
        <template v-if="!filesV"> Files </template>
      </a-button>
    </a-col>
    <a-col :span="3">
      <a-button shape="round" @click="files">
        <template #icon>
          <redo-outlined />
        </template>
        Reload
      </a-button>
    </a-col>
  </a-row>
  <a-card title="Files" :style="{ marginBottom: '24px' }" :loading="state.fetching" v-if="filesV">
    <a-row :gutter="16">
      <a-col :span="8" v-for="(file, index) in filesClient" :key="index">
        <a-card
          hoverable
          style="
            text-align: center;
            width: 240px;
            max-width: 240px;
            max-height: 300px;
            margin-bottom: 24px;
          "
        >
          <template #cover>
            <a-image
              style="width: 240px; max-width: 240px; height: 192px; max-height: 192px"
              :src="$baseUrl + 'storage/' + file.path + file.name"
              v-if="file.mime_type == 'image-png' || file.mime_type == 'image-jpeg'"
            />
            <a-result v-if="file.mime_type == 'application-pdf'">
              <template #icon>
                <file-pdf-outlined />
              </template>
            </a-result>
            <a-result
              v-else-if="
                file.mime_type != 'image-png' &&
                file.mime_type != 'image-jpeg' &&
                file.mime_type != 'application-pdf'
              "
            >
              <template #icon>
                <FileTextOutlined />
              </template>
            </a-result>
          </template>
          <a-card-meta :title="file.original_name">
            <template #description>
              <a-tooltip color="blue">
                <template #title
                  >Name: {{ file.original_name }}, Date: {{ dataTimeFormat(file.updated_at) }},User:
                  {{ file.user ? file.user.name : '' }}
                </template>
                <a :href="$baseUrl + 'storage/' + file.path + file.name" target="_blank">
                  {{ dataTimeFormat(file.updated_at) }}
                </a>
              </a-tooltip>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
  <div v-if="filesV">
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :multiple="true"
      :action="$baseUrlAPI + '/v1/upload'"
      :headers="headers"
      :data="{ my_token: uuid, app: 'box', token_id: token_id }"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading client data or other
        band files
      </p>
    </a-upload-dragger>
  </div>
  <div v-if="!filesV">
    <a-row justify="center" :style="{ marginBottom: '24px' }">
      <a-image
        :preview="false"
        :width="200"
        :src="$baseUrlAPI + '/v1/wh-pending-approval/generate/qrcode/' + uuid + '/' + token_id"
      />
    </a-row>
    <a-row justify="center">
      <p>
        Point your <camera-outlined /> at the image. Make sure you are connected to the internal
        network (Bayport)
      </p>
    </a-row>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch, ref, onMounted, computed, inject } from 'vue'
import axios from 'axios'
import { message } from 'ant-design-vue'
import {
  InboxOutlined,
  FileTextOutlined,
  RedoOutlined,
  QrcodeOutlined,
  CameraOutlined,
  FilePdfOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'
import mb5 from 'md5'
import Cookies from 'js-cookie'
import { copyText } from 'vue3-clipboard'
export default defineComponent({
  components: {
    InboxOutlined,
    FileTextOutlined,
    RedoOutlined,
    QrcodeOutlined,
    CameraOutlined,
    FilePdfOutlined,
    CopyOutlined
  },
  props: {
    tabBoxRef: { type: Object }
  },
  setup(props) {
    const dataTimeFormat = (d) => {
      var date = format(new Date(d), 'yyyy-MM-dd hh:mm:ss')
      if (date == 'NaN-aN-aN') {
        date = '1900-01-01 00:00:00'
      }
      return date
    }
    const dataStringFormat = (d) => {
      var date = format(new Date(d), 'yyyyMMdd')
      if (date == 'NaN-aN-aN') {
        date = '1900-01-01 00:00:00'
      }
      return date
    }

    function format(x, y) {
      var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
      }
      y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
      })

      return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
      })
    }
    const url = inject('baseUrl')
    const clientInfo = computed(() => props.tabBoxRef)
    let checkDate = clientInfo.value.Date_Of_Birth instanceof Date
    let Date_Of_Birth = checkDate
      ? dataStringFormat(clientInfo.value.Date_Of_Birth)
      : clientInfo.value.Date_Of_Birth
    const uuid = ref(mb5(clientInfo.value.NUIT + Date_Of_Birth))
    const token_id = ref(clientInfo.value.NUIT)
    const fullUrl = ref(url + 'wh-pending-approval/box/qrcode/' + uuid.value + '/' + token_id.value)
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }

    const state = reactive({
      data: [],
      value: [],
      fetching: true
    })
    const table = reactive({
      dataSource: []
    })

    watch(clientInfo, () => {
      checkDate = clientInfo.value.Date_Of_Birth instanceof Date
      Date_Of_Birth = checkDate
        ? dataStringFormat(clientInfo.value.Date_Of_Birth)
        : clientInfo.value.Date_Of_Birth
      uuid.value = mb5(clientInfo.value.NUIT + Date_Of_Birth)
      token_id.value = clientInfo.value.NUIT
      fullUrl.value = url + 'wh-pending-approval/box/qrcode/' + uuid.value + '/' + token_id.value
      files()
    })

    const filesClient = ref([])
    const files = () => {
      state.fetching = true
      axios
        .get('v1/upload-get/' + uuid.value)
        .then((response) => {
          ;(filesClient.value = response.data), (state.fetching = false)
        })
        .catch(() => {})
    }

    onMounted(() => {
      files()
    })
    const fileList = ref([])
    const handleChange = (info) => {
      const status = info.file.status

      if (status !== 'uploading') {
        //console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        files()
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
    const filesV = ref(true)
    const share = () => {
      filesV.value = !filesV.value
    }
    const token = Cookies.get('token' + process.env.VUE_APP_PORT)
    const headers = {
      Authorization: `Bearer ${token}`
    }

    const doCopy = () => {
      copyText(fullUrl.value, undefined, (error) => {
        if (error) {
          alert('Can not copy')
          console.log(error)
        } else {
          message.success({
            content: () => 'Copied ' + fullUrl.value,
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 5
          })
        }
      })
    }

    return {
      doCopy,
      filesV,
      share,
      files,
      clientInfo,
      state,
      dataTimeFormat,
      uuid,
      handleChange,
      fileList,
      headers,
      filesClient,
      formItemLayout,
      ...toRefs(state),
      table,
      token_id,
      columns: [
        {
          title: 'First name',
          dataIndex: 'first_names',
          key: 'first_names'
        },
        {
          title: 'Surname',
          dataIndex: 'surname',
          key: 'surname'
        },
        {
          title: 'Client ID',
          dataIndex: 'client_id',
          key: 'client_id'
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: 'Mobile number',
          dataIndex: 'mobile_number',
          key: 'mobile_number'
        },
        {
          title: 'ID number',
          dataIndex: 'id_number',
          key: 'id_number'
        },
        {
          title: 'Date of birth',
          dataIndex: 'date_of_birth',
          key: 'date_of_birth'
        }
      ]
    }
  }
})
</script>
