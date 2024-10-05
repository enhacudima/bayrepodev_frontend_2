<template>
  <a-modal
    v-model:open="visible"
    width="1000px"
    :title="$t('new') + ' ' + $t('smsBound')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="form"
      v-bind="layout"
      name="nest-messages"
      :validate-messages="validateMessages"
      @finish="onFinish"
    >
      <a-form-item name="name" :label="$t('name')" :rules="[{ required: true }]" has-feedback>
        <a-input v-model:value="form.name" :placeholder="$t('unique')" />
      </a-form-item>
      <a-form-item :label="$t('template')" :rules="[{ required: true }]" name="template">
        <a-select
          v-model:value="form.template"
          show-search
          :placeholder="$t('select') + ' ' + $t('template')"
          :options="templates"
          :filter-option="false"
          @search="handleSearch"
          allowClear
        >
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('upload')" :rules="[{ required: true }]" name="upload">
        <a-select
          v-model:value="form.upload"
          show-search
          :placeholder="$t('select') + ' ' + $t('upload')"
          :options="uploads"
          :filter-option="false"
          @search="handleSearchUpload"
          allowClear
        >
        </a-select>
      </a-form-item>

      <a-form-item name="notes" :label="$t('note', 2)" :rules="[{ required: true }]" has-feedback>
        <a-textarea v-model:value="form.notes" :placeholder="$t('note', 2)" />
      </a-form-item>
      <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
        <a-button type="primary" html-type="submit">{{ $t('submit') }}</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">{{ $t('reset') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, ref, h, onMounted } from 'vue'
import { Modal } from 'ant-design-vue'
import axios from 'axios'
import eventBus from '@/Helpers/event-bus'
export default defineComponent({
  setup() {
    const layout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }

    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!'
      },
      number: {
        range: '${label} must be between ${min} and ${max}'
      }
    }
    const activeKey = ref(['1'])
    const formRef = ref()
    const roles = ref()
    const visible = ref(false)
    const uploads = ref([])
    const templates = ref([])
    const form = reactive({
      name: '',
      template: ref(undefined),
      upload: ref(undefined),
      notes: ''
    })
    const onFinish = (values) => {
      send(values)
    }
    const resetForm = () => {
      formRef.value.resetFields()
    }

    function send(values) {
      axios
        .post('/v1/smsbound', values)
        .then((response) => {
          Modal.success({
            title: 'New Bound Template Saved',
            content: h('div', {}, [h('p', response.data.name)])
          })
          visible.value = false
          eventBus.$emit('New-Bound-Changed')
          formRef.value.resetFields()
        })
        .catch(() => {})
    }
    const handleSearch = (value) => {
      var len = value ? value.length : 0
      if (len >= 1) {
        axios.get('/v1/smsboundtemplate/tags/templates/' + value).then((response) => {
          templates.value = []
          response.data.forEach((r) => {
            templates.value.push({
              key: r.id,
              value: r.id.toString(),
              label: r.name + ' (' + r.content + ')'
            })
          })
        })
      } else {
        templates.value = []
      }
    }
    const handleSearchUpload = (value) => {
      var len = value ? value.length : 0
      if (len >= 1) {
        axios.get('/v1/smsboundupload/tags/upload/' + value).then((response) => {
          uploads.value = []
          response.data.forEach((r) => {
            uploads.value.push({
              key: r.id,
              value: r.id.toString(),
              label: r.file_name + '(' + r.file_rows + ')'
            })
          })
        })
      } else {
        uploads.value = []
      }
    }

    onMounted(() => {})

    return {
      templates,
      handleSearch,
      handleSearchUpload,
      uploads,
      form,
      formRef,
      onFinish,
      layout,
      validateMessages,
      resetForm,
      activeKey,
      roles,
      visible
    }
  }
})
</script>