<template>
    <a-button type="primary" :style="{ marginBottom: '24px' }" @click="showNewRole()">New Product</a-button>
    <a-table :columns="columns"  :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
        :loading="loading" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'name'">{{ text }} </template>
            <template v-if="column.dataIndex === 'permissions'">
                <a-tag v-for="(item,index) in record.permissions" :key="index" color="purple">{{ item.name.replaceAll('_', ' ').toUpperCase() }} </a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
                <span>
                    <a-popconfirm title="Sure to delete this products?" @confirm="onDelete(record.id)">
                        <a>Delete</a>
                    </a-popconfirm>
                </span>
           </template>
        </template>
</a-table>
    <NewProduct ref="newRole"/>
</template>
<script>
import { defineComponent, onMounted, ref, watch} from 'vue';
import axios from 'axios';
import NewProduct from "./NewProduct.vue";
import eventBus from '@/Helpers/event-bus'
const getRandomuserParams = params => ({
    perPage: params.pageSize,
    page: params.current,
    ...params,
});

export default defineComponent({
    components:{
        NewProduct,
    },
    setup() {
        const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Min Amount',
            dataIndex: 'minAmount',
            sorter: true,
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance',
            sorter: true,
        },
        {
            title: 'Term',
            dataIndex: 'term',
            sorter: true,
        },
        {
            title: 'Interval',
            dataIndex: 'interval',
            sorter: true,
            filters: [{
                text: 'Daily',
                value: 'Daily',
            },
            {
                text: 'Weekly',
                value: 'Weekly',
            },
            {
                text: 'Monthly',
                value: 'Monthly',
            },
            {
                text: 'Quarterly',
                value: 'Quarterly',
            },
            {
                text: 'Yearly',
                value: 'Yearly',
            },],
            width: '10%',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            sorter: true,
            filters: [{
                text: '200 (Saving rate)',
                value: '200',
            }, 
            {
                text: '400 (Loan rate)',
                value: '400',
            },
            {
                text: '300 (Fix deposit rate)',
                value: '300',
            },
            {
                text: '100 (Funeral rate)',
                value: '100',
            },],
            width: '10%',
        },
        {
            title: 'Value Type',
            dataIndex: 'valueType',
            sorter: true,
            filters: [
                {
                    text: 'Percentage',
                    value: '%',
                }, 
                {
                    text: 'Natural',
                    value: 'Natural',
                }
            ],
            width: '10%',
        },
        {
            title: 'Value',
            dataIndex: 'value',
        },
        {
            title: 'Days in arrears',
            dataIndex: 'daysInArrears',
        },
        {
            title: 'Reforce',
            dataIndex: 'reforce',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: false,
        },
        {
            title: 'Action',
            dataIndex: 'action',
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

            axios.get('/v1/products?' + u)
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
        const onDelete = (id) => {
            axios.delete('/v1/products/' + id)
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
        
        onMounted(() => {
            eventBus.$on("New-Products-Changed", () => {
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
            onDelete,
            newRole,
            showNewRole,
            onEdit,
            editRole
        };
    },
});
</script>