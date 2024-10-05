<template>
  <a-modal
    v-model:open="visible"
    :title="$t('detaile', 2)"
    width="1000px"
    @ok="onClose"
    :closable="false"
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
      <a-form-item name="phone" :label="$t('phone')" :rules="[{ required: true }]" has-feedback>
        <a-input v-model:value="form.phone" :placeholder="840793255" />
      </a-form-item>
      <a-form-item
        name="messeges"
        :label="$t('messege', 2)"
        :rules="[{ required: true }]"
        has-feedback
      >
        <a-input type="number" v-model:value="form.messeges" />
      </a-form-item>
      <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
        <a-button type="primary" html-type="submit">{{ $t('submit') }}</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">{{ $t('reset') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { Modal } from 'ant-design-vue'
import axios from 'axios'
import { reactive, ref, h } from 'vue'
export default {
  components: {},
  setup() {
    const layout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }
    const visible = ref(false)
    const data = ref([])
    const onClose = () => {
      visible.value = false
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
    const formRef = ref()

    const form = reactive({
      phone: '',
      messeges: 1
    })
    const onFinish = (values) => {
      values.bound_uuid = data.value.uuid
      send(values)
    }
    const resetForm = () => {
      formRef.value.resetFields()
    }

    function send(values) {
      axios
        .post('/v1/smsbound/test', values)
        .then((response) => {
          Modal.success({
            title: 'Test Bound',
            content: h('div', {}, [h('p', response.data.name)])
          })
          visible.value = false
          formRef.value.resetFields()
        })
        .catch(() => {})
    }

    return {
      formRef,
      form,
      onFinish,
      visible,
      resetForm,
      onClose,
      data,
      layout,
      validateMessages
    }
  }
}
</script>

<style>
</style>
