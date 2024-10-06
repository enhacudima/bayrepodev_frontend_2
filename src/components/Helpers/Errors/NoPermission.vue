<template>
  <a-result status="403" title="403" sub-title="You are not authorized to access this page.">
    <template #extra>
      <a-button type="primary" @click="back">Back</a-button>
      <a-button type="primary" @click="home">Back To Home</a-button>
      <a-button type="primary" @click="logout">Logout</a-button>
    </template>
  </a-result>
</template>

<script>
import store from '@/stores/index'
export default {
  data() {
    return {}
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    home() {
      this.$router.push('/')
    },
    logout() {
      store
        .dispatch('logoutAll')
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
