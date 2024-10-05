<template>
<div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
    <a-card title="Search" style="width: 100%">
        <a-input-search v-model:value="value" placeholder="Serach here.." :loading="state.fetching"
            enter-button />
    </a-card>
</div>
    <a-skeleton active :loading="loading">
    <template v-if="dataSource.data != undefined && dataSource.data.length">
        <a-row :gutter="16">
            <a-col :span="8" v-for="(item, index) in dataSource.data" :key="index">
                <a-card hoverable small :style="{ marginBottom: '24px' }" >
                    <a-card-meta :title="item.user.name" >
                        <template #avatar>
                            <a-avatar style="background-color: #91d5ff" shape="square" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }">
                                <template #icon>
                                    <MobileOutlined v-if="item.device === 'Mobile'" /> 
                                    <TabletOutlined v-else-if="item.device === 'Tablet'" /> 
                                    <AndroidOutlined v-else-if="item.device === 'Robot'" /> 
                                    <DesktopOutlined v-else-if="item.device === 'Desktop'"/> 
                                    <MobileOutlined v-else-if="item.device === 'Phone'" />
                                    <LaptopOutlined v-else/>
                                </template>
                            </a-avatar>
                        </template>
                        <template #description>
                            <p><b>IP: </b> {{item.ip}}</p>
                            <p><b>Device: </b> {{item.device}}</p>
                            <p><b>Device name: </b> {{item.device_name}}</p>
                            <p><b>Browser: </b> {{item.browser}}</p>
                            <p><b>Robot: </b> {{item.robot_name}}</p>
                            <p><b>Browser Version: </b> {{item.browser_version}}</p>
                            <p><b>Platform: </b> {{item.platform}}</p>
                            <p><b>Black List:</b> {{item.black_list}}</p>
                            <p><b>Last Login:</b> {{dataTimeFormat(item.updated_at)}}</p>
                        </template>
                    </a-card-meta>
                    <template #actions>
                        <a-popconfirm title="Sure to Unblock device?" v-if="item.black_list" @confirm="onUnBlock(item)" key="unBlock">
                            <SafetyCertificateOutlined  />
                        </a-popconfirm>
                        <a-popconfirm title="Sure to Block device?" v-else @confirm="onBlock(item)">
                            <FireOutlined  :style="{ color: 'hotpink' }" keys="block" />
                        </a-popconfirm>
                        <CompassOutlined key="logs" @click="onLogs(item)" />
                    </template>
                </a-card>
            </a-col>
        </a-row>
        <br />
        <a-row justify="end">
            <a-pagination v-model:current="pagination.current" v-model:page-size="pagination.perPage" :total="pagination.total"
                :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`" @change="onChangePageNumber"/>
        </a-row>
    </template>    
    <a-empty  v-else/>
    </a-skeleton>
    <UserLogs ref="userLogs" />
</template>
<script>
import { FireOutlined, LaptopOutlined, CompassOutlined, SafetyCertificateOutlined, MobileOutlined, TabletOutlined, AndroidOutlined, DesktopOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, onMounted, reactive, watch, } from 'vue';
import axios from 'axios';
import UserLogs from '../UserLogs.vue';
import { debounce } from 'lodash-es'


export default defineComponent({
    components: {
        UserLogs,LaptopOutlined,FireOutlined, CompassOutlined, SafetyCertificateOutlined, MobileOutlined, TabletOutlined, AndroidOutlined, DesktopOutlined
    },
    setup() {
        const pagination = ref({
            current: 1,
            perPage: 15,
        });
        const dataSource = ref();
        const loading = ref(true);
        const fetch = () => {
            loading.value = true
            let u = (`page=${pagination.value.current}&perPage=${pagination.value.perPage}`).toString();
            axios.get('/v1/devices?' + u)
                .then(response => {
                    dataSource.value = response.data
                    loading.value = false
                    pagination.value = {
                        perPage: parseInt(dataSource.value.per_page),
                        current: parseInt(dataSource.value.current_page),
                        total: parseInt(dataSource.value.total),
                    };
                })
        };
        onMounted(() => {
            fetch()
        }); 

        const onChangePageNumber = pageNumber => {
            //console.log(pageNumber)
            pagination.value.page = pageNumber
            fetch()
        };

        const userLogs = ref()
        const onLogs = (record) => {
            userLogs.value.name = record.user.name + ' '+ record.ip
            userLogs.value.url = '/v1/users/logs/ip/' + record.user_id + '/' + record.ip
            userLogs.value.visible = true
        }
        const state = reactive({
            data: [],
            fetching: false,

        });
        const value = ref();
        const fetchDevice = debounce(value => {
            //console.log('fetching user', value);
            dataSource.value = '';
            state.fetching = true;
            if (value)
                axios.get('v1/find/devices/' + value)
                    .then(response => {
                        dataSource.value = response.data;
                        state.fetching = false; 
                        loading.value = false
                    });
            else
                state.fetching = false;
                loading.value = false
        }, 500);

        const onBlock = (record) => {
            axios.get('/v1/devices/block/' + record.uuid)
                .then(function () {
                    fetch()
                })
        };

        const onUnBlock = (record) => {
            axios.get('/v1/devices/unblock/' + record.uuid)
                .then(function () {
                    fetch()
                })
        };

        watch(value, () => {
            dataSource.value = '';
            fetchDevice(value.value)
            state.fetching = false;
            loading.value = true
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

        return {
            dataSource, 
            dataTimeFormat,
            onLogs,
            userLogs,
            loading,
            state,
            value,
            pagination,
            onChangePageNumber,
            onBlock,
            onUnBlock
        }

    }
});
</script>