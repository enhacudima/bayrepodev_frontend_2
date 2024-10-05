<template>
  <div
    :style="{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      textAlign: 'center',
      marginBottom: '2%'
    }"
  >
    <vue-cookie-comply />
  </div>
  <a-layout-footer
    :style="{
      borderTop: '1px solid #e8e8e8',
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      textAlign: 'center',
      padding: '10px 50px'
    }"
  >
    <a-image :width="20" :src="'/favicon.ico'" />
    <a href="https://bayport.co.mz/" target="_blank"> {{ title }}</a> ©{{
      new Date().getFullYear()
    }}
    <a-typography-text disabled><small>Power By Evidevi</small></a-typography-text>
  </a-layout-footer>
</template>
<script>
import { defineComponent } from 'vue'
const title = import.meta.env.VITE_APP_TITLE

export default defineComponent({
  setup() {
    return {
      title
    }
  }
})
</script>
<style>
.cookie-comply__back-arrow {
  /* position: absolute; */
  left: var(--spacing-lg);
  cursor: pointer;
}
</style>
