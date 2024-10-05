<template>
     <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
        <a-card title="Search" style="width: 100%">
            <a-input-search v-model:value="value" placeholder="Serach here.." :loading="loading"
                enter-button />
        </a-card>
    </div>
    <a-button type="primary" :style="{ marginBottom: '24px' }" @click="showNewRole()">New Role</a-button>
    <a-table :columns="columns"  :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
        :loading="loading" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'name'">{{ text }} </template>
            <template v-if="column.dataIndex === 'permissions'">
                <a-tag v-for="(item,index) in record.permissions" :key="index" color="purple">{{ item.name.replaceAll('_', ' ').toUpperCase() }} </a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
                <span>
                    <a @click="onEdit(record)">Edit</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="Sure to delete this role?" @confirm="onDelete(record.id)">
                        <a>Delete</a>
                    </a-popconfirm>
                </span>
           </template>
        </template>
</a-table>
    <NewRole ref="newRole"/>
    <EditRole ref="editRole"/>
</template>
<script>
import { defineComponent, onMounted, ref, watch, h } from 'vue';
import axios from 'axios';
import { Modal } from 'ant-design-vue';
import NewRole from "./NewRole.vue";
import eventBus from '@/Helpers/event-bus'
import EditRole from "./EditRole.vue";
import { debounce } from 'lodash-es'
const getRandomuserParams = params => ({
    perPage: params.pageSize,
    page: params.current,
    ...params,
});

export default defineComponent({
    components:{
        NewRole,
        EditRole
    },
    setup() {
        const value = ref();
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: '20%',
        }, {
            title: 'Guard',
            dataIndex: 'guard_name',
            sorter: true,
            filters: [{
                text: 'WEB',
                value: 'web',
            }, {
                text: 'API',
                value: 'api',
            }],
            width: '20%',
        }, {
            title: 'Permissions',
            dataIndex: 'permissions',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: false,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '10%',
        }];
        const dataSource = ref([]);
        const pagination = ref({
            current: 1,
            pageSize: 10,
        });
        const loading = ref(true);
        const newRole = ref();
        const editRole = ref();
        const showNewRole = () => {
            newRole.value.visible = true;
        };
        const fetch = (params = {}) => {
            loading.value = true;
            let u = new URLSearchParams(getRandomuserParams(params)).toString();

            axios.get('/v1/roles?' + u)
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
        const onEdit = (record) =>{
            editRole.value.formState.name = record.name,
            editRole.value.formState.description = record.description,
            editRole.value.formState.guard_name = record.guard_name,
            editRole.value.formState.permissions = transformPermissions(record.permissions)
            editRole.value.id = record.id;
            editRole.value.visible = true;

        };

        const transformPermissions = (permissions) =>{
            var t =[]
            permissions.forEach(el => {
                return t.push(el.id)
            });
            return t;
        }
        const onPassword = (id) => {
            axios.get('/v1/users/reset/' + id)
                .then(response => {
                    Modal.success({
                        title: response.data.user + "'s Password",
                        content: h('div', {}, [
                            h('p', response.data.password),
                        ]),
                    });
                })
        };
        const onDelete = (id) => {
            axios.delete('/v1/roles/' + id)
                .then(function () {
                    fetch(pagination.value)
                })
        };
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
                likeName: value + '%',
            }
            if (value)
                fetch(params)
        }, 500);
        
        onMounted(() => {
            eventBus.$on("New-Role-Changed", () => {
                fetch(pagination.value);
            });
            fetch(pagination.value);
        });
        return {
            dataSource,
            columns: ref(columns),
            pagination,
            loading,
            handleTableChange,
            onPassword,
            onDelete,
            newRole,
            showNewRole,
            onEdit,
            editRole,
            value,
        };
    },
});
</script>