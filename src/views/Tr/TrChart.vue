<template>
    <a-card :title="state.title" hoverable>
        <ColumnPlot :config="state.lineConfig" :chartRef="(ref) => (state.LineRef = ref)"
            v-if="state.lineConfig.data" />
    </a-card>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ColumnPlot } from "ant-design-charts-vue";
export default defineComponent({
    components: {
        ColumnPlot,
    },
    setup (){
        const state = reactive({
            LineRef: null,
            title: 'Last Account Movements',
            lineConfig: {
                data: '',
                isStack: true,
                xField: 'my_date',
                yField: 'value',
                seriesField: 'type',
                label: {
                    // 可手动配置 label 数据标签位置
                    position: 'middle', // 'top', 'bottom', 'middle'
                    // 可配置附加的布局方法
                    layout: [
                        // 柱形图数据标签位置自动调整
                        { type: 'interval-adjust-position' },
                        // 数据标签防遮挡
                        { type: 'interval-hide-overlap' },
                        // 数据标签文颜色自动调整
                        { type: 'adjust-color' },
                    ],
                },
            },

        });
        return{
            state,
        }
    }
});
</script>