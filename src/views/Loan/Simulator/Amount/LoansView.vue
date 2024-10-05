<template>
    <a-table :columns="columns" :row-key="record => record.row_key" :data-source="dataSource"
        :loading="loading" >
    </a-table>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    components: {
    },
    setup() {
        const columns = [
            {
                title: 'No',
                dataIndex: 'row_key',
            },
            {
                title: 'Produtos',
                dataIndex: 'produto',
            },
            {
                title: 'Juros',
                dataIndex: 'taxa_juros',
            },
            {
                title: 'Valor Solicitado',
                dataIndex: 'emprestimo',
            },
            {
                title: 'Prestação mensal',
                dataIndex: 'prestacao',
            },
            {
                title: 'Taxa de Esforco Max',
                dataIndex: 'taxa_max',
            }, 
        ];
        const dataSource = ref([]);
        const loading = ref(false);

        return {
            dataSource,
            columns: ref(columns),
            loading,
        };
    },
});
</script>