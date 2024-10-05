<template>
    <a-form ref="formRef" layout="vertical"  name="dynamic_form_nest_item" :model="dynamicValidateForm" @finish="onFinish">
        <div v-for="(sight, index) in dynamicValidateForm.sights" :key="sight.id" >
            <a-row type="flex"  align="middle">
                <a-col :span="22" :order="1">
                    <a-row type="flex" justify="space-between" align="middle">
                        <a-col :span="3" :order="1">
                            <a-form-item :name="['sights', index, 'relationship']" :label="'Tipo de Relação ' + (index + 1)"
                                :rules="[{ required: true, message: 'Missing relationship' }]">
                                <a-select v-model:value="sight.relationship" :options="relationship" style="width: 100%" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row type="flex"  align="middle">

                        <a-col :span="4" :order="1">
                            <a-form-item :name="['sights', index, 'nationality']" label="Nacionalidade"
                                :rules="[{ required: true, message: 'Missing Nacionalidade' }]">
                                <a-auto-complete v-model:value="sight.nationality" :options="nationality" style="width: 100%" placeholder="Nacionalidade"
                                    :filter-option="filterOption" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="1" :order="2"></a-col>
                        <a-col :span="5" :order="3" v-if="sight.relationship == 'Business'">
                            <a-form-item :name="['sights', index, 'share']" label="Acções"
                                :rules="[{ required: true, message: 'Nº acções ou %' }]">
                                <a-input-number style="width: 100%" v-model:value="sight.share" placeholder="Nº acções ou %" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="1" :order="4"></a-col>
                        <a-col :span="5" :order="5" v-if="sight.relationship == 'Business'">
                            <a-form-item :name="['sights', index, 'amount']" label="Valor estimado"
                                :rules="[{ required: true, message: 'Valor estimado em MZN' }]">
                                <a-input-number style="width: 100%" v-model:value="sight.amount" placeholder="Valor estimado em MZN" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="1" :order="6"></a-col>
                        <a-col :span="5" :order="7" v-if="sight.relationship == 'Business'">
                            <a-form-item :name="['sights', index, 'rCompany']" label="Empresa"
                                :rules="[{ required: false, message: 'Empresa' }]">
                                <a-input v-model:value="sight.rCompany" style="width: 100%" placeholder="Empresa"/>
                            </a-form-item>
                        </a-col>

                        <a-col :span="5" :order="7" v-if="sight.relationship == 'Other'">
                            <a-form-item :name="['sights', index, 'otherRelationship']" :label="'Outro'"
                                :rules="[{ required: true, message: 'Missing area' }]">
                                <a-input v-model:value="sight.otherRelationship" style="width: 100%" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row type="flex" justify="space-between" align="middle">
                        <a-col :span="10" :order="1">
                            <a-form-item :name="['sights', index, 'rName']" :label="'Nome'"
                                :rules="[{ required: true, message: 'Missing area' }]">
                                <a-input v-model:value="sight.rName" style="width: 100%" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" :order="2">
                            <a-form-item :name="['sights', index, 'rSurename']" :label="'Apelido'"
                                :rules="[{ required: true, message: 'Missing area' }]">
                                <a-input v-model:value="sight.rSurename" style="width: 100%" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="5" :order="3">
                            <a-form-item :name="['sights', index, 'rDob']" label="Data de Nascimento" :rules="[{ required: false, message: 'Missing Data de Nascimento' }]">
                                <a-date-picker v-model:value="sight.rDob" value-format="YYYY-MM-DD" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row type="flex" justify="space-between" align="middle">
                        <a-col :span="10" :order="2">
                            <a-form-item :name="['sights', index, 'rSpouseName']" :label="'Nome - Cônjuge'"
                                :rules="[{ required: false, message: 'Missing area' }]">
                                <a-input v-model:value="sight.rSpouseName" style="width: 100%" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" :order="2">
                            <a-form-item :name="['sights', index, 'rSpouseSurename']" :label="'Apelido - Cônjuge'"
                                :rules="[{ required: false, message: 'Missing area' }]">
                                <a-input v-model:value="sight.rSpouseSurename" style="width: 100%" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="5" :order="2">
                            <a-form-item :name="['sights', index, 'rSpouseDob']" label="Data de Nascimento - Cônjuge" :rules="[{ required: false, message: 'Missing Data de Nascimento' }]">
                                <a-date-picker v-model:value="sight.rSpouseDob" value-format="YYYY-MM-DD" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="1" :order="2">
                </a-col>
                <a-col :span="1" :order="3">
                    <MinusCircleOutlined @click="removeSight(sight)" />
                </a-col>
            </a-row>
            <a-divider />
        </div>

        <a-form-item>
            <a-button type="dashed" block @click="addSight" >
                <PlusOutlined />
                Adicionar Relação
            </a-button>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
    </a-form>
</template>
<script>
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref, watch, onMounted } from 'vue';
import EventBus from '@/Helpers/event-bus';
import Cookies from 'js-cookie'
import axios from 'axios';
export default defineComponent({
    components: {
        MinusCircleOutlined,
        PlusOutlined,
    },
    setup() {

        const relationship = [
            {
                label: 'Other',
                value: 'Other',
            },
            {
                label: 'Business',
                value: 'Business',
            }
        ];
        const nationality = ref([]);
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
            Cookies.set('form5', JSON.stringify(values))
            EventBus.$emit("submit-form")
            //var form5 = Cookies.get('form5')
            //console.log('Success:', form5);
            //console.log('Received values of form:', values);
            //console.log('dynamicValidateForm:', dynamicValidateForm);
        };
        const filterOption = (input, option) => {
            return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        };
        const getNationality = () => {
            axios
                .get("https://restcountries.com/v3.1/all")
                .then((response) => {
                    nationality.value = response.data.map(a => ({ value: a.fifa, label: a.name.common }))
                    //console.log(nationality.value);
                });
        };
        onMounted(()=>{
            getNationality()
        })

        return {
            filterOption,
            nationality,
            formRef,
            dynamicValidateForm,
            onFinish,
            removeSight,
            addSight,
            relationship,
            sights,
        };
    },
});
</script>
