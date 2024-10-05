<template>
    <a-modal v-model:open="visible" width="1000px" :title="$t('smsBound')" :footer="null">
        <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
            <a-card :title="$t('search')" style="width: 100%">
                <a-input-search v-model:value="value" placeholder="Serach here.." :loading="loading"
                    enter-button />
            </a-card>
        </div>

        <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
            :loading="loading" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'code'">
                    
                    <a-tooltip>
                        <template #title>{{ record.response_sms }}</template>
                        <a-tag color="#2db7f5">{{ record.code }}</a-tag>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'mobileNumber'">
                    <a-tag color="#2db7f5">{{ record.mobileNumber }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'created_at'">
                        {{ dataTimeFormat(record.created_at) }}
                </template>
                <template v-if="column.dataIndex === 'updated_at'">
                        <timeago :datetime="dataTimeFormat(record.created_at)"/>
                </template>
            </template>
        </a-table>
        
    </a-modal>
</template>
<script>
import { defineComponent, ref, watch,  onMounted } from 'vue';
import axios from 'axios'
import { debounce } from 'lodash-es'
//import { useRoute } from 'vue-router'
const getRandomuserParams = params => ({
    perPage: params.pageSize,
    page: params.current,
    ...params,
});
export default defineComponent({
    setup() {
        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        };
        //const route = useRoute()
        //const uuid = route.params.uuid
        const uuid = ref()
        const pagination = ref({
            current: 1,
            pageSize: 10,
        });
        const loading = ref(true);
        const dataSource = ref([]);
        const visible = ref(false)
        const data = ref();
        const fetch = (params = {}) => {
            loading.value = true;
            let u = new URLSearchParams(getRandomuserParams(params)).toString();

            axios.get(`/v1/smsapi?${u}`)
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
                eqApplication: `smsbound_${uuid.value}`,
                ...filters,
            });
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
            dataSource.value = [];
            fetchData(value.value)
        });

        watch(visible, (newValue) => {
            if(newValue == true){
                uuid.value = data.value.uuid
                fetch(  
                    {
                        perPage: 50,
                        page: 1,
                        sortField: 'id',
                        sortOrder: 'desc',
                        eqApplication: `smsbound_${uuid.value}`
                    }
                );
                uuid.value = data.value.uuid
            }
        });
        const fetchData = debounce(value => {
            const params = {
                perPage: 20,
                page: 1,
                sortField: 'id',
                sortOrder: 'desc',
                likeMobileNumber:  '%' +value + '%',
                likeMessage: '%'+ value + '%',
                likeTitle: '%' + value + '%',
                eqApplication: `smsbound_${uuid.value}`,
            }
            if (value)
                fetch(params)
        }, 500);

        onMounted(() => {
            //fetch(pagination.value);
        });

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
                title: 'Code',
                dataIndex: 'code',
                width: '5%',
                sorter: true,
            },
            {
                title: 'SMS Message',
                dataIndex: 'message',
                width: '15%',
                sorter: true,
            },
            {
                title: 'SMS Count',
                dataIndex: 'sms_count',
                sorter: true,
            },
            {
                title: 'Date time',
                dataIndex: 'created_at',
                width: '10%',
                sorter: true,
            },
            {
                title: 'Phone number',
                dataIndex: 'mobileNumber',
                sorter: true,
            },
            {
                title: 'Last Update',
                dataIndex: 'updated_at',
                width: '10%',
                sorter: true,
            },
            
        ];
        

        return {
            layout,
            visible,
            dataSource,
            columns,
            handleTableChange,
            dataTimeFormat,
            data,
            value,
            pagination,
            loading
        };
    },

});
</script>