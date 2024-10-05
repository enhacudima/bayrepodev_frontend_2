<template>
    <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource"
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
                dataIndex: 'i',
            },
            {
                title: 'Date',
                dataIndex: 'date',
            },
            {
                title: 'Beginning Balance',
                dataIndex: 'beginning_balance',
            },
            {
                title: 'Instalment',
                dataIndex: 'instalment',
            },
            {
                title: 'Insurance',
                dataIndex: 'insurance',
            },
            {
                title: 'Principal',
                dataIndex: 'principal',
            },
            {
                title: 'Interest',
                dataIndex: 'interest',
            },
            {
                title: 'Ending Balance',
                dataIndex: 'ending_balance',
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