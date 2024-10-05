<template>
    <a-card :loading="loading" title="Approvals">
        <div>
            <a-button class="editable-add-btn" @click="handleAdd">Add Row</a-button>
            <a-table bordered :dataSource="dataSource" :columns="columns" rowKey="id">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'name'">
                        <div class="editable-cell">
                            <editable-cell :text="text" @change="onCellChange(record.id, 'name', $event)" />
                        </div>
                    </template>
                    <template v-else-if="column.dataIndex === 'email'">
                        <div class="editable-cell">
                            <editable-cell :text="text" @change="onCellChange(record.id, 'email', $event)" />
                        </div>
                    </template>
                    <template v-else-if="column.dataIndex === 'aplication'">
                        <div class="editable-cell">
                            <editable-cell :text="text" @change="onCellChange(record.id, 'aplication', $event)" />
                        </div>
                    </template>
                    <template v-else-if="column.dataIndex === 'title'">
                        <div class="editable-cell">
                            <editable-cell :text="text" @change="onCellChange(record.id, 'title', $event)" />
                        </div>
                    </template>
                    <template v-else-if="column.dataIndex === 'operation'">
                        <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.id)">
                            <delete-two-tone two-tone-color="#eb2f96"  />
                        </a-popconfirm>
                    </template>
                </template>
            </a-table>
        </div>
    </a-card>
      <div v-html="vars">  
      </div>
</template>
<script>
import EditableCell from '@/components/Helpers/Ant/EditableCell.vue';
import { /*CheckOutlined, EditOutlined,*/ DeleteTwoTone } from '@ant-design/icons-vue';
import axios from 'axios'

  export default {
    components: {
        EditableCell,
        //CheckOutlined,
        //EditOutlined,
        DeleteTwoTone,
    },
    data() {
        return {
        loading: true,
        dataSource: [],
        count: 2,
        message:'',
        vars:"<table><th><tr><td></td><td></td><td></td></tr></th><tbody><tr><td><b>CartaAbonatoria</b></td><td>-</td><td>Use to define approvals for Carta Abonatoria</td></tr><td><tr><td><b>SmsApp</b></td><td>-</td><td>Set approval for SMS</td></tr></tbody></table>",
        columns: [
          {
            title: 'Key',
            dataIndex: 'id',
            },
            {
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
            scopedSlots: { customRender: 'name' },
          },
          {
             title: 'Email',
             width: '30%',
             dataIndex: 'email',
            scopedSlots: { customRender: 'email' },
          },
          {
            title: 'Title',
            width: '10%',
            dataIndex: 'title',
            scopedSlots: { customRender: 'titulo' },
          },
          {
            title: 'Application String',
            width: '30%',
            dataIndex: 'aplication',
            scopedSlots: { customRender: 'aplication' },
          },
          {
            title: 'Action',
            width: '10%',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
          },
        ],
      };
    },
    methods: {
      onCellChange(key, dataIndex, value) {
        //console.log(value)
        const dataSource = [...this.dataSource];
        const target = dataSource.find(item => item.id === key);
        if (target) {
            const value_save = value.target.value
            //console.log(value_save);
            target[dataIndex] = value_save;
            this.dataSource = dataSource;
            this.saveRow(key, dataIndex, value_save);

        }
      },
      onDelete(key) {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter(item => item.id !== key);
          //console.log(key);
          this.deleteRow(key);
         
      },
      handleAdd() {
        const { count, dataSource } = this;
          const newData = {
            id: `new_${count}`,
            name: `bayport ${count}`,
            email: `ex@bayport.co.mz ${count}`,
            title: `@mis ${count}`,
            aplication: `@aplication ${count}`,
        };
        this.dataSource = [...dataSource, newData];
        this.count = count + 1;
        },
       deleteRow: function(key) {
        //console.log(key)
        this.loading = true;
        axios.get('v1/myticketapproversdelete', { params: { key: key} })
            .then(response => { this.message = response.data; this.loading = false; })
            .catch(error => { error });
            
       },
       saveRow: function(key, dataIndex, data) {
           this.loading = true;
           axios.get('v1/myticketapproverssave', { params: { key: key, dataIndex: dataIndex, data: data } })
            .then(response => { this.message = response.data; this.loading = false; })
            .catch(error => { error });
            
       }

        },
      mounted () {
        axios
          .get('v1/myticketapproversgetdata')
            .then(response => { (this.dataSource = response.data); this.loading = false;})
      },


  };
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
