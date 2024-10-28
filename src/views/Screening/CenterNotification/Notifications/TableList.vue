<template>
  <a-input-search
    v-model:value="searchValue"
    placeholder="Search here"
    @search="onSearch"
    :loading="loading"
    enter-button
    :style="{ marginBottom: '24px', width: '500px' }"
  />
  <a-table
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="tableData"
    :scroll="{ x: 1500, y: 600 }"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'bypass'">
        <a-row v-for="(bypass, key) in record.bypass" :key="key">
          <span v-if="record.bypass">
            <UserAvatarView :UserDataRef="bypass.users" :showNameRef="true" />
            <a-divider />
            <a-tag :color="'green'">
              {{ dateFromNow(bypass.updated_at) }}
            </a-tag>
            <a-tag :color="'green'">
              {{ bypass.details }}
            </a-tag>
            <a-tag :color="'green'">
              {{ bypass.type }}
            </a-tag>
            <a-tooltip color="blue" v-if="bypass.file">
              <template #title>
                {{ bypass.file.original_name }}
              </template>
              <a
                :href="$baseUrl + 'storage/' + bypass.file.path + bypass.file.name"
                target="_blank"
              >
                <PaperClipOutlined />
              </a>
            </a-tooltip>
          </span>
        </a-row>
      </template>
      <template v-if="column.dataIndex === 'users'">
        <span v-if="record.users">
          <a-tag :color="'green'">
            <UserAvatarView :UserDataRef="record.users" :showNameRef="true" />
          </a-tag>
        </span>
      </template>
      <template v-if="column.dataIndex === 'created_at' || column.dataIndex === 'updated_at'">
        <span>
          <a-popover>
            <template #content>
              <p>{{ text }}</p>
            </template>
            {{ dateFromNow(text) }}
          </a-popover>
        </span>
      </template>
      <template v-if="column.dataIndex === 'id'">
        <span>
          <a @click="detailes(record)">
            <eye-outlined :style="{ color: '#52c41a' }" /> {{ text }}
          </a>
        </span>
      </template>

      <template v-if="column.dataIndex === 'risk_category_id'">
        <span>
          <a-tag v-if="record.risk_category_id !== 1" :color="'#eb2f96'">
            {{ record.risk_category }}
          </a-tag>
          <a-tag v-else :color="'green'">
            {{ record.risk_category }}
          </a-tag>
        </span>
      </template>

      <template v-if="column.dataIndex === 'type'">
        <span>
          <a-tag :color="record.type === 'Risk Categorization' ? 'green' : 'geekblue'">
            {{ record.type }}
          </a-tag>
        </span>
      </template>

      <template v-else-if="column.dataIndex === 'aml'">
        <div class="demo-dropdown-wrap" v-if="record.aml == 1">
          <a-dropdown-button type="primary">
            Action
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <a-popconfirm title="Sure to bypass this record?" @confirm="onAMLBypass(record)">
                    <a-button type="primary" small>False-Positive</a-button>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="2">
                  <a-popconfirm title="Sure to bypass this record?" @confirm="detailesAML(record)">
                    <a-button type="primary" small>Accept Risk</a-button>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="3">
                  <a-popconfirm title="Sure to set high risk this record?" @confirm="onAML(record)">
                    <a-button type="danger" small>High Risk</a-button>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </div>
        <a-popconfirm
          title="Sure to unblock this record?"
          v-if="record.aml == 2"
          @confirm="onAMLUnblock(record)"
        >
          <close-circle-outlined :style="{ color: '#eb2f96' }" />
        </a-popconfirm>
        <a-popconfirm title="Sure to set high risk this record?" @confirm="onAML(record)">
          <check-outlined :style="{ color: '#52c41a' }" v-if="record.aml == 0" />
        </a-popconfirm>
      </template>
      <template v-else-if="column.dataIndex === 'black_list'">
        <div class="demo-dropdown-wrap" v-if="record.black_list == 1">
          <a-dropdown-button type="primary">
            Action
            <template #overlay>
              <a-menu>
                <a-menu-item key="2">
                  <a-popconfirm
                    title="Sure to bypass this record?"
                    @confirm="onBlackListBypass(record)"
                  >
                    <a-button type="primary" small>Accept Risk</a-button>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="3">
                  <a-popconfirm
                    title="Sure to set high risk this record?"
                    @confirm="onBlackList(record)"
                  >
                    <a-button type="danger" small>High Risk</a-button>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </div>
        <a-popconfirm
          title="Sure to unblock this record?"
          v-if="record.black_list == 2"
          @confirm="onBlackListLUnblock(record)"
        >
          <close-circle-outlined :style="{ color: '#eb2f96' }" />
        </a-popconfirm>
        <a-popconfirm title="Sure to set high risk this record?" @confirm="onBlackList(record)">
          <check-outlined :style="{ color: '#52c41a' }" v-if="record.black_list == 0" />
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="visible"
    :title="
      detailesData.id +
      ' - ' +
      detailesData.employee_number +
      ' - ' +
      detailesData.surname +
      ', ' +
      detailesData.client_first_names
    "
    :footer="null"
    width="1000px"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="2">
        <template #tab>
          <span>
            <file-search-outlined />
            Details
          </span>
        </template>
        <tabDetails :detailesData="detailesData" />
      </a-tab-pane>
      <a-tab-pane key="1" force-render>
        <template #tab>
          <span>
            <code-sandbox-outlined />
            Box
          </span>
        </template>
        <tabBox
          :tabBoxRef="{
            NUIT: detailesData.employee_number,
            Date_Of_Birth: detailesData.date_of_birth
          }"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
  <a-modal
    v-model:open="visibleAMl"
    :title="
      detailesData.id +
      ' - ' +
      detailesData.employee_number +
      ' - ' +
      detailesData.surname +
      ', ' +
      detailesData.client_first_names
    "
    :footer="null"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @finish="onFinish">
      <a-form-item label="Description" name="description">
        <a-textarea
          v-model:value="form.description"
          :rows="4"
          placeholder="Please enter description"
        />
      </a-form-item>
      <a-form-item name="fileList" label="Upload" extra="Support document">
        <a-upload
          v-model:file-list="form.fileList"
          list-type="picture"
          :max-count="1"
          :action="$baseUrlAPI + '/v1/upload'"
          method="post"
          :data="{ my_token: detailesData.employee_number }"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Upload (Max: 1)
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item>
        <a-button type="danger" html-type="submit">Accept Risk</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, ref, watch, onMounted } from 'vue'
import {
  CheckOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  CodeSandboxOutlined,
  FileSearchOutlined,
  PaperClipOutlined
} from '@ant-design/icons-vue'
import eventBus from '@/Helpers/event-bus'
import tabDetails from './tabDetails.vue'
import tabBox from '../../../Services/Box/tabBox.vue'
import axios from 'axios'
import moment from 'moment'
import UserAvatarView from '@/components/Helpers/UserAvatarView.vue'
const getRandomuserParams = (params) => ({
  perPage: params.pageSize,
  page: params.current,
  ...params
})
export default defineComponent({
  components: {
    PaperClipOutlined,
    CheckOutlined,
    EyeOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    tabDetails,
    CodeSandboxOutlined,
    tabBox,
    FileSearchOutlined,
    UserAvatarView
  },
  created: function () {
    this.moment = moment
  },
  setup() {
    const pagination = ref({
      current: 1,
      pageSize: 50
    })

    const fetch = (params = {}) => {
      loading.value = true
      let u = new URLSearchParams(getRandomuserParams(params)).toString()

      axios
        .get('/v1/screening-table-data?' + u)
        .catch((error) => console.error('Error:', error))
        .then((response) => {
          //console.log('Success:', response);
          loading.value = false
          tableData.value = response.data.data
          //console.log()
          pagination.value = {
            ...params,
            total: response.data.total,
            showTotal: (total) => `${response.data.from}-${response.data.to} of ${total} items` // 200 is mock data, you should read it from server
            // total: data.totalCount,
          }
          //console.log(pagination.value)
        })
    }
    const handleTableChange = (pag, filters, sorter) => {
      fetch({
        perPage: pag.pageSize,
        page: pag?.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    }

    watch(
      () => ({ ...pagination.value }),
      (cur, pre) => {
        if (cur.current !== pre.current || cur.pageSize !== pre.pageSize) {
          fetch(pagination.value)
        }
      }
    )
    onMounted(() => {
      fetch(pagination.value)
    })

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 150,
        sorter: (a, b) => a.id.length - b.id.length,
        sortDirections: ['descend', 'ascend']
      },

      {
        title: 'Created',
        dataIndex: 'created_at',
        width: 150,
        sorter: (a, b) => a.Time_Sort - b.Time_Sort,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Last Update',
        dataIndex: 'updated_at',
        width: 150,
        sorter: (a, b) => a.Time_Sort - b.Time_Sort,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Type',
        dataIndex: 'type',
        width: 220,
        sorter: (a, b) => a.type - b.type,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Last Name',
        dataIndex: 'surname',
        width: 150,
        sorter: (a, b) => a.surname - b.surname,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'First Names',
        dataIndex: 'client_first_names',
        width: 150,
        sorter: (a, b) => a.client_first_names - b.client_first_names,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Date of Birth',
        dataIndex: 'date_of_birth',
        width: 100
      },
      {
        title: 'Employer Number',
        dataIndex: 'employee_number',
        width: 100
      },
      {
        title: 'Employer ID',
        dataIndex: 'employer_id',
        width: 100
      },
      {
        title: 'Passport',
        dataIndex: 'passport_number',
        width: 250
      },
      {
        title: 'Client ID',
        dataIndex: 'client_id',
        width: 100
      },
      {
        title: 'Risk',
        dataIndex: 'risk_category_id',
        sorter: (a, b) => a.risk_category_id - b.risk_category_id,
        sortDirections: ['descend', 'ascend'],
        width: 120,
        filters: [
          {
            text: 'Low',
            value: '1'
          },
          {
            text: 'Medium',
            value: '2'
          },
          {
            text: 'High',
            value: '3'
          }
        ],
        onFilter: (value, record) => {
          if (record.risk_category_id) {
            return record.risk_category_id.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'Risk Mesg',
        dataIndex: 'risk_category_mesg',
        width: 100
      },

      {
        title: 'Bypass',
        dataIndex: 'bypass',
        width: 250
      },
      {
        title: 'AML',
        dataIndex: 'aml',
        sorter: (a, b) => a.aml - b.aml,
        sortDirections: ['descend', 'ascend'],
        width: 170,
        filters: [
          {
            text: 'AML',
            value: '1'
          },
          {
            text: 'High Risk',
            value: '2'
          }
        ],
        onFilter: (value, record) => {
          if (record.aml) {
            return record.aml.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'Black List',
        dataIndex: 'black_list',
        sorter: (a, b) => a.black_list - b.black_list,
        sortDirections: ['descend', 'ascend'],
        width: 170,
        filters: [
          {
            text: 'Black List',
            value: '1'
          },
          {
            text: 'High Risk',
            value: '2'
          }
        ],
        onFilter: (value, record) => {
          if (record.black_list) {
            return record.black_list.toString().indexOf(value) === 0
          }
        }
      },

      {
        title: 'User',
        dataIndex: 'users',
        width: 250
      }
    ]

    const formRef = ref()
    const searchValue = ref('')
    const tabDetailsRef = ref()
    const form = reactive({
      description: '',
      fileList: [],
      loanData: []
    })
    const resetForm = () => {
      formRef.value.resetFields()
    }
    const rules = {
      description: [
        {
          required: true,
          message: 'Please enter description'
        }
      ],
      fileList: [
        {
          required: true,
          message: 'Please select file'
        }
      ]
    }

    const onFinish = () => {
      send(form)
    }
    const dataSource = ref([])
    const loading = ref(true)
    const visible = ref(false)
    const visibleAMl = ref(false)
    const detailesData = ref([])

    const detailes = (data) => {
      visible.value = true
      detailesData.value = data
    }
    const detailesAML = (data) => {
      visibleAMl.value = true
      detailesData.value = data
      form.loanData = data
    }
    function send(values) {
      axios.post('v1/screening-aml-submit-doc', values).then((response) => {
        response
        ;(visibleAMl.value = false),
          formRef.value.resetFields(),
          eventBus.$emit('table-list-Changed')
      })
    }

    const onAMLBypass = (data) => {
      axios.post('v1/screening-aml-bypass', data).then((response) => {
        response
        eventBus.$emit('table-list-Changed')
      })
    }
    const onBlackListBypass = (data) => {
      axios.post('v1/screening-black-list-bypass', data).then((response) => {
        response
        eventBus.$emit('table-list-Changed')
      })
    }

    const onBlackList = (data) => {
      axios.post('v1/screening-black-list', data).then((response) => {
        response
        eventBus.$emit('table-list-Changed')
      })
    }
    const onAML = (data) => {
      axios.post('v1/screening-aml', data).then((response) => {
        response
        eventBus.$emit('table-list-Changed')
      })
    }
    const onAMLUnblock = (data) => {
      axios.post('v1/screening-aml-unblock', data).then((response) => {
        response
        eventBus.$emit('table-list-Changed')
      })
    }
    const onBlackListLUnblock = (data) => {
      axios.post('v1/screening-black-list-unblock', data).then((response) => {
        response
        eventBus.$emit('table-list-Changed')
      })
    }
    const tableData = ref([])

    const onSearch = () => {
      let filter = searchValue.value
      if (!filter.length) return fetch(pagination.value)
      loading.value = true
      axios.get('v1/screening-table-data/search/' + filter).then((response) => {
        tableData.value = response.data
        loading.value = false
      })
    }
    const dateFromNow = (date) => {
      return moment(moment(new Date(date), 'DD-MM-YYYY HH:mm:ss')).fromNow()
    }
    eventBus.$on('table-list-Changed', () => {
      fetch(pagination.value)
    })

    return {
      pagination,
      tableData,
      searchValue,
      dataSource,
      onSearch,
      columns: ref(columns),
      loading,
      visible,
      detailes,
      detailesData,
      onAMLBypass,
      onBlackListBypass,
      onBlackList,
      onAML,
      onAMLUnblock,
      onBlackListLUnblock,
      visibleAMl,
      detailesAML,
      form,
      formRef,
      rules,
      onFinish,
      resetForm,
      dateFromNow,
      activeKey: ref('1'),
      tabDetailsRef,
      handleTableChange
    }
  }
})
</script>
