<template>
    <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :pagination="pagination"
        :loading="loading" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'name'"> <a>
                {{ record.name }}
            </a></template>
            <template v-if="column.dataIndex === 'updated_at'">{{ dataFormat(record.updated_at) }}
            </template>
            <template v-if="column.dataIndex === 'totalAmount'">{{ new Intl.NumberFormat().format(text) }}
            </template>
            <template v-if="column.dataIndex === 'range'">[ {{ new Intl.NumberFormat().format(record.min) }} -
                {{ new Intl.NumberFormat().format(record.max) }} ]
            </template>
            <template v-else-if="column.dataIndex === 'action'">
                <span>
                    <download-outlined @click="onXML(record.bulk, record.min, record.max)" :style="{ color: 'hotpink' }"/>
                </span>
                <a-divider type="vertical" />

                <span>

                    <folder-open-outlined @click="onFiles(record.bulk)"/>
                </span>
            </template>
        </template>
    </a-table>

    <formXML :bulk="bulk" ref="chilDep" />
    <filesXML :bulk="bulk" ref="chilDepFiles" />

</template>
<script>
import { defineComponent, onMounted, ref, watch} from 'vue';
import formXML from './FormView.vue'
import filesXML from './FilesXML.vue'
import moment from "moment";
import axios from 'axios'
import { FolderOpenOutlined, DownloadOutlined} from '@ant-design/icons-vue';
const getRandomuserParams = params => ({
  perPage: params.pageSize,
  page: params.current,
  ...params,
});

export default defineComponent({
    components:{
        formXML,
        filesXML,
        FolderOpenOutlined,
        DownloadOutlined
    },
  setup() {
      const chilDep = ref()
      const bulk = ref()
      const chilDepFiles = ref()
      const dataFormat = (date) => { return  moment(date).format('DD-MM-YYYY HH:mm:ss')  }
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Date',
            dataIndex: 'updated_at',
            sorter: false,
            width: '20%',
        },
        {
            title: 'Rows',
            dataIndex: 'count',
            },
            {
                title: 'Total Amount',
                dataIndex: 'totalAmount',
            },
            {
                title: 'Range',
                dataIndex: 'range',
            },
            {
            title: 'Bulk',
            dataIndex: 'bulk',
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

    const fetch = (params = {}) => {
      loading.value = true;
      let u = new URLSearchParams(getRandomuserParams(params)).toString();

        axios.get('/v1/baylend-consolidate-disbursement?'+u)
        .catch(error => console.error('Error:', error))
        .then(response => {
          //console.log('Success:', response);
          loading.value = false;
          dataSource.value = response.data.data;
          //console.log()
          pagination.value = {
            ...params,
              total: response.data.total,
              showTotal: (total) => `${response.data.from}-${response.data.to} of ${total} items` // 200 is mock data, you should read it from server
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
      const onXML = (bulkCode, minCode, maxCode) => {
          bulk.value = bulkCode
          chilDep.value.visible = true;
          chilDep.value.min = Number(minCode);
          chilDep.value.max = Number(maxCode);
        };
        const onFiles = (bulkCode) =>{
            chilDepFiles.value.draw = true
            chilDepFiles.value.bulk = bulkCode
        }
        const onDelete = (id) => {
            axios.get('/v1/users/status-change/' + id)
                .then(function (){
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
      fetch(pagination.value);
    });
    return {
        dataSource,
        columns: ref(columns),
        pagination,
        loading,
        handleTableChange,
        onXML,
        onDelete,
        chilDep,
        bulk,
        onFiles,
        chilDepFiles,
        dataFormat,
    };
  },
});
</script>
