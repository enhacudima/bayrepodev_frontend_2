<template>
  <template> </template>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent } from 'vue'
import EventBus from '../../Helpers/event-bus'
export default defineComponent({
  created() {
    EventBus.$on('snackBar', (data) => {
      if (data.color == 'info') {
        message.info(data.text)
      } else if (data.color == 'success') {
        message.success(data.text)
      } else if (data.color == 'error') {
        message.error(data.text)
      } else if (data.color == 'warning') {
        message.warning(data.text)
      }
    })
  }
})
</script>