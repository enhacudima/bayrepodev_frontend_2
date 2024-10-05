<template>
    <a-card :title="state.title" hoverable>
        <ColumnChart :config="state.lineConfig" />
    </a-card>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ColumnChart } from "@opd/g2plot-vue";
export default defineComponent({
    components: {
        ColumnChart,
    },
    setup (){
        const state = reactive({
            LineRef: null,
            title: '',
            lineConfig: {
                data: '',
                xField: 'my_date',
                yField: 'value',
                isGroup: true,
                isStack: true,
                seriesField: 'type',
                groupField: 'group',
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
