<template>
    <div>
        <a-modal v-model:open="visible" width="100%" :title="name+'`s API Token Management'" @ok="handleOk">
            <a-skeleton active :loading="loading">
                <a-row justify="end" :style="{ marginBottom: '24px' }">
                <a-tooltip>
                    <template #title>Genarete new API Token</template>
                    <a-popconfirm title="Sure to refresh API thins token?" @confirm="onGenarete()">
                        <AppstoreAddOutlined :style="{ color: '#52c41a' }"/>
                    </a-popconfirm>
                </a-tooltip>
            </a-row>
            <a-table :dataSource="dataSource" :columns="columns">
            <template #bodyCell="{ column, record }"> 
                    <template v-if="column.dataIndex === 'copy'">
                             <a-button shape="round" @click="doCopy(record.bearer_token_decrypt)">
                                <template #icon>
                                    <CopyOutlined />
                                </template>
                            </a-button>
                    </template> 
                    <template v-if="column.dataIndex === 'id'">
                        
                                    {{ record.bearer_token_decrypt }}
                    </template> 
                    <template v-if="column.dataIndex === 'client_id'">
                            <a-tag color="#2db7f5">
                            {{ record.token.client_id }}
                            </a-tag>
                    </template> 
                    <template v-if="column.dataIndex === 'name'">
                                <a-tag color="#2db7f5">
                                {{ record.token.name }}
                                </a-tag>
                    </template> 

                    <template v-if="column.dataIndex === 'revoked'">
                        <span>
                            <a-tag v-if="record.token.revoked === true " :color="'#eb2f96'">
                                Revoked
                            </a-tag>
                            <a-tag v-else
                                :color="'green'">
                                Not Revoked
                            </a-tag>
                        </span>
                    </template>
                    <template v-if="column.dataIndex === 'expires_at'">
                          <a-tag color="#2db7f5">
                                <template #icon>
                                <LoadingOutlined />
                                </template>
                                <timeago :datetime="dataTimeFormat(record.token.expires_at)"/>
                            </a-tag>
                    </template>

                    <template v-if="column.dataIndex === 'action'">
                        <a-tooltip>
                                <template #title>Refresh API Token</template>
                                <a-popconfirm title="Sure to refresh API thins token?" @confirm="onRefresh(record)">
                                    <SafetyCertificateOutlined :style="{ color: '#52c41a' }"/>
                                </a-popconfirm>
                            </a-tooltip>
                        <a-divider type="vertical" />
                        <a-tooltip>
                            <template #title>Revoke API Token</template>
                            <a-popconfirm title="Sure to Revoke this API token?" @confirm="onRevoke(record)">
                                <FireOutlined :style="{ color: 'hotpink' }"/>
                            </a-popconfirm>
                        </a-tooltip>
                    </template>
                    

                    <template v-if="column.dataIndex === 'scopes'">
                        <a-row v-for="(scope, key) in record.token.scopes" :key="key">
                            <span v-if="scope">
                                <a-tag
                                    :color="'green'">
                                    {{ scope }}
                                </a-tag>
                                <a-divider />
                            </span>
                        </a-row>
                </template>

                <template v-if="column.dataIndex === 'created_at'">
                    {{ dataTimeFormat(record.token.created_at)  }}
                </template>
            </template>
            </a-table>
            </a-skeleton>
        </a-modal>
    </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { LoadingOutlined, CopyOutlined, FireOutlined, SafetyCertificateOutlined,AppstoreAddOutlined } from '@ant-design/icons-vue';
import { copyText } from 'vue3-clipboard'
export default defineComponent({
    components: {
        LoadingOutlined, CopyOutlined, FireOutlined, SafetyCertificateOutlined, AppstoreAddOutlined
    },
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

        const doCopy = (data) => {
            copyText(data, undefined, (error) => {
                if (error) {
                    alert('Can not copy')
                    console.log(error)
                } else {
                    message.success({
                        content: () => 'Copied Personal access token.',
                        class: 'custom-class',
                        style: {
                            marginTop: '10vh',
                        },
                        duration: 5,
                    })
                }
            })
        }

         const onRefresh = (data) => {
            axios.get('/v1/oauth-refresh-personal-access-token/' + data.token.user_id + '/' + data.token.id)
                .then(function () {
                    fetch()
                })
        };

        const onRevoke = (data) => {
            axios.get('/v1/oauth-revoke-personal-access-token/' + data.token.user_id + '/' + data.token.id)
                .then(function () {
                    fetch()
                })
        };

        
        const onGenarete = () => {
            axios.get('/v1/oauth-create-personal-access-token/' + user_id.value )
                .then(function () {
                    fetch()
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
            doCopy,
            onRefresh,
            onRevoke,
            onGenarete,
            columns: [
                
                {
                    title: 'Copy',
                    dataIndex: 'copy',
                    sorter: true,
                    width: '7%',
                },
                {
                    title: 'Token',
                    dataIndex: 'id', 
                    width: '20%',
                    sorter: true,
                    ellipsis: true,
                },
                
                {
                    title: 'Name',
                    dataIndex: 'name',
                },
                {
                    title: 'Client id',
                    dataIndex: 'client_id',
                    width: '8%',
                },
                {
                    title: 'Revoked',
                    dataIndex: 'revoked',
                },
                {
                    title: 'Scopes',
                    dataIndex: 'scopes',
                    ellipsis: true,
                },
                {
                    title: 'Created at',
                    dataIndex: 'created_at',
                },
                {
                    title: 'Expires in',
                    dataIndex: 'expires_at',
                    width: '8%',
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                },
            ],
        };
    },

});
</script>