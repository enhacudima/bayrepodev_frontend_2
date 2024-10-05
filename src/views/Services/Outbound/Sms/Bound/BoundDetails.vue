<template>
  <a-modal
    v-model:open="visible"
    :title="$t('detaile', 2)"
    width="1000px"
    @ok="onClose"
    :closable="false"
  >
    <a-row :gutter="[12, 12]">
      <a-col :span="12">
        <p>
          <UserAvatar
            :UserDataRef="detailesData.user"
            :showNameRef="true"
            v-if="detailesData.user"
          />
        </p>
        <p>
          <b>{{ $t('created_at') }}:</b> {{ dataTimeFormat(detailesData.created_at) }}
        </p>
        <p>
          <b>{{ $t('updated_at') }}:</b> {{ dataTimeFormat(detailesData.updated_at) }}
        </p>
        <p>
          <b>{{ $t('deleted_at') }}:</b> {{ dataTimeFormat(detailesData.updated_at) }}
        </p>
        <p>
          <b>{{ $t('team') }}:</b> {{ detailesData.team_name.name }}
        </p>
      </a-col>

      <a-col :span="12">
        <p>
          <b>{{ $t('file') }}:</b> {{ detailesData.upload_name.file_name }}
        </p>
        <p>
          <b>{{ $t('row', 2) }}:</b> {{ detailesData.upload_name.file_rows }}
        </p>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { ref } from 'vue'
import UserAvatar from '@/components/Helpers/UserAvatarView.vue'
export default {
  components: {
    UserAvatar
  },
  setup() {
    const detailesData = ref([])
    const visible = ref(false)
    const onClose = () => {
      visible.value = false
    }

    const dataTimeFormat = (d) => {
      var date = format(new Date(d), 'yyyy-MM-dd hh:mm:ss')
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

    return {
      visible,
      onClose,
      detailesData,
      dataTimeFormat
    }
  }
}
</script>

<style>
</style>
