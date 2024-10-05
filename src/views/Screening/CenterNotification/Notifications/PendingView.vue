<template>
    <a-spin tip="Loading..." :spinning="spinning">

    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
            <PieChart ref="PiechartSource" :style="{ marginBottom: '24px' }" />
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
                <Chart ref="chartDailyPerformaceSource" :style="{ marginBottom: '24px' }" />
        </a-col>
    </a-row>
    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 24, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="chartSource" :style="{ marginBottom: '24px' }"/>
        </a-col>
    </a-row>
   
    <List/>
    </a-spin>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import {  } from '@ant-design/icons-vue';
import axios from 'axios'
import List from './TableList.vue'
import Chart from "../../../../components/Charts/BarChart.vue";
import PieChart from "../../../../components/Charts/PieChart.vue";
//import VueCountdown from '@chenfengyuan/vue-countdown';
import eventBus from '@/Helpers/event-bus';
import { message } from 'ant-design-vue';

export default defineComponent({
    components: {
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
            axios.get('v1/screening-data')
                .then(response => {
                    source.value = response.data

                    chartDailyPerformaceSource.value.loading = false
                    chartDailyPerformaceSource.value.state.title = 'Daily Screening'
                    chartDailyPerformaceSource.value.state.lineConfig.data = response.data.PiechartDataPerformace

                    PiechartSource.value.loading = false
                    PiechartSource.value.state.title = 'Overall'
                    PiechartSource.value.state.lineConfig.data = response.data.PiechartData

                    chartSource.value.loading = false
                    chartSource.value.state.title = 'Risk Categorization'
                    chartSource.value.state.lineConfig.data = response.data.chartData


                    
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
