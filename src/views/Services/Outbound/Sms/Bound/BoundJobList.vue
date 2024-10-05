<template>
    <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
        <a-card :title="$t('search')" style="width: 100%">
            <a-input-search v-model:value="value" placeholder="Serach here.." :loading="loading"
                enter-button />
        </a-card>
    </div>
    <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
        :loading="loading" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'upload'">
                <a-tag color="#2db7f5">{{ record.upload.file_name }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'team'">
                <a-tag color="#2db7f5">{{ record.team.name }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'status'">
                <a-tag color="#2db7f5">{{ record.dictionary.name }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'updatedAt'">
                    {{ dataTimeFormat(record.updatedAt) }}
            </template>
            <template v-if="column.dataIndex === 'user'">
                <UserAvatar :UserDataRef="record.user" :showNameRef="false"/>
            </template>
            <template v-if="column.dataIndex === 'approval'">
                <UserAvatar :UserDataRef="record.approval_name" :showNameRef="true"  v-if="record.approval_name"/>
            </template>
            <template v-else-if="column.dataIndex === 'process'">
                    <span>
                        <a-tooltip>
                            <template #title>Runed</template>
                            <a-progress type="circle" :percent="record.jobRunedPerc" :size="42" />
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Failed</template>
                            <a-progress type="circle" :percent="record.jobFailedPerc" :size="42" status="exception" />
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Success</template>
                            <a-progress type="circle" :percent="record.jobSuccessPerc" :size="42"  status="active"/>
                        </a-tooltip>
                    </span>
                </template>
            <template v-else-if="column.dataIndex === 'action'" >
                <span >
                    
                    <a-button   @click="onViewList(record)" :style="{ marginRight: '10px' }">
                        <template #icon>
                            <OrderedListOutlined />
                        </template>
                    </a-button>
                    
                    <a-popconfirm title="Sure to Export?"  @confirm="onExport(record.uuid)">
                        <download-outlined />
                    </a-popconfirm>
                    <a-divider type="vertical" />
                    <a-popconfirm title="Sure to Unblock?" v-if="record.status == 1" @confirm="onDelete(record.id)">
                        <send-outlined />
                    </a-popconfirm>
                    <a-popconfirm title="Sure to Block?" v-if="record.status == 0 || record.status == 2 " @confirm="onDelete(record.id)">
                        <stop-outlined />
                    </a-popconfirm>
                </span>
            </template>
        </template>
    </a-table>
    <BoundNew ref="userNew"/>
    <BoundEdit ref="BoundEdit"/>
    <BoundJobViewReportList ref="onViewListData"/>
</template>
<script>
import { defineComponent, onMounted, ref, watch, reactive } from 'vue';
import { DownloadOutlined, SendOutlined, StopOutlined, OrderedListOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import BoundNew from './BoundNew.vue';
import BoundEdit from './BoundEdit.vue';
import BoundJobViewReportList from "./BoundJobViewReportList.vue";
import eventBus from '@/Helpers/event-bus'
import { debounce } from 'lodash-es'
import UserAvatar from "@/components/Helpers/UserAvatarView.vue";
import { useRoute } from 'vue-router'
const getRandomuserParams = params => ({
  perPage: params.pageSize,
  page: params.current,
  ...params,
});

export default defineComponent({
  components:{
        BoundNew, 
        BoundEdit,  
        UserAvatar,
        DownloadOutlined,
        SendOutlined, 
        StopOutlined,
        OrderedListOutlined,
        BoundJobViewReportList
  }, 
  setup() {
    const state = reactive({
            data: [],
            fetching: false,

        });
    const dataSource = ref([]);
    const userNew = ref()
    const BoundEdit = ref()
    const userLogsVue = ref()
    const userRole = ref()
    const bound_uuid = ref('');
    const route = useRoute()
    const uuid = route.params.uuid
    const pagination = ref({
      current: 1,
      pageSize: 10,
    });
    const loading = ref(true);
    const onViewListData = ref()
    const showNewUser = ()=>{
        userNew.value.visible = true
    }
    const onLogs = (record) =>{
        userLogsVue.value.url = '/v1/users/logs/' + record.id
        userLogsVue.value.name = record.name
        userLogsVue.value.visible = true
    }
      const onRole = (record) => {
          userRole.value.name = record.name
          userRole.value.user_id = record.id
          userRole.value.visible = true
      }
    const fetch = (params = {}) => {
      loading.value = true;
      let u = new URLSearchParams(getRandomuserParams(params)).toString();
        
        axios.get(`/v1/smsboundjob-parm/${uuid}?${u}`)
        .catch(error => console.error('Error:', error))
        .then(response => {
          //console.log('Success:', response);
          loading.value = false;
          dataSource.value = response.data.data;
          pagination.value = {
            ...params,
              total: response.data.meta.total,
              showTotal: (total) => `${response.data.meta.from}-${response.data.meta.to} of ${total} items` // 200 is mock data, you should read it from server
            // total: data.totalCount,
          };
        });
        };
    const handleTableChange = (pag, filters, sorter) => {
        fetch({
            perPage: pag.pageSize,
            page: pag?.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };
    const onDelete = (id) => {
        axios.get('/v1/smsboundjob/status-change/' + id)
            .then(function (){
                fetch(pagination.value)
                })
    };

    const onExport = (uuid) => {
        axios.get('/v1/smsboundjob/export/' + uuid)
    }

    const value = ref();

    watch(
      () => ({ ...pagination.value }),
      (cur, pre) => {
        if (cur.current !== pre.current || cur.pageSize !== pre.pageSize) {
          fetch(pagination.value);
        }
      },
    );
    watch(value, () => {
            dataSource.value = '';
            fetchData(value.value)
        });
    const fetchData = debounce(value => {
        const params = {
                perPage: 20,
                page: 1,
                sortField: undefined,
                sortOrder: undefined,
                likeNotes: '%' + value + '%',
            }
        if (value)
            fetch(params)
    }, 500);
    
    
    const onViewList = (data) => {
        onViewListData.value.visible = true
        onViewListData.value.data = data
    }


        eventBus.$on("New-Bound-Changed", () => {
            fetch(pagination.value);
        });
        onMounted(() => {
        fetch(pagination.value);
        });

      const onEdit = (record) => {
        BoundEdit.value.form.name = record.name,
        BoundEdit.value.form.lname = record.lname,
        BoundEdit.value.form.email = record.email,
        BoundEdit.value.form.branch = record.branch_name.id_agencia
        BoundEdit.value.form.referral = record.referral,
        BoundEdit.value.form.phone = record.phone
        BoundEdit.value.form.username = record.username,
        BoundEdit.value.form.title = record.title,
        BoundEdit.value.form.notes = record.notes
        BoundEdit.value.form.logins = record.logins
        BoundEdit.value.id = record.id;
        BoundEdit.value.visible = true;

      };
      const dataTimeFormat = (d) => {
          var date = format(new Date(d), 'yyyy-MM-dd hh:mm:ss')
          if (date == "NaN-aN-aN") {
              date = "1900-01-01 00:00:00"
          }
          return date;
      };
      function format(x, y) {
          var z = {
              M: x.getMonth() + 1,
              d: x.getDate(),
              h: x.getHours(),
              m: x.getMinutes(),
              s: x.getSeconds()
          };
          y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
              return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
          });

          return y.replace(/(y+)/g, function (v) {
              return x.getFullYear().toString().slice(-v.length)
          });
      }
      
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                sorter: true,
            },
            {
                title: 'User',
                dataIndex: 'user',
                width: '5%',
                sorter: true,
            },
            {
                title: 'Notes',
                dataIndex: 'notes',
                width: '15%',
                sorter: true,
            },
            {
                title: 'Date time',
                dataIndex: 'dateTime',
                width: '10%',
                sorter: true,
            },
            {
                title: 'Team',
                dataIndex: 'team',
                sorter: true,
            },
            {
                title: 'Last Update',
                dataIndex: 'updatedAt',
                width: '10%',
                sorter: true,
            },
            {
                title: 'Approval',
                dataIndex: 'approval',
                width: '20%',
                sorter: true,
            },
            {
                title: 'Status',
                dataIndex: 'status',
                sorter: true,
            },
            {
                title: 'Process',
                dataIndex: 'process',
                width: '16%',
            },
            {
                title: 'Action',
                dataIndex: 'action',
                width: '12%',
            }];
    return {
        state,
        dataSource,
        columns: ref(columns),
        pagination,
        loading,
        handleTableChange,
        onDelete,
        userNew,
        showNewUser,
        dataTimeFormat,
        onEdit,
        BoundEdit,
        userLogsVue,
        onLogs,
        userRole,
        onRole,
        value,
        bound_uuid,
        onExport,
        onViewList,
        onViewListData

    };
  },
});
</script>