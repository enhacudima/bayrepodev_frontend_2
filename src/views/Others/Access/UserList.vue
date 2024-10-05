<template>
    <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
        <a-card title="Search" style="width: 100%">
            <a-input-search v-model:value="value" placeholder="Serach here.." :loading="loading"
                enter-button />
        </a-card>
    </div>
    <a-button type="primary" :style="{ marginBottom: '24px' }" @click="showNewUser()">New User</a-button><a-card>
        <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
            :loading="loading" @change="handleTableChange"  size="small">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">{{ text }} </template>
                <template v-if="column.dataIndex === 'branch'">
                    <a-tag color="#2db7f5">
                        <template #icon>
                        <environment-outlined />
                        </template>
                        {{ record.branch_name ? record.branch_name.outletSyncNameCorrected : '' }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'updatedAt'">
                        <ClockCircleOutlined />  - <timeago :datetime="record.updatedAt"/>
                </template>
                <template v-if="column.dataIndex === 'avatar'">
                    <UserAvatar :UserDataRef="record" :avatarShapeRef="'square'" :showDotRef="true"/>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <span>
                        <a-tooltip>
                            <template #title>Logs</template>
                            <compass-outlined   @click="onLogs(record)"/>
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Edit</template>
                            <edit-outlined @click="onEdit(record)" :style="{ color: 'hotpink' }"/>
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Roles</template>
                            <apartment-outlined  @click="onRole(record)" />
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Notifications</template>
                            <bell-outlined @click="onNotification(record)"/>
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Reset password</template>
                            <a-popconfirm title="Sure to reset password?" @confirm="onPassword(record.id)">
                                <lock-outlined :style="{ color: 'hotpink' }"/>
                            </a-popconfirm>
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>API Token Management</template>
                            <user-switch-outlined @click="onAPI(record)" :style="{ color: 'hotpink' }" />
                        </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Change user status</template>
                            <a-popconfirm title="Sure to Unblock user?" v-if="record.status == 0 || record.status == 2" @confirm="onDelete(record.id)" key="unBlock">
                                <SafetyCertificateOutlined  :style="{ color: '#52c41a' }"/>
                            </a-popconfirm>
                            <a-popconfirm title="Sure to Block user?" v-if="record.status == 1" @confirm="onDelete(record.id)">
                                <FireOutlined  :style="{ color: 'hotpink' }" keys="block" />
                            </a-popconfirm>
                        </a-tooltip>
                        
                    </span>
                </template>
            </template>
        </a-table>
    </a-card>
    <UserNewVue ref="userNew"/>
    <UserEdit ref="userEdit"/>
    <UserLogsVue ref="userLogsVue"/>
    <UserRole ref="userRole"/>
    <UserNotification ref="UserNotificationRef"/>
    <UserAPI ref="userAPIRef"/>
</template>
<script>
import { defineComponent, onMounted, ref, watch,h, reactive } from 'vue';
import axios from 'axios';
import { Modal } from 'ant-design-vue';
import UserNewVue from './UserNew.vue';
import UserEdit from './UserEdit.vue';
import UserLogsVue from './UserLogs.vue';
import UserRole from './UserRole.vue'
import UserAPI from './UserAPI.vue'
import UserNotification from './UserNotification.vue'
import eventBus from '@/Helpers/event-bus'
import { debounce } from 'lodash-es'
import UserAvatar from "../../../components/Helpers/UserAvatarView.vue";
import { ClockCircleOutlined,EditOutlined, ApartmentOutlined, LockOutlined, CompassOutlined, BellOutlined, EnvironmentOutlined, SafetyCertificateOutlined, FireOutlined, UserSwitchOutlined } from '@ant-design/icons-vue';
const getRandomuserParams  = params => ({
  perPage: params.pageSize,
  page: params.current,
  ...params,
});

export default defineComponent({
  components:{
        UserNewVue, UserEdit, UserLogsVue, UserRole, UserAvatar, UserNotification, EditOutlined,
        ApartmentOutlined, CompassOutlined,LockOutlined, BellOutlined, EnvironmentOutlined, SafetyCertificateOutlined, FireOutlined, UserSwitchOutlined,
        UserAPI, ClockCircleOutlined
  }, 
  setup() {
    const state = reactive({
            data: [],
            fetching: false,

        });
    const userAPIRef = ref()   
    const dataSource = ref([]);
    const userNew = ref()
    const userEdit = ref()
    const userLogsVue = ref()
    const userRole = ref()
    const UserNotificationRef = ref()
    const pagination = ref({
      current: 1,
      pageSize: 10,
    });
    const paginationDefault = ref({
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
    const onNotification = (record) => {
            UserNotificationRef.value.name = record.name
            UserNotificationRef.value.user_id = record.id
            UserNotificationRef.value.visible = true
        }
    const onAPI = (record) => {
            userAPIRef.value.url = '/v1/oauth-personal-access-tokens/' + record.id
            userAPIRef.value.name = record.name
            userAPIRef.value.user_id = record.id
            userAPIRef.value.visible = true
        }    
    const fetch = (params = {}) => {
      loading.value = true;
      let u = new URLSearchParams(getRandomuserParams(params)).toString();
        
        axios.get('/v1/users?'+u)
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
        const onPassword = (id) => {
            axios.get('/v1/users/reset/'+id)
                .then(response => {
                    Modal.success({
                        title: response.data.user +"'s Password" ,
                        content: h('div', {}, [
                            h('p', response.data.password),
                        ]),
                    });
                })
        };
        const onDelete = (id) => {
            axios.get('/v1/users/status-change/' + id)
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
        if(value.value.length >= 2){
            dataSource.value = ''
            fetchData(value.value)
        }
        else 
            fetch(paginationDefault.value);   
        });
    const fetchData = debounce(value => {
        const params = {
                perPage: 20,
                page: 1,
                sortField: 'id',
                sortOrder: 'desc',
                likeName: '%' + value+'%',
                likeLname: '%' + value + '%',
            }
        if (value)
            fetch(params)
    }, 500);


        eventBus.$on("New-User-Changed", () => {
            fetch(pagination.value);
        });
        onMounted(() => {
        fetch(pagination.value);
        });

      const onEdit = (record) => {
        userEdit.value.form.name = record.name,
        userEdit.value.form.lname = record.lname,
        userEdit.value.form.email = record.email,
        userEdit.value.form.branch = record.branch_name.id_agencia
        userEdit.value.form.referral = record.referral,
        userEdit.value.form.phone = record.phone
        userEdit.value.form.username = record.username,
        userEdit.value.form.title = record.title,
        userEdit.value.form.notes = record.notes
        userEdit.value.form.logins = record.logins
        userEdit.value.form.expire = record.expire
        userEdit.value.id = record.id;
        userEdit.value.visible = true;

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
                width: '5%',
            },
            {
                title: 'Avatar',
                dataIndex: 'avatar',
                width: '8%',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: 'Last Name',
                dataIndex: 'lname',
                sorter: true,
            },
            /*{
                title: 'Title',
                dataIndex: 'title',
                sorter: true,
            },*/
            {
                title: 'Email',
                dataIndex: 'email',
                sorter: true,
                ellipsis: true,
            },
            {
                title: 'Branch',
                dataIndex: 'branch',
                width: '10%',
            },
            {
                title: 'Last Update',
                dataIndex: 'updatedAt',
                sorter: true,
            },
            {
                title: 'Actions',
                dataIndex: 'action',
                width: '20%',
            }];
    return {
        state,
        dataSource,
        columns: ref(columns),
        pagination,
        loading,
        handleTableChange,
        onPassword,
        onDelete,
        userNew,
        showNewUser,
        dataTimeFormat,
        onEdit,
        userEdit,
        userLogsVue,
        onLogs,
        userRole,
        onRole,
        value,
        UserNotificationRef,
        onNotification,
        onAPI,
        userAPIRef  
    };
  },
});
</script>