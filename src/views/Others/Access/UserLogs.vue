<template>
    <div>
        <a-modal v-model:open="visible" width="1000px" :title="name+'`s Logs'" @ok="handleOk">
            <a-skeleton active :loading="loading">
            <a-table :dataSource="dataSource" :columns="columns">
            <template #bodyCell="{ column, record }">    
                <template v-if="column.dataIndex === 'created_at'">
                    {{ dataTimeFormat(record.created_at)  }}
                </template>
            </template>
            </a-table>
            </a-skeleton>
        </a-modal>
    </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
import axios from 'axios';
export default defineComponent({
    setup() {
        const visible = ref(false);
        const loading = ref(true)
        const name = ref()
        const user_id = ref()
        const url = ref()
        const dataSource = ref([]);
        const showModal = () => {
            visible.value = true;
        };

        const handleOk = () => {
            visible.value = false;
        };

        const fetch = () => {
            axios.get(url.value)
                .then(response => {
                    dataSource.value = response.data
                    loading.value = false
                })
        };

        watch(
            visible,
            () => {
                if (visible.value == true )
                fetch();
            },

        );
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

        return {
            visible,
            showModal,
            handleOk,
            name,
            user_id,
            dataSource,
            dataTimeFormat, 
            url,
            loading,
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                },
                {
                    title: 'Sub Action',
                    dataIndex: 'sub_action',
                },
                {
                    title: 'Message',
                    dataIndex: 'message',
                    ellipsis: true,
                },
                {
                    title: 'IP',
                    dataIndex: 'ip',
                },
                {
                    title: 'Date Time',
                    dataIndex: 'created_at',
                    width: '17%',
                },
            ],
        };
    },

});
</script>