<template>
    <a-spin tip="Loading..." :spinning="spinning">
    <a-row>
        <!--
            <vue-countdown :time="timeOut" v-slot="{ minutes, seconds }">
                Auto update in: {{ minutes }} minutes, {{ seconds }} seconds.
            </vue-countdown>
        -->
    </a-row>
        <a-row>
            <div>
                <a-popconfirm placement="bottom"  title="Sure to force update?" @confirm="onForceUpdate()">
                    <a-button type="primary"  >
                        <template #icon><WarningOutlined /></template>
                        Force Update
                    </a-button>
                </a-popconfirm>
                <a-divider type="vertical" />
                    <a-popconfirm placement="bottom" title="Sure Export File and move to Uploading?" @confirm="onExportLock()">
                        <a-button type="primary"  >
                            <template #icon><LockOutlined /></template>
                            Export Ready To Lock File
                        </a-button>
                    </a-popconfirm>
            </div>
        </a-row>
       <a-divider></a-divider>
    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 4, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-popconfirm placement="bottom"  title="Sure to force update?" @confirm="onForceUpdate()">
                <a-card hoverable :style="{ marginBottom: '24px' }">
                    <a-statistic title="Update" :value="source.latest ?? ''" class="demo-class"
                        :value-style="{ color: '#3f8600' }">
                    </a-statistic>
                </a-card>
            </a-popconfirm>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Total" :value="source.total" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="OTP" :value="source.otp" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="QA" :value="source.qa" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="BLACK" :value="source.black_list" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="AML" :value="source.aml" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 2, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Reference" :value="source.reference" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Check Reference" :value="source.check_reference" class="demo-class" :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
    </a-row>
    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="CDR" :value="source.cdr" class="demo-class"
                    :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 3, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Check Telephone" :value="source.check_telephone" class="demo-class"
                    :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 2, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-popconfirm placement="bottom" title="Sure Export File and move to Uploading?" @confirm="onExportLock()">
                <a-card hoverable :style="{ marginBottom: '24px' }">
                    <a-statistic title="Lock" :value="source.ready" class="demo-class" :value-style="{ color: '#3f8600' }">
                    </a-statistic>
                </a-card>
            </a-popconfirm>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 2, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Uploading" :value="source.fixing" class="demo-class"
                    :value-style="{ color: '#3f8600' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 2, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Approve" :value="source.ready_approval" class="demo-class"
                    :value-style="{ color: '#3f8600' }">
                </a-statistic>
            </a-card>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 2, offset: 0 }" :style="{ marginBottom: '24px' }">
            <a-card hoverable :style="{ marginBottom: '24px' }">
                <a-statistic title="Reject" :value="source.ready_reject" class="demo-class"
                    :value-style="{ color: '#f5222d' }">
                </a-statistic>
            </a-card>
        </a-col>
    </a-row>
    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
            <PieChart ref="PiechartSource" :style="{ marginBottom: '24px' }" />
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="PrincipalSource" :style="{ marginBottom: '24px' }" />
        </a-col>
        
    </a-row>
    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="PiechartEficienceSource" :style="{ marginBottom: '24px' }" />
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 6, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="chartSource" :style="{ marginBottom: '24px' }"/>
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="chartDailyPerformaceSource" :style="{ marginBottom: '24px' }" />
        </a-col>
    </a-row>
    
    <List ref="dataSource"/>
    </a-spin>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import { WarningOutlined, LockOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import List from './TableList.vue'
import Chart from "../../../components/Charts/BarChart.vue";
import PieChart from "../../../components/Charts/PieChart.vue";
//import VueCountdown from '@chenfengyuan/vue-countdown';
import eventBus from '../../../Helpers/event-bus';
import { message } from 'ant-design-vue';

export default defineComponent({
    components: {
        LockOutlined,
        WarningOutlined,
        List,
        Chart,
        //VueCountdown,
        PieChart
    },
    setup() {
        const dataSource = ref()
        const chartSource = ref()
        const PiechartSource = ref()
        const PiechartEficienceSource = ref()
        const chartDailyPerformaceSource = ref()
        const PrincipalSource = ref()
        const PrincipalChartSource = ref()
        const spinning = ref(false)
        const source = ref([])
        const timeOut = ref(600000)
        function dataGet() {
            dataSource.value.loading = true
            axios.get('v1/wh-pending-approval/data')
                .then(response => {
                    source.value = response.data
                    dataSource.value.dataSource = response.data.data
                    dataSource.value.tableData = response.data.data
                    dataSource.value.loading = false
                    chartSource.value.state.title = 'Time Category'
                    chartSource.value.state.lineConfig.data = response.data.chartData

                    chartDailyPerformaceSource.value.loading = false
                    chartDailyPerformaceSource.value.state.title = 'Daily Performace'
                    chartDailyPerformaceSource.value.state.lineConfig.data = response.data.PiechartDataPerformace

                    PiechartEficienceSource.value.loading = false
                    PiechartEficienceSource.value.state.title = 'Monthly Eficience'
                    PiechartEficienceSource.value.state.lineConfig.data = response.data.PiechartDataEficience

                    PiechartSource.value.loading = false
                    PiechartSource.value.state.title = 'Overall'
                    PiechartSource.value.state.lineConfig.data = response.data.PiechartData

                    PrincipalSource.value.loading = false
                    PrincipalSource.value.state.title = 'Cash Disbursement'
                    PrincipalSource.value.state.lineConfig.data = response.data.PieLoanPrincipal


                    
                });
        }

        onMounted(() => {
            dataGet()
            setInterval(function () {
                timeOut.value = 540000
                dataGet()
            }, timeOut.value);
        });

        eventBus.$on("table-list-Changed", () => {
            dataGet()
        });

        function forceUpdate() {
            source.value.latest = 'Updating..'
            axios.post("v1/wh-pending-approval/force-update")
                .then(
                    response  => {
                        response
                        spinning.value = false
                        dataGet()
                    }
                )
        }

        const onForceUpdate = ()=>{
            forceUpdate()
        }
        const onExportLock = () =>{
            axios.get("v1/wh-pending-approval/export-lock")
                .then(
                    response => {
                        response
                        spinning.value = false
                        message.success({
                            content: () => 'Your file is being processed',
                            class: 'custom-class',
                            style: {
                                marginTop: '10vh',
                            },
                            duration: 10,
                        })
                        dataGet()
                    }
                )
        }

        return{
            source,
            dataSource,
            chartSource,
            timeOut,
            onForceUpdate,
            PiechartSource,
            spinning,
            PiechartEficienceSource,
            onExportLock,
            chartDailyPerformaceSource,
            PrincipalSource,
            PrincipalChartSource
        }


    },
})
</script>
