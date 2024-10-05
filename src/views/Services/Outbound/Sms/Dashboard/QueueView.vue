<template>
    <a-spin tip="Loading..." :spinning="spinning">
    <a-row justify="end" :style="{ marginBottom: '24px' }">
        <a-tooltip>
            <template #title>{{ $tc('filter', 2) }}</template>
            <funnel-plot-outlined  @click="visible = true"/>
        </a-tooltip>
    </a-row>
     <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
            <PieChart ref="PiechartSource" :style="{ marginBottom: '24px' }" />
        </a-col>
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="PiechartEficienceSource" :style="{ marginBottom: '24px' }" />
        </a-col>
    </a-row>
    <a-row :gutter="24">
        <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 24, offset: 0 }" :style="{ marginBottom: '24px' }">
            <Chart ref="chartSource" :style="{ marginBottom: '24px' }"/>
        </a-col>
    </a-row>
   

    <a-modal v-model:open="visible"   :title="$t('filter')" @ok="handleOk" 
            >
            <a-row>
                <a-range-picker v-model:value="filter.updated_date" style="width: 100%"/>
            </a-row>
    </a-modal>

    </a-spin>
</template>
<script>
import { defineComponent, ref, onMounted , reactive } from 'vue'
import { FunnelPlotOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import Chart from "../../../../../components/Charts/BarChart.vue";
//import ChartGoup from "../../../../../components/Charts/BarGroupedChart.vue";
//import BarGroupedStackChart from "../../../../../components/Charts/BarGroupedStackChart.vue";
import PieChart from "../../../../../components/Charts/PieChart.vue";
export default defineComponent({
    components: {
        Chart,
        PieChart,
        //ChartGoup,
        //BarGroupedStackChart,
        FunnelPlotOutlined
    },
    setup() {
        const filter = reactive({
            updated_date: '',
        });
        const visible = ref(false);
        const dataSource = ref([])
        const chartSource = ref()
        const PiechartSource = ref()
        const PiechartEficienceSource = ref()
        const spinning = ref(false)
        function dataGet() {
            dataSource.value.loading = true
            axios.post('v1/smsbound/queue/data', filter)
                .then(response => {

                    dataSource.value.loading = false
                    chartSource.value.state.title = 'Daily Status'
                    chartSource.value.state.lineConfig.data = response.data.chartData

                    PiechartEficienceSource.value.loading = false
                    PiechartEficienceSource.value.state.title = 'Status'
                    PiechartEficienceSource.value.state.lineConfig.data = response.data.PiechartDataEficience

                    PiechartSource.value.loading = false
                    PiechartSource.value.state.title = 'Overall'
                    PiechartSource.value.state.lineConfig.data = response.data.PiechartData


                });
        }
        const handleOk = () => {
            dataGet()
            visible.value = false
        };

        onMounted(() => {
            dataGet()
        });

       

        return{
            handleOk,
            chartSource,
            PiechartSource,
            spinning,
            PiechartEficienceSource,
            visible,
            filter
        }


    },
})
</script>
