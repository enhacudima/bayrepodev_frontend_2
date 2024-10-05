<template>
    <a-input-search v-model:value="searchValue" placeholder="Search here" @search="onSearch" :loading="loading"
        enter-button :style="{ marginBottom: '24px', width: '500px' }" />
    <a-table :columns="columns" :row-key="record => record.id" :data-source="tableData" :loading="loading"
        :scroll="{ x: 1500, y: 600 }">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'id'">
                <span>
                    <a @click="detailes(record)"> <eye-outlined :style="{ color: '#52c41a' }" /> {{ text }} </a>
                </span>
            </template>
            <template v-if="column.dataIndex === 'name'">
                <span>
                    <a-tag :color="'green'">
                        {{ record.dados.name }}
                    </a-tag>
                </span>
            </template>
            <template v-if="column.dataIndex === 'surname'">
                <span>
                    <a-tag :color="'green'">
                        {{ record.dados.surname }}
                    </a-tag>
                </span>
            </template>
            <template v-else-if="column.dataIndex === 'actions'">
                <div class="demo-dropdown-wrap" v-if="record.status == 1">
                    <a-dropdown-button type="primary">
                        Action
                        <template #overlay>
                            <a-menu>
                                <a-menu-item key="2">
                                    <a-popconfirm title="Sure to add to AML this record?"
                                        @confirm="onAML(record)">
                                        <a-button type="primary" small>Add AML</a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown-button>
                </div>
                <a-popconfirm title="Sure to Remove from AML this record?" v-if="record.status == 2"
                    @confirm="onRemoveAML(record)">
                    <close-circle-outlined :style="{ color: '#eb2f96' }" />
                </a-popconfirm>
            </template>
        </template>
    </a-table>
    <a-modal v-model:open="visible" v-if="visible"
        :title="detailesData.id + ' - ' + detailesData.dados.name + ' ' + detailesData.dados.surname" :footer="null" width="1000px">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="Declaração">
                <p><b>Data:</b> {{ detailesData.date }}</p>
                <p><b>PeP:</b> {{ detailesData.pepPosition }}</p>
                <p><b>Cargo:</b> {{ detailesData.positionName }}</p>
                <p><b>Relaxão PeP:</b> {{ detailesData.relationship }}</p>
                <p><b>Ultima Atualização:</b> {{ dataTimeFormat(detailesData.updated_at) }}</p>
                <p><b>Criado Por:</b> {{ detailesData.user.name }} {{ detailesData.user.lname }}</p>
                <p><b>Balcão:</b> {{ detailesData.user.branch_name.outletSyncNameCorrected }}</p>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Dados Pessoais" force-render>
                <p><b>Nome:</b> {{ detailesData.dados.name }}</p>
                <p><b>Apelido:</b> {{ detailesData.dados.surname }}</p>
                <p><b>DN:</b> {{ detailesData.dados.dob }}</p>
                <p><b>Apelido:</b> {{ detailesData.dados.surname }}</p>
                <p><b>Nacionalidade:</b> {{ detailesData.dados.nationality }}</p>
                <p><b>Passport:</b> {{ detailesData.dados.passport }}</p>
                <p><b>BI:</b> {{ detailesData.dados.idNumber }}</p>
                <p><b>Cônjuge Nome :</b> {{ detailesData.dados.spouseName }}</p>
                <p><b>Cônjuge Apelido:</b> {{ detailesData.dados.spouseSurName }}</p>
                <p><b>Cônjuge Nacionalidade:</b> {{ detailesData.dados.spouseNationality }}</p>
                <p><b>Cônjuge DN:</b> {{ detailesData.dados.dobSpouse }}</p>
            </a-tab-pane>
            <a-tab-pane key="3" tab="Fonte de Patrimônio">
                <p><b>Estimativa:</b> {{ detailesData.fonte.pAmount }}</p>
                <p><b>Outra Fonte:</b> {{ detailesData.fonte.pOther }}</p>
                <p><b>Fontes:</b></p>
                <div v-for="fonte, key in detailesData.fonte.patrimonio" :key="key">
                    <a-tag color="green">{{ fonte }}</a-tag>
                </div>
            </a-tab-pane>
            <a-tab-pane key="4" tab="Empresas">
                <div  v-for="empresa, key in detailesData.empresas" :key="key">
                    <a-divider orientation="left">{{ ++key }} - {{ empresa.name }}</a-divider>
                    <p><b> Estimativa:</b> {{ empresa.amount }}</p>
                    <p><b> Registro:</b> {{ empresa.number }}</p>
                    <p><b> Acções:</b> {{ empresa.share }}</p>
                    <p><b> Ramo de Atuação:</b> {{ empresa.type }}</p>
                </div>
            </a-tab-pane>
            <a-tab-pane key="5" tab="Relações">
                <div v-for="relacao, key in detailesData.relacao" :key="key">
                    <a-divider orientation="left">{{ ++key }} - {{ relacao.rName }} {{ relacao.rSurename }}</a-divider>
                    <p><b> Relação:</b> {{ relacao.relationship }}</p>
                    <p><b> Outro tipo de Relação:</b> {{ relacao.otherRelationship }}</p>
                    <p><b> DN:</b> {{ relacao.rDob }}</p>
                    <p><b> Nacionalidade:</b> {{ relacao.nationality }}</p>
                    <p><b> Estimativa:</b> {{ relacao.amount }}</p>
                    <p><b> Empresa:</b> {{ relacao.rCompany }}</p>
                    <p><b> Acções:</b> {{ relacao.share }}</p>

                    <p><b> Cônjuge Nome:</b> {{ relacao.rSpouseName }}</p>
                    <p><b> Cônjuge Apelido:</b> {{ relacao.rSpouseSurename }}</p>
                    <p><b> Cônjuge Data de DN:</b> {{ relacao.rSpouseDob }}</p>
                </div>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>
<script>
import axios from 'axios';
import { defineComponent, reactive, ref, onMounted } from 'vue';
import {    CloseCircleOutlined, EyeOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
export default defineComponent({
    components: {
        CloseCircleOutlined,
        EyeOutlined
    },
    setup() {
        /*const onChange = (pagination, filters, sorter) => {
            //console.log('params', pagination, filters, sorter);
        };*/
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                fixed: 'left',
                width: 150,
                sorter: (a, b) => a.id - b.id,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Cargo',
                dataIndex: 'positionName',
                width: 100,
            },
            {
                title: 'Data',
                dataIndex: 'date',
                width: 100,
            },

            {
                title: 'Nome',
                dataIndex: 'name',
                width: 100,
            },
            {
                title: 'Apelido',
                dataIndex: 'surname',
                width: 100,
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                width: 100,
            },
        ];
        const formRef = ref();
        const searchValue = ref('');
        const form = reactive({
            description: '',
            fileList: [],
            loanData: [],

        });
        const resetForm = () => {
            formRef.value.resetFields();
        };
        const rules = {
            description: [{
                required: true,
                message: 'Please enter description',
            }],
            fileList: [{
                required: true,
                message: 'Please select file',
            }],
        }

        const onFinish = () => {
           // send(form)
        };
        const dataSource = ref([]);
        const loading = ref(false);
        const visible = ref(false);
        const visibleAMl = ref(false);
        const detailesData = ref([]);

        const detailes = (data) => {
            visible.value = true
            detailesData.value = data
        }
        const detailesAML = (data) => {
            visibleAMl.value = true
            detailesData.value = data
            form.loanData = data
        }
        const tableData = ref([]);

        const onAML = (data) => {
            axios.post('v1/peps-moz-add-aml', data)
                .then(
                    response => {
                        message.success({
                            content: () => 'The change will be reflected in the next update.',
                            class: 'custom-class',
                            style: {
                                marginTop: '10vh',
                            },
                            duration: 10,
                        }),
                        dataGet(response)
                    }
                )
                .catch(() => {
                    message.error('Error')
                })
        }
        const onRemoveAML = (data) => {
            axios.post('v1/peps-moz-remove-aml', data)
                .then(
                    response => {
                        message.success({
                            content: () => 'The change will be reflected in the next update.',
                            class: 'custom-class',
                            style: {
                                marginTop: '10vh',
                            },
                            duration: 10,
                        }),
                            dataGet(response)
                    }
                )
                .catch(() => {
                    message.error('Error')
                })
        }

        const onSearch = (() => {
            let filter = searchValue.value
            if (!filter.length) return tableData.value = dataSource.value
            loading.value = true
            axios.get('v1/peps-moz/search/' + filter)
                .then(response => {
                    dataSource.value = response.data
                    tableData.value = response.data
                    loading.value = false
                });
        })

        const dataTimeFormat = (d) => {
            var date = format(new Date(d), 'yyyy-MM-dd hh:mm:ss')
            if (date == "NaN-aN-aN") {
                date = "1900-01-01 00:00:00"
            }
            return date;
        };
        function format(x, y) {
            var z = {
                M: x.getMonth() + 1,
                d: x.getDate(),
                h: x.getHours(),
                m: x.getMinutes(),
                s: x.getSeconds()
            };
            y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
                return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
            });

            return y.replace(/(y+)/g, function (v) {
                return x.getFullYear().toString().slice(-v.length)
            });
        }

        function dataGet() {
            dataSource.value.loading = true
            axios.get('v1/pep-form/data')
                .then(response => {
                    dataSource.value = response.data
                    tableData.value = response.data
                    loading.value = false
                });
        }

        onMounted(() => {
            dataGet()
        });

        return {
            activeKey: ref('1'),
            tableData,
            searchValue,
            dataSource,
            onSearch,
            columns: ref(columns),
            loading,
            visible,
            detailes,
            detailesData,
            visibleAMl,
            detailesAML,
            form,
            formRef,
            rules,
            onFinish,
            resetForm,
            dataTimeFormat,
            onRemoveAML,
            onAML
        };
    },
});
</script>
