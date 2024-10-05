<template>
  <a-spin tip="Loading..." :spinning="spinning">
    <a-row justify="end" :style="{ marginBottom: '24px' }">
      <a-tooltip>
        <template #title>{{ $t('filter', 2) }}</template>
        <funnel-plot-outlined @click="showModal(true)" />
      </a-tooltip>
    </a-row>
    <a-row :gutter="24">
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 8, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('connection', 2)"
            :value="source.connections ?? ''"
            class="demo-class"
            :value-style="{ color: '#1890ff' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 8, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('failed')"
            :value="source.failed"
            class="demo-class"
            :value-style="{ color: '#ff4d4f' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 8, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <a-card hoverable :style="{ marginBottom: '24px' }">
          <a-statistic
            :title="$t('success')"
            :value="source.success_c"
            class="demo-class"
            :value-style="{ color: '#73d13d' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 12, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <PieChart ref="PiechartSource" :style="{ marginBottom: '24px' }" />
      </a-col>
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 12, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <Chart ref="PiechartEficienceSource" :style="{ marginBottom: '24px' }" />
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 24, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <Chart ref="chartSource" :style="{ marginBottom: '24px' }" />
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 24, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <BarGroupedStackChart ref="ChartGoup" :style="{ marginBottom: '24px' }" />
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col
        :xs="{ span: 24, offset: 0 }"
        :lg="{ span: 24, offset: 0 }"
        :style="{ marginBottom: '24px' }"
      >
        <Chart ref="chartDailyPerformaceSource" :style="{ marginBottom: '24px' }" />
      </a-col>
    </a-row>

    <a-modal :open="visible" :title="$t('filter')" @ok="handleOk()">
      <a-row>
        <a-range-picker v-model:value="filter.updated_date" style="width: 100%" />
      </a-row>
    </a-modal>
  </a-spin>
</template>
<script>
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { FunnelPlotOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import Chart from '../../../../../components/Charts/BarChart.vue'
//import ChartGoup from "../../../../../components/Charts/BarGroupedChart.vue";
import BarGroupedStackChart from '../../../../../components/Charts/BarGroupedStackChart.vue'
import PieChart from '../../../../../components/Charts/PieChart.vue'
export default defineComponent({
  components: {
    Chart,
    PieChart,
    //ChartGoup,
    BarGroupedStackChart,
    FunnelPlotOutlined
  },
  setup() {
    const filter = reactive({
      updated_date: ''
    })
    const ChartGoup = ref()
    const visible = ref(false)
    const dataSource = ref([])
    const chartSource = ref()
    const PiechartSource = ref()
    const PiechartEficienceSource = ref()
    const chartDailyPerformaceSource = ref()
    const spinning = ref(false)
    const source = ref([])
    const timeOut = ref(600000)
    function dataGet() {
      dataSource.value.loading = true
      axios.post('v1/smsbound/dashboard/data', filter).then((response) => {
        source.value = response.data
        dataSource.value.dataSource = response.data.data

        dataSource.value.loading = false
        chartSource.value.state.title = 'Monthly Status'
        chartSource.value.state.lineConfig.data = response.data.chartData

        chartDailyPerformaceSource.value.loading = false
        chartDailyPerformaceSource.value.state.title = 'Teams'
        chartDailyPerformaceSource.value.state.lineConfig.data =
          response.data.PiechartDataPerformace

        PiechartEficienceSource.value.loading = false
        PiechartEficienceSource.value.state.title = 'Status'
        PiechartEficienceSource.value.state.lineConfig.data = response.data.PiechartDataEficience

        PiechartSource.value.loading = false
        PiechartSource.value.state.title = 'Overall'
        PiechartSource.value.state.lineConfig.data = response.data.PiechartData

        ChartGoup.value.loading = false
        ChartGoup.value.state.title = 'Monthly Team Status'
        ChartGoup.value.state.lineConfig.data = response.data.ChartGoup
      })
    }
    const handleOk = () => {
      dataGet()
      visible.value = false
    }
    const showModal = (status) => {
      visible.value = status
    }

    onMounted(() => {
      dataGet()
    })

    return {
      handleOk,
      ChartGoup,
      source,
      dataSource,
      chartSource,
      timeOut,
      PiechartSource,
      spinning,
      PiechartEficienceSource,
      chartDailyPerformaceSource,
      visible,
      filter,
      showModal
    }
  }
})
</script>
