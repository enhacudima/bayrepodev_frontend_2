<template>
    <a-row type="flex" justify="space-around" align="middle" :style="{ marginTop: '24px' }">
          <a-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22"   >
            <a-row :style="{ width: '100%', marginBottom: '3%' }">
            <a-col :span="5" :offset="9">
                <a-image :style="{ width: '100%' }" :src="require('../../../assets/logo/motswedi-removebg-preview.png')" />
            </a-col>
            </a-row>
           <a-card title="Shared Files" :style="{ marginBottom: '24px' }" :loading="state.fetching">
               <a-row :gutter="16">
                   <a-col :span="8" v-for="(file, index) in filesClient" :key="index">
                       <a-card hoverable style="text-align: center; width: 510px; max-width: 510px; max-height: 300px; margin-bottom: 24px; margin-left: 24px">
                           <template #cover>
                               <a-image style="width: 510px; max-width: 510px; height: 200px; max-height: 200px" :src="$baseUrl + 'storage/' + file.path + file.name"
                                   v-if="file.mime_type == 'image-png' || file.mime_type == 'image-jpeg'" />
                               <a-result v-if="file.mime_type == 'application-pdf'" >
                                   <template #icon>
                                       <file-pdf-outlined  />
                                   </template>
                               </a-result>
                               <a-result v-else-if="file.mime_type != 'image-png' && file.mime_type != 'image-jpeg' && file.mime_type != 'application-pdf'">
                                   <template #icon>
                                       <FileTextOutlined />
                                   </template>
                               </a-result>
                           </template>
                           <a-card-meta :title="file.original_name">
                               <template #description>
                                   <a-tooltip color="blue">
                                       <template #title>Name: {{ file.original_name }}, Date: {{ dataTimeFormat(file.updated_at) }},User:
                                           {{ file.user ? file.user.name : '' }}
                                       </template>
                                       <a :href="$baseUrl + 'storage/' + file.path + file.name" target="_blank">
                                           {{ dataTimeFormat(file.updated_at) }}
                                       </a>
                                    </a-tooltip>
                                    <p>
                                        <a-popconfirm title="Delete"  @confirm="onBlock(file)">
                                             <DeleteOutlined  :style="{ color: 'hotpink' }" keys="block" />
                                         </a-popconfirm>
                                    </p>
                               </template>
                           </a-card-meta>
                       </a-card>
                   </a-col>
                   
               </a-row>
           </a-card>
          </a-col>
        </a-row>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, onMounted  } from 'vue';
import axios from 'axios'
import { message } from 'ant-design-vue';
import {  FileTextOutlined,  FilePdfOutlined, DeleteOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    components: {
        FileTextOutlined,
        FilePdfOutlined,
        DeleteOutlined
    },
    props: {
    },
    setup() {
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
        const uuid = ref()
        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        };

        const state = reactive({
            data: [],
            value: [],
            fetching: true,
        });
        const table = reactive({
            dataSource: [],
        });

        const filesClient = ref([])
        const onSearch = () => {
            var len = uuid.value.length
            if (len <= 3) {
                return null;
            }
            state.fetching = true;
            axios.get("v1/box-search-get/" + uuid.value)
                .then(response => {
                    filesClient.value = response.data,
                    state.fetching = false;
                })
                .catch(() => { })
        };

        const fileList = ref([])
        const handleChange = info => {
            const status = info.file.status;

            if (status !== 'uploading') {
                //console.log(info.file, info.fileList);
            }

            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        };
        const fetch = () => {
            state.fetching = true;
            axios.get("v1/shared-files-get")
                .then(response => {
                    filesClient.value = response.data,
                        state.fetching = false;
                })
                .catch(() => { })
        };
        onMounted(() => {
            fetch()
        });
        const onBlock = (record) => {
            axios.get('/v1/shared-files/block/' + record.my_token)
                .then(function () {
                    fetch()
                })
        };


        return {
            onBlock,
            onSearch,
            state,
            dataTimeFormat,
            uuid,
            handleChange,
            fileList,
            filesClient,
            formItemLayout,
            ...toRefs(state),
            table,
            columns: [
                {
                    title: 'First name',
                    dataIndex: 'first_names',
                    key: 'first_names',
                },
                {
                    title: 'Surname',
                    dataIndex: 'surname',
                    key: 'surname',
                },
                {
                    title: 'Client ID',
                    dataIndex: 'client_id',
                    key: 'client_id',
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: 'Mobile number',
                    dataIndex: 'mobile_number',
                    key: 'mobile_number',
                },
                {
                    title: 'ID number',
                    dataIndex: 'id_number',
                    key: 'id_number',
                },
                {
                    title: 'Date of birth',
                    dataIndex: 'date_of_birth',
                    key: 'date_of_birth',
                },
            ],
        };
    },

});
</script>
