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
    :loading="loading"
    :scroll="{ x: 1500, y: 600 }"
    @change="onChange"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'Created_On'">
        <span>
          <a-popover>
            <template #content>
              <p>{{ text }}</p>
            </template>
            {{ dateFromNow(text) }}
          </a-popover>
        </span>
      </template>
      <template v-if="column.dataIndex === 'Application_ID'">
        <span>
          <a @click="detailes(record)">
            <eye-outlined :style="{ color: '#52c41a' }" /> {{ text }}
          </a>
        </span>
      </template>
      <template v-if="column.dataIndex === 'employer_type'">
        <span>
          <a-tag :color="record.employer_type === 'VG' ? 'geekblue' : 'green'">
            {{ record.employer_type }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.dataIndex === 'Reference'">
        <span>
          <a-tag
            v-if="
              record.Reference === 'Missing Reference' || record.Reference === 'Check Reference'
            "
            :color="'#eb2f96'"
          >
            {{ record.Reference }}
          </a-tag>
          <a-tag v-else :color="'green'">
            {{ record.Reference }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.dataIndex === 'ready'">
        <span>
          <check-outlined :style="{ color: '#52c41a' }" v-if="record.ready == 1" />
          <close-outlined :style="{ color: '#eb2f96' }" v-else />
        </span>
      </template>
      <template v-if="column.dataIndex === 'ready_approval'">
        <LoadingOutlined :style="{ color: '#52c41a' }" v-if="record.ready_approval == 3" />
        <span v-if="record.ready_approval == 1 || record.ready_approval == 2">
          <a-popover title="Reason">
            <template #content>
              <p><b>Estado: </b>{{ record.estado }}</p>
              <p><b>Motivo: </b>{{ record.motivo }}</p>
              <p><b>Data: </b>{{ record.data_carregamento }}</p>
              <p><b>Pedido: </b>{{ record.pedido }}</p>
            </template>
            <check-circle-outlined
              :style="{ color: '#52c41a' }"
              v-if="record.ready_approval == 1"
            />
            <close-circle-outlined
              :style="{ color: '#eb2f96' }"
              v-if="record.ready_approval == 2"
            />
          </a-popover>
        </span>
        <close-outlined
          :style="{ color: '#eb2f96' }"
          v-if="
            record.ready_approval == 0 ||
            record.ready_approval == null ||
            record.ready_approval == ''
          "
        />
      </template>
      <template v-else-if="column.dataIndex === 'affordability'">
        <span v-if="record.affordability !== null">
          <a-tooltip placement="top" :title="record.affordability">
            <alert-outlined
              :style="{ color: '#eb2f96' }"
              v-if="record.affordability == 'Impossible to verify'"
            />
            <flag-outlined
              :style="{ color: '#52c41a' }"
              v-else-if="record.affordability == 'Good for business'"
            />
            <caret-down-outlined
              :style="{ color: '#eb2f96' }"
              v-else-if="record.affordability == 'Below the maximum capacity'"
            />
            <span v-if="record.affordability != 'Impossible to verify'">
              <a-divider type="vertical" />
              {{ new Intl.NumberFormat().format(record.affordability_percent) }}%
            </span>
          </a-tooltip>
        </span>
        <LoadingOutlined :style="{ color: '#eb2f96' }" v-else />
      </template>
      <template v-else-if="column.dataIndex === 'check_telephone'">
        <check-outlined :style="{ color: '#52c41a' }" v-if="record.check_telephone == 1" />
        <span v-else>
          <a-popover title="Phones">
            <template #content>
              <p v-for="(telephone, index) in record.telephones" :key="index">
                <b>Name: </b>{{ telephone.name }}, {{ telephone.table }}, {{ telephone.phone }}
              </p>
            </template>
            <div class="demo-dropdown-wrap" v-if="record.check_telephone == 0">
              <a-dropdown-button type="primary">
                Action
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1">
                      <a-popconfirm
                        title="Sure to bypass this record?"
                        @confirm="onTelephoneBypass(record)"
                      >
                        <a-button type="primary" small>Accept Risk</a-button>
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="2">
                      <a-popconfirm
                        title="Sure to set high risk this record?"
                        @confirm="onTelephone(record)"
                      >
                        <a-button type="danger" small>High Risk</a-button>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown-button>
            </div>
            <close-circle-outlined
              :style="{ color: '#eb2f96' }"
              v-if="record.check_telephone == 2"
            />
            <LoadingOutlined :style="{ color: '#eb2f96' }" v-if="record.check_telephone == null" />
          </a-popover>
        </span>
      </template>
      <template v-else-if="column.dataIndex === 'Is_OTP_Validated'">
        <check-outlined :style="{ color: '#52c41a' }" v-if="record.Is_OTP_Validated == 1" />
        <span v-else>
          <a-popconfirm title="Sure to bypass this record?" @confirm="onOTPBypass(record)">
            <a-button type="primary" small>Accept OTP</a-button>
          </a-popconfirm>
        </span> </template
      ><template v-else-if="column.dataIndex === 'cdr'">
        <a-popconfirm
          title="Sure to set not accept this record?"
          v-if="record.cdr == 1"
          @confirm="onCdr(record, 'wh-pending-approval/cdr')"
        >
          <check-outlined :style="{ color: '#52c41a' }" />
        </a-popconfirm>
        <a-popconfirm
          title="Sure to unblock this record?"
          v-else-if="record.cdr == 2"
          @confirm="onCdr(record, 'wh-pending-approval/cdr-unblock')"
        >
          <close-circle-outlined :style="{ color: '#eb2f96' }" />
        </a-popconfirm>
        <div class="demo-dropdown-wrap" v-else>
          <a-dropdown-button type="primary">
            Action
            <template #overlay>
              <a-menu>
                <a-menu-item key="2">
                  <a-popconfirm
                    title="Sure to bypass this record?"
                    @confirm="onCdr(record, 'wh-pending-approval/cdr-bypass')"
                  >
                    <a-button type="primary" small>Accept</a-button>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="3">
                  <a-popconfirm
                    title="Sure to set not accept this record?"
                    @confirm="onCdr(record, 'wh-pending-approval/cdr')"
                  >
                    <a-button type="danger" small>Not Accept</a-button>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'verificacao_nib'">
        <a-popover v-if="record.verificacao_nib == '1'">
          <template #content>
            <p>{{ record.verificacao_msg }}</p>
          </template>
          <check-outlined :style="{ color: '#52c41a' }" />
        </a-popover>
        <span v-else>
          <a-popconfirm
            :title="'Sure to bypass this record. (' + record.verificacao_msg + ')?'"
            @confirm="onQaBypass(record)"
          >
            <a-button type="primary" small>Accept NIB</a-button>
          </a-popconfirm>
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
        <check-outlined :style="{ color: '#52c41a' }" v-if="record.aml == 0" />
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
        <check-outlined :style="{ color: '#52c41a' }" v-if="record.black_list == 0" />
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="visible"
    :title="
      detailesData.Application_ID +
      ' - ' +
      detailesData.NUIT +
      ' - ' +
      detailesData.Surname +
      ', ' +
      detailesData.First_Name
    "
    :footer="null"
    width="1000px"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <file-search-outlined />
            Details
          </span>
        </template>
        <tabDetails :detailesData="detailesData" />
      </a-tab-pane>
      <a-tab-pane key="2" force-render>
        <template #tab>
          <span>
            <code-sandbox-outlined />
            Box
          </span>
        </template>
        <tabBox :tabBoxRef="detailesData" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
  <a-modal
    v-model:visible="visibleAMl"
    :title="
      detailesData.Application_ID +
      ' - ' +
      detailesData.NUIT +
      ' - ' +
      detailesData.Surname +
      ', ' +
      detailesData.First_Name
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
          :headers="headers"
          :data="{ my_token: detailesData.Application_ID, _token: headers['X-CSRF-TOKEN'] }"
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
import { defineComponent, reactive, ref } from 'vue'
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  FlagOutlined,
  CaretDownOutlined,
  AlertOutlined,
  FileSearchOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import eventBus from '../../../Helpers/event-bus'
import tabDetails from './tabDetails.vue'
import tabBox from '../../Services/Box/tabBox.vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
export default defineComponent({
  components: {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    LoadingOutlined,
    CheckCircleOutlined,
    FlagOutlined,
    CaretDownOutlined,
    AlertOutlined,
    tabDetails,
    FileSearchOutlined,
    CodeSandboxOutlined,
    tabBox
  },
  created: function () {
    this.moment = moment
  },
  setup() {
    const onChange = () => {
      //console.log('params', pagination, filters, sorter);
    }
    const columns = [
      {
        title: 'Application ID',
        dataIndex: 'Application_ID',
        fixed: 'left',
        width: 150,
        sorter: (a, b) => a.Application_ID.length - b.Application_ID.length,
        sortDirections: ['descend', 'ascend']
      },

      {
        title: 'Created',
        dataIndex: 'Created_On',
        width: 150,
        sorter: (a, b) => a.Time_Sort - b.Time_Sort,
        sortDirections: ['descend', 'ascend']
      },

      {
        title: 'Employer type',
        dataIndex: 'employer_type',
        width: 100
      },
      {
        title: 'Ready Lock',
        dataIndex: 'ready',
        sorter: (a, b) => a.ready - b.ready,
        sortDirections: ['descend', 'ascend'],
        width: 100
      },
      {
        title: 'Ready Approval',
        dataIndex: 'ready_approval',
        sorter: (a, b) => a.ready_approval - b.ready_approval,
        sortDirections: ['descend', 'ascend'],
        width: 120,
        filters: [
          {
            text: 'Loocked',
            value: '1'
          },
          {
            text: 'Failed',
            value: '2'
          },
          {
            text: 'Processing',
            value: '3'
          }
        ],
        onFilter: (value, record) => {
          if (record.ready_approval) {
            return record.ready_approval.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'Affordability',
        dataIndex: 'affordability',
        sorter: (a, b) => a.affordability - b.affordability,
        sortDirections: ['descend', 'ascend'],
        width: 150,
        filters: [
          {
            text: 'Impossible to verify',
            value: 'Impossible to verify'
          },
          {
            text: 'Below the maximum capacity',
            value: 'Below the maximum capacity'
          },
          {
            text: 'Good for business',
            value: 'Good for business'
          }
        ],
        onFilter: (value, record) => {
          if (record.affordability) {
            return record.affordability.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'Telephone',
        dataIndex: 'check_telephone',
        sorter: (a, b) => a.check_telephone - b.check_telephone,
        sortDirections: ['descend', 'ascend'],
        width: 150,
        filters: [
          {
            text: 'True',
            value: 1
          },
          {
            text: 'False',
            value: 0
          },

          {
            text: 'High Risk',
            value: 2
          }
        ],
        onFilter: (value, record) => {
          if (
            record.check_telephone == 0 ||
            record.check_telephone == 1 ||
            record.check_telephone == 2
          ) {
            return record.check_telephone.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'CDR',
        dataIndex: 'cdr',
        sorter: (a, b) => a.cdr - b.cdr,
        sortDirections: ['descend', 'ascend'],
        width: 150,
        filters: [
          {
            text: 'Accept',
            value: 1
          },
          {
            text: 'Not Accept',
            value: 2
          }
        ],
        onFilter: (value, record) => {
          if (record.cdr == 0 || record.cdr == 1 || record.cdr == 2) {
            return record.cdr.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'OTP',
        dataIndex: 'Is_OTP_Validated',
        sorter: (a, b) => a.Is_OTP_Validated - b.Is_OTP_Validated,
        sortDirections: ['descend', 'ascend'],
        width: 150,
        filters: [
          {
            text: 'True',
            value: 1
          },
          {
            text: 'False',
            value: 0
          }
        ],
        onFilter: (value, record) => {
          if (record.Is_OTP_Validated == 1 || record.Is_OTP_Validated == 0) {
            return record.Is_OTP_Validated.toString().indexOf(value) === 0
          }
        }
      },
      {
        title: 'QA',
        dataIndex: 'verificacao_nib',
        sorter: (a, b) => a.verificacao_nib - b.verificacao_nib,
        sortDirections: ['descend', 'ascend'],
        width: 150
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
        title: 'Reference',
        dataIndex: 'Reference',
        width: 150,
        filters: [
          {
            text: 'Missing Reference',
            value: 'Missing Reference'
          },
          {
            text: 'Check Reference',
            value: 'Check Reference'
          }
        ],
        onFilter: (value, record) => {
          if (record.Reference) {
            return record.Reference.indexOf(value) === 0
          }
        }
      },
      {
        title: 'Bank Account Number',
        dataIndex: 'Bank_Account_Number',
        width: 200
      },
      {
        title: 'Employer Vote Number',
        dataIndex: 'Employer_Vote_Number',
        width: 150
      },
      {
        title: 'Surname',
        dataIndex: 'Surname',
        width: 150,
        sorter: (a, b) => a.Surname - b.Surname,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'First Name',
        dataIndex: 'First_Name',
        width: 150,
        sorter: (a, b) => a.First_Name - b.First_Name,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'ID Number',
        dataIndex: 'ID_Number',
        width: 150
      }
    ]
    const token = Cookies.get('token' + process.env.VUE_APP_PORT)
    const headers = {
      Authorization: `Bearer ${token}`
    }
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
    const loading = ref(false)
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
      axios
        .post('v1/wh-pending-approval/aml-submit-doc', values)
        .then((response) => {
          message.success({
            content: () =>
              response.data.message + ' The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          }),
            (visibleAMl.value = false),
            formRef.value.resetFields(),
            eventBus.$emit('table-list-Changed')
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onQaBypass = (data) => {
      axios
        .post('v1/wh-pending-approval/qa-bypass', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }

    const onCdr = (data, url) => {
      axios
        .post('v1/' + url, data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onOTPBypass = (data) => {
      axios
        .post('v1/wh-pending-approval/otp-bypass', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }

    const onAMLBypass = (data) => {
      axios
        .post('v1/wh-pending-approval/aml-bypass', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onBlackListBypass = (data) => {
      axios
        .post('v1/wh-pending-approval/black-list-bypass', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }

    const onTelephone = (data) => {
      axios
        .post('v1/wh-pending-approval/telephone', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onTelephoneBypass = (data) => {
      axios
        .post('v1/wh-pending-approval/telephone-bypass', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onBlackList = (data) => {
      axios
        .post('v1/wh-pending-approval/black-list', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onAML = (data) => {
      axios
        .post('v1/wh-pending-approval/aml', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onAMLUnblock = (data) => {
      axios
        .post('v1/wh-pending-approval/aml-unblock', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const onBlackListLUnblock = (data) => {
      axios
        .post('v1/wh-pending-approval/black-list-unblock', data)
        .then(
          eventBus.$emit('table-list-Changed'),
          message.success({
            content: () => 'The change will be reflected in the next update.',
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 10
          })
        )
        .catch((error) => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  message.error({
                    content: () => error,
                    class: 'custom-class',
                    style: {
                      marginTop: '10vh'
                    },
                    duration: 10
                  })
                })
              }

              if (error.response.data.error) {
                message.error({
                  content: () => error.response.data.error,
                  class: 'custom-class',
                  style: {
                    marginTop: '10vh'
                  },
                  duration: 10
                })
              }
            }
          } else {
            message.error({
              content: () => error.message,
              class: 'custom-class',
              style: {
                marginTop: '10vh'
              },
              duration: 10
            })
          }
        })
    }
    const tableData = ref([])
    const onSearch = () => {
      let filter = searchValue.value
      if (!filter.length) return (tableData.value = dataSource.value)
      loading.value = true
      axios.get('v1/wh-pending-approval/search/' + filter).then((response) => {
        tableData.value = response.data
        loading.value = false
      })
    }
    const dateFromNow = (date) => {
      return moment(moment(new Date(date), 'DD-MM-YYYY HH:mm:ss')).fromNow()
    }

    return {
      tableData,
      searchValue,
      dataSource,
      onSearch,
      columns: ref(columns),
      loading,
      visible,
      detailes,
      detailesData,
      onQaBypass,
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
      headers,
      onChange,
      onOTPBypass,
      onTelephoneBypass,
      onTelephone,
      dateFromNow,
      onCdr,
      activeKey: ref('1'),
      tabDetailsRef
    }
  }
})
</script>
