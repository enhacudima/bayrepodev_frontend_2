<template>
  <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
    <a-card :title="$t('search')" style="width: 100%">
      <a-input-search
        v-model:value="value"
        placeholder="Serach here.."
        :loading="loading"
        enter-button
      />
    </a-card>
  </div>
  <a-button type="primary" :style="{ marginBottom: '24px' }" @click="showNewForm()">{{
    $t('new')
  }}</a-button>
  <a-skeleton active :loading="loading">
    <template v-if="dataSource.data != undefined && dataSource.data.length">
      <a-row :gutter="16">
        <a-col :span="8" v-for="(item, index) in dataSource.data" :key="index">
          <a-card hoverable small :style="{ marginBottom: '24px' }">
            <a-card-meta :title="item.name">
              <template #description>
                <p><UserAvatar :UserDataRef="item.user" :showNameRef="true" /></p>
                <p>
                  <b>{{ $t('content') }}: </b> {{ item.content }}
                </p>
                <p>
                  <b>{{ $t('last_update') }}:</b> {{ dataTimeFormat(item.updatedAt) }}
                </p>
              </template>
            </a-card-meta>
            <template #actions>
              <a-popconfirm
                :title="$t('sureToUnBlock')"
                v-if="item.status != 1"
                @confirm="onUnBlock(item)"
                key="unBlock"
              >
                <CheckOutlined />
              </a-popconfirm>
              <a-popconfirm :title="$t('sureToBlock')" v-else @confirm="onBlock(item)">
                <DeleteOutlined :style="{ color: 'hotpink' }" keys="block" />
              </a-popconfirm>
              <edit-outlined key="logs" @click="OnShowUpdateForm(item)" />
            </template>
          </a-card>
        </a-col>
      </a-row>
      <br />
      <a-row justify="end">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.perPage"
          :total="pagination.total"
          :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
          @change="onChangePageNumber"
        />
      </a-row>
    </template>
    <a-empty v-else />
  </a-skeleton>
  <NewForm ref="newForm" />
  <UpdateForm ref="updateFormData" />
</template>
<script>
import UpdateForm from '@/views/Services/Outbound/Sms/Template/UpdateForm.vue'
import NewForm from '../Template/NewForm.vue'
import { DeleteOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash-es'
import UserAvatar from '@/components/Helpers/UserAvatarView.vue'
import eventBus from '@/Helpers/event-bus'
const getRandomuserParams = (params) => ({
  perPage: params.pageSize,
  page: params.current,
  ...params
})

export default defineComponent({
  components: {
    NewForm,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    UserAvatar,
    UpdateForm
  },
  setup() {
    const pagination = ref({
      current: 1,
      perPage: 15
    })
    const dataSource = ref()
    const loading = ref(true)
    const fetch = (params = {}) => {
      loading.value = true
      var queryString = Object.keys(getRandomuserParams(params))
        .map(function (key) {
          return key + '=' + params[key]
        })
        .join('&')
      let u = queryString.toString()
      //console.log(u)
      axios.get('/v1/smsboundtemplate?' + u).then((response) => {
        dataSource.value = response.data
        loading.value = false
        pagination.value = {
          perPage: parseInt(dataSource.value.meta.per_page),
          current: parseInt(dataSource.value.meta.current_page),
          total: parseInt(dataSource.value.meta.total)
        }
      })
    }
    onMounted(() => {
      fetch(pagination.value)
    })

    const onChangePageNumber = (pageNumber) => {
      pagination.value.page = pageNumber
      fetch(pagination.value)
    }

    const updateFormData = ref()
    const OnShowUpdateForm = (record) => {
      updateFormData.value.form.name = record.name
      updateFormData.value.form.content = record.content
      updateFormData.value.visible = true
      updateFormData.value.form.id = record.id
    }
    const value = ref()
    const fetchDevice = debounce((value) => {
      const params = {
        perPage: 20,
        page: 1,
        sortField: undefined,
        sortOrder: undefined,
        likeName: value + '%',
        likeContent: value + '%'
      }
      if (value) fetch(params)
      else
        fetch({
          perPage: 20,
          page: 1,
          sortField: undefined,
          sortOrder: undefined
        })
    }, 500)

    const onBlock = (record) => {
      axios.get('/v1/smsboundtemplate/block/' + record.uuid).then(function () {
        fetch(pagination.value)
      })
    }

    const onUnBlock = (record) => {
      axios.get('/v1/smsboundtemplate/unblock/' + record.uuid).then(function () {
        fetch(pagination.value)
      })
    }
    eventBus.$on('New-SmsBoundTemplate-Changed', () => {
      fetch(pagination.value)
    })
    const newForm = ref()
    const showNewForm = () => {
      newForm.value.visible = true
    }

    watch(value, () => {
      dataSource.value = ''
      fetchDevice(value.value)
      loading.value = true
    })
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
      dataSource,
      dataTimeFormat,
      updateFormData,
      loading,
      value,
      pagination,
      onChangePageNumber,
      onBlock,
      onUnBlock,
      showNewForm,
      newForm,
      OnShowUpdateForm
    }
  }
})
</script>