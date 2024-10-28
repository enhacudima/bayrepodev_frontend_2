<template>
  <a-row>
    <a-col :span="12" :offset="6">
      <div>
        <a-modal
          v-model:open="visible"
          width="1000px"
          :title="state.fulName"
          @ok="handleOk"
          :closable="false"
        >
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" force-render>
              <template #tab>
                <span>
                  <UserOutlined />
                  {{ $t('details') }}
                </span>
              </template>
              <tab-details :detailesData="state.data" />
            </a-tab-pane>
            <a-tab-pane key="2" force-render>
              <template #tab>
                <span>
                  <camera-outlined />
                  {{ $t('picture') }}
                </span>
              </template>
              <TabAvatar />
            </a-tab-pane>
          </a-tabs>
        </a-modal>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import eventBus from '@/Helpers/event-bus'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { UserOutlined, CameraOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import TabDetails from './TabDetails.vue'
import TabAvatar from './TabAvatar.vue'
export default defineComponent({
  components: {
    TabAvatar,
    UserOutlined,
    CameraOutlined,
    TabDetails
  },
  setup() {
    const visible = ref(false)
    const state = reactive({
      data: [],
      fulName: ''
    })
    onMounted(() => {
      eventBus.$on('Modal-User-Me', () => {
        visible.value = true
        axios.get('v1/me').then((response) => {
          state.data = response.data.data
          state.fulName = response.data.data.name + ' ' + response.data.data.lname
          //console.log(state.data)
        })
      })
    })
    const showModal = () => {
      visible.value = true
    }
    const handleOk = () => {
      visible.value = false
    }

    return {
      visible,
      showModal,
      handleOk,
      state,
      activeKey: ref('1')
    }
  }
})
</script>