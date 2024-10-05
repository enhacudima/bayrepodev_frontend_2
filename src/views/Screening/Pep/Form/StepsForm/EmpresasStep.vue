<template>
    <a-form ref="formRef" layout="vertical"  name="dynamic_form_nest_item" :model="dynamicValidateForm" @finish="onFinish">
        <div v-for="(sight, index) in dynamicValidateForm.sights" :key="sight.id" style="display: flex ">
            <a-row type="flex"  justify="space-between"  align="middle">
                <a-col :span="6" :order="1">
                    <a-form-item :name="['sights', index, 'name']" :label="'Nome da empresa ' + (index+1) "
                        :rules="[{ required: true, message: 'Missing area' }]">
                        <a-input v-model:value="sight.name" style="width: 100%" />
                    </a-form-item>
                </a-col>
                <a-col :span="6" :order="2">
                    <a-form-item :name="['sights', index, 'type']" label="Area de atuação"
                        :rules="[{ required: true, message: 'Missing area' }]">
                        <a-select v-model:value="sight.type" :options="areas" style="width: 100%" />
                    </a-form-item>
                </a-col>
                <a-col :span="3" :order="3">
                    <a-form-item :name="['sights', index, 'number']" label="Nº de Registo"
                        :rules="[{ required: true, message: 'Missing area' }]">
                        <a-input v-model:value="sight.number" style="width: 100%" />
                    </a-form-item>
                </a-col>
                <a-col :span="3" :order="4">
                    <a-form-item :name="['sights', index, 'share']" label="Acções"
                        :rules="[{ required: true, message: 'Nº acções ou %' }]">
                        <a-input-number style="width: 100%" v-model:value="sight.share" placeholder="Nº acções ou %" />
                    </a-form-item>
                </a-col>
                <a-col :span="3" :order="5">
                    <a-form-item :name="['sights', index, 'amount']" label="Valor estimado"
                        :rules="[{ required: true, message: 'Valor estimado em MZN' }]">
                        <a-input-number style="width: 100%" v-model:value="sight.amount" placeholder="Valor estimado em MZN" />
                    </a-form-item>
                </a-col>
                <a-col :span="1" :order="6"><MinusCircleOutlined @click="removeSight(sight)" /></a-col>
            </a-row>
        </div>

        <a-form-item>
            <a-button type="dashed" block @click="addSight" >
                <PlusOutlined />
                Adicionar Empresa
            </a-button>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit">Next</a-button>
        </a-form-item>
    </a-form>
</template>
<script>
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref, watch } from 'vue';
import EventBus from '@/Helpers/event-bus';
import Cookies from 'js-cookie'
export default defineComponent({
    components: {
        MinusCircleOutlined,
        PlusOutlined,
    },
    setup() {
        const areas = [
        {
            label: 'Agriculture, forestry, fishing, and hunting',
            value: 'Agriculture, forestry, fishing, and hunting',
        }, {
            label: 'Mining, quarrying, and oil and gas extraction',
            value: 'Mining, quarrying, and oil and gas extraction',
        }, {
                label: 'Utilities',
                value: 'Utilities',
        }
        , {
            label: 'Construction',
            value: 'Construction',
        }
        , {
            label: 'Manufacturing',
            value: 'Manufacturing',
        }
        , {
            label: 'Wholesale trade',
            value: 'Wholesale trade',
        },
        {
            label: 'Retail trade',
            value: 'Retail trade',
        }, {
            label: 'Transportation and warehousing',
            value: 'Transportation and warehousing',
        }, {
            label: 'Information and cultural industries ',
            value: 'Information and cultural industries ',
        }
        , {
            label: 'Finance and insurance',
            value: 'Finance and insurance',
        }
        , {
            label: 'Real estate and rental and leasing',
            value: 'Real estate and rental and leasing',
        }
        , {
            label: 'Professional, scientific and technical services',
            value: 'Professional, scientific and technical services',
        },
        {
            label: 'Management of companies and enterprises',
            value: 'Management of companies and enterprises',
        }, {
            label: 'Administrative and support, waste management, and remediation services',
            value: 'Administrative and support, waste management, and remediation services',
        }, {
            label: 'Educational services',
            value: 'Educational services',
        }
        , {
            label: 'Health care and social assistance',
            value: 'Health care and social assistance',
        }
        , {
            label: 'Arts, entertainment, and recreation',
            value: 'Arts, entertainment, and recreation',
        }
        , {
            label: 'Accommodation and food services',
            value: 'Accommodation and food services',
        },
            {
            label: 'Other services (except public administration)',
            value: 'Other services (except public administration)',
        },
         {
            label: 'Public administration',
            value: 'Public administration',
        }
    ];
        const sights = {
            Beijing: ['Tiananmen', 'Great Wall'],
            Shanghai: ['Oriental Pearl', 'The Bund'],
        };
        const formRef = ref();
        const dynamicValidateForm = reactive({
            sights: [],
            area: undefined,
        });
        watch(() => dynamicValidateForm.area, () => {
            dynamicValidateForm.sights = [];
        });
        const removeSight = item => {
            let index = dynamicValidateForm.sights.indexOf(item);
            if (index !== -1) {
                dynamicValidateForm.sights.splice(index, 1);
            }
        };
        const addSight = () => {
            dynamicValidateForm.sights.push({
                value: undefined,
                price: undefined,
                id: Date.now(),
            });
        };
        const onFinish = values => {

            EventBus.$emit("next-form")
            Cookies.set('form4', JSON.stringify(values))
            //var form4 = Cookies.get('form4')
            //console.log('Success:', form4);

            //console.log('Received values of form:', values);
            //console.log('dynamicValidateForm:', dynamicValidateForm);
        };
        return {
            formRef,
            dynamicValidateForm,
            onFinish,
            removeSight,
            addSight,
            areas,
            sights,
        };
    },
});
</script>
