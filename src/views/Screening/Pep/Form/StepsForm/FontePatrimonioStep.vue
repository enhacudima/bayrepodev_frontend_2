<template>
    <div style="">
        <a-form ref="formRef" :model="formState" layout="vertical" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
            <a-form-item name="patrimonio" label="Fonte de Património" :rules="[{  required: true }]">
                <a-checkbox-group v-model:value="formState.patrimonio">
                    <a-row>
                        <a-col :span="8">
                            <a-checkbox value="Emprego" style="line-height: 32px">Emprego</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="Herança" style="line-height: 32px">Herança</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="Empresas" style="line-height: 32px">Empresas</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="Cônjuge" style="line-height: 32px">Cônjuge</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="Parentes" style="line-height: 32px">Parentes</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="Imóveis" style="line-height: 32px">Imóveis</a-checkbox>
                        </a-col>
                        <a-col :span="8">
                            <a-checkbox value="Outra" style="line-height: 32px">Outra</a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-form-item>
            <a-form-item name="pOther" label="Outra Fonte" :rules="[{ required: true }]" v-if="outraRef">
                <a-input v-model:value="formState.pOther" />
            </a-form-item>

            <a-form-item name="pAmount" label="Valor estimado" :rules="[{ type: 'number', required: true }]" style="width: 100%" >
                <a-input-number v-model:value="formState.pAmount" @wheel="$event.target.blur()" addon-before="MZN" />
            </a-form-item>
            <a-form-item name="relationship" label="Tem participações societárias (empresas)?" :rules="[{ required: true }]">
                <a-radio-group v-model:value="formState.relationship">
                    <a-radio value="yes">Sim</a-radio>
                    <a-radio value="no">Não</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item  style="padding-top: 20px;">
                <a-button type="primary" html-type="submit">Next </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { defineComponent, reactive, ref, watch } from 'vue';
import EventBus from '@/Helpers/event-bus';
import Cookies from 'js-cookie'
export default defineComponent({
    components :{

    },
    setup() {
        const formRef = ref()
        const outraRef = ref(false)
        const layout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not a valid email!',
                number: '${label} is not a valid number!',
                text: '${label} is not a valid text!',
            },
            number: {
                range: '${label} must be between ${min} and ${max}',
            },
        };
        const formState = reactive({
            patrimonio: [],
            pOther: '',
            pAmount: '',
        });
        const onFinish = values => {
            EventBus.$emit("next-form")
            Cookies.set('form3', JSON.stringify(values))
            //var form3 = Cookies.get('form3')
            //console.log('Success:', form3);
        };
        const resetForm = () => {
            formRef.value.resetFields();
        };
        watch(() => formState.patrimonio, (val) => {
            outraRef.value = val.indexOf('Outra') >= 0;
        });
        return {
            outraRef,
            resetForm,
            formRef,
            formState,
            onFinish,
            layout,
            validateMessages,
        };
    },
});
</script>
<style scoped>
.steps-content {
    margin-left: 16px;
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}

.steps-action {
    margin-top: 24px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>

