<template>
  <a-card :title="state.data.name" style="width: 100%" :loading="loading">
    <a-row justify="end" :style="{ marginBottom: '24px' }">
      <a-button @click="onTest(state.data)">
        <template #icon>
          <rocket-outlined />
        </template>
        {{ $t('test') }}
      </a-button>
      <a-button @click="detailes(state.data)">
        <template #icon>
          <expand-outlined />
        </template>
        {{ $t('view') }}
      </a-button>
      <a-button @click="onJob">
        <template #icon>
          <plus-outlined />
        </template>
        Job
      </a-button>
      <a-button @click="fetch">
        <template #icon>
          <redo-outlined />
        </template>
        {{ $t('reload') }}
      </a-button>
    </a-row>
    <a-row :gutter="24">
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 6, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('contact', 2)"
            :value="state.data.upload_name.file_rows"
            class="demo-class"
            :value-style="{ color: '#1890ff' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 6, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('runed')"
            :value="runed"
            class="demo-class"
            :value-style="{ color: '#faad14' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 6, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('failed')"
            :value="failed"
            class="demo-class"
            :value-style="{ color: '#ff4d4f' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 6, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('success')"
            :value="success"
            class="demo-class"
            :value-style="{ color: '#73d13d' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <BoundJobList ref="listData" />
  </a-card>
  <BoundDetails ref="detailesData" />
  <NewJob ref="newjob" />
  <BoundTest ref="testData" />
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { RedoOutlined, ExpandOutlined, PlusOutlined, RocketOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import eventBus from '@/Helpers/event-bus'
import BoundDetails from '@/views/Services/Outbound/Sms/Bound/BoundDetails.vue'
import axios from 'axios'
import NewJob from '@/views/Services/Outbound/Sms/Bound/NewJob.vue'
import BoundJobList from '@/views/Services/Outbound/Sms/Bound/BoundJobList.vue'
import BoundTest from './BoundTest.vue'

export default defineComponent({
  components: {
    RedoOutlined,
    BoundDetails,
    NewJob,
    BoundJobList,
    ExpandOutlined,
    PlusOutlined,
    RocketOutlined,
    BoundTest
  },
  setup() {
    const newjob = ref()
    const detailesData = ref()
    const listData = ref()
    const success = ref()
    const failed = ref()
    const runed = ref()
    const testData = ref()
    const loading = ref(true)
    const route = useRoute()
    const state = reactive({
      data: []
    })
    const uuid = route.params.uuid

    const detailes = () => {
      detailesData.value.visible = true
    }
    const onTest = (data) => {
      testData.value.visible = true
      testData.value.data = data
    }
    const onJob = () => {
      newjob.value.bound_uuid = uuid
      newjob.value.visible = true
    }
    const fetch = () => {
      loading.value = true
      axios.get('v1/smsbound/' + uuid).then((response) => {
        state.data = response.data.data
        detailesData.value.detailesData = response.data.data
        success.value = response.data.job_success
        failed.value = response.data.job_failed
        runed.value = response.data.job_runed
        loading.value = false
      })
    }
    onMounted(() => {
      fetch()
      eventBus.$on('bound-Changed', () => {
        fetch()
      })
    })
    return {
      state,
      fetch,
      loading,
      detailesData,
      detailes,
      newjob,
      onJob,
      listData,
      runed,
      failed,
      success,
      onTest,
      testData
    }
  }
})
</script>
