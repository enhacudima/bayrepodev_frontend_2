<template>
    <a-card  :title="state.title">
        <PiePlot :config="state.lineConfig" :chartRef="(ref) => (state.LineRef = ref)" v-if="state.visibility" />
    </a-card>
</template>

<script>
import { defineComponent, reactive, onMounted, h } from "vue";
import { PiePlot } from "ant-design-charts-vue";
import eventBus from '@/Helpers/event-bus'
export default defineComponent({
    components: {
        PiePlot,
    },
    setup (){
        const state = reactive({
            title:'Transactions Overview',
            visibility: false,
            LineRef: null,
            lineConfig: {
                data: '',
                appendPadding: 10,
                angleField: 'value',
                colorField: 'type',
                radius: 1,
                innerRadius: 0.64,
                meta: {
                    value: {
                        formatter: (v) => `R ${new Intl.NumberFormat().format(v) }`,
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
            return h(PiePlot)
            
        }
        
        onMounted(() => {

            eventBus.$on("Change-Data-Chat", () => {
                state.visibility = false
                state.visibility = true
                render()
            });

        });
        return{
            state,
            render,
        }
    }
});
</script>