<template>
    <a-card  :title="state.title" hoverable>
        <PieChart v-bind="state.lineConfig"/>
    </a-card>
</template>
<script>

import { defineComponent, reactive, h } from "vue";
import { PieChart } from "@opd/g2plot-vue";
export default defineComponent({
    components: {
        PieChart,
    },
    setup() {
        const state = reactive({
            visibility: false,
            LineRef: null,
            title: '',
            lineConfig: {
                data: "",
                appendPadding: 10,
                angleField: 'value',
                colorField: 'type',
                radius: 1,
                innerRadius: 0.64,
                meta: {
                    value: {
                        formatter: (v) => `${new Intl.NumberFormat().format(v)}`,
                    },
                },
                label: {
                    type: 'inner',
                    offset: '-50%',
                    autoRotate: false,
                    style: { textAlign: 'center' },
                    formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                },
                statistic: {
                    title: {
                        offsetY: -8,
                    },
                    content: {
                        offsetY: -4,
                    },
                },
                legend: {
                    layout: 'horizontal',
                    position: 'bottom'
                },
                interactions: [
                    { type: 'element-selected' },
                    { type: 'element-active' },
                    {
                        type: 'pie-statistic-active',
                        cfg: {
                            start: [
                                { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
                                { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
                            ],
                            end: [
                                { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
                                { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
                            ],
                        },
                    },
                ],
            },

        });
        function render() {
            return h(PieChart)

        }

        return {
            state,
            render,
        }
    }
});
</script>