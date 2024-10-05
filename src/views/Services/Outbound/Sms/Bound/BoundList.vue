<template>
    <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
        <a-card :title="$t('search')" style="width: 100%">
            <a-input-search v-model:value="value" placeholder="Serach here.." :loading="loading"
                enter-button />
        </a-card>
    </div>
    <a-button type="primary" :style="{ marginBottom: '24px' }" @click="showNewUser()">{{ $t('new')}}</a-button>
    <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
        :loading="loading" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'file_type'">
                <a-tag color="#2db7f5">{{ record.upload.type }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'template'">
                <a-tag color="#2db7f5">{{ record.template.name }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'upload'">
                <a-tag color="#2db7f5">{{ record.upload.file_name }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'columns_count'">
                <a-tag color="#2db7f5">{{ record.upload.columns_count }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'rows_count'">
                <a-tag color="#2db7f5">{{ record.upload.file_rows }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'team'">
                <a-tag color="#2db7f5">{{ record.team.name }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'updatedAt'">
                    {{ dataTimeFormat(record.updatedAt) }}
            </template>
            <template v-if="column.dataIndex === 'user'">
                <UserAvatar :UserDataRef="record.user" :showNameRef="true"/>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
                <span>
                    <router-link :to="'services-sms-bound-code/' + record.uuid">
                        <a><CompassOutlined/></a>
                    </router-link>
                    <a-divider type="vertical" />
                    <a-popconfirm title="Sure to Block?" v-if="record.status == 1" @confirm="onDelete(record.id)">
                        <a>Block</a>
                    </a-popconfirm>
                    <a-popconfirm title="Sure to UnBlock?" v-if="record.status == 0 || record.status == 2 " @confirm="onDelete(record.id)">
                        <a>UnBlock</a>
                    </a-popconfirm>
                </span>
            </template>
        </template>
    </a-table>
    <BoundNew ref="userNew"/>
    <BoundEdit ref="BoundEdit"/>
</template>
<script>
import { defineComponent, onMounted, ref, watch, reactive } from 'vue';
import axios from 'axios';
import BoundNew from './BoundNew.vue';
import BoundEdit from './BoundEdit.vue';
import eventBus from '@/Helpers/event-bus'
import { debounce } from 'lodash-es'
import UserAvatar from "@/components/Helpers/UserAvatarView.vue";
import { CompassOutlined } from '@ant-design/icons-vue';
const getRandomuserParams = params => ({
  perPage: params.pageSize,
  page: params.current,
  ...params,
});

export default defineComponent({
  components:{
        BoundNew, BoundEdit,  UserAvatar, CompassOutlined
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
    const pagination = ref({
      current: 1,
      pageSize: 10,
    });
    const loading = ref(true);
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
        
        axios.get('/v1/smsbound?'+u)
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
            axios.get('/v1/smsbound/status-change/' + id)
                .then(function (){
                    fetch(pagination.value)
                    })
        };
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
                likeName: value+'%',
                likeLname: value + '%',
                likeTitle: '%' + value + '%',
                likeEmail: '%' + value + '%',
                likeUsername: '%' + value + '%',
                likePhone: '%' + value + '%',
            }
        if (value)
            fetch(params)
    }, 500);


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
                width: '25%',
                sorter: true,
            },
            {
                title: 'Title',
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: 'Template',
                dataIndex: 'template',
                sorter: true,
            },
            {
                title: 'Uploud',
                dataIndex: 'upload',
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
                sorter: true,
            },
            {
                title: 'Upload Columns',
                dataIndex: 'columns_count',
                sorter: true,
            },
            {
                title: 'Upload Rows',
                dataIndex: 'rows_count',
                sorter: true,
            },
            {
                title: 'Upload Type',
                dataIndex: 'file_type',
                sorter: true,
            },
            {
                title: 'Action',
                dataIndex: 'action',
                width: '15%',
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
        value

    };
  },
});
</script>