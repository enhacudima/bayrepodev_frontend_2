<template>
    <div style="">
        <a-form ref="formRef" :model="formState" layout="vertical" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
            <a-form-item name="relationship" label="É familiar ou tem relações de natureza empresarial ou comercial com pessoas que exerçam funções públicas
proeminentes ou cargos de natureza política?" :rules="[{ required: true }]">
                <a-radio-group v-model:value="formState.relationship">
                    <a-radio value="yes">Sim</a-radio>
                    <a-radio value="no">Não</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item name="pepPosition"
                label="Desempenha, ou desempenhou, funções públicas proimenintes ou outros cargos de natureza política?"
                :rules="[{ required: true }]">
                <a-radio-group v-model:value="formState.pepPosition">
                    <a-radio value="yes">Sim</a-radio>
                    <a-radio value="no">Não</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item name="positionName" label="Descreva Função ou Cargo de Naturaza Política" :rules="[{ required: true }]"
                v-if="formState.pepPosition =='yes'">
                <a-input v-model:value="formState.positionName" />
            </a-form-item>
            <a-form-item name="date" label="Data do Formúlario" :rules="[{ required: true }]">
                <a-date-picker v-model:value="formState.date" value-format="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item  style="padding-top: 20px;">
                <a-button type="primary" html-type="submit">Next </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
import EventBus from '@/Helpers/event-bus';
import Cookies from 'js-cookie'
export default defineComponent({
    components :{

    },
    setup() {
        const formRef = ref()
        const layout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const validateMessages = {
            required: '${name} is required!',
            types: {
                email: '${name} is not a valid email!',
                number: '${name} is not a valid number!',
                text: '${name} is not a valid text!',
            },
            number: {
                range: '${name} must be between ${min} and ${max}',
            },
        };
        const formState = reactive({
            declaration: '',
            relationship: '',
            date: '',
            pepPosition: '',
            positionName: '',
        });
        const onFinish = values => {
            if (formState.relationship == 'no' && formState.pepPosition == 'no' ){
                EventBus.$emit("next-form-6")
            }
            else{
                EventBus.$emit("next-form")
            }

            Cookies.set('form1', JSON.stringify(values))
            //var form1 = Cookies.get('form1')
            //console.log('Success:', form1);
        };
        const resetForm = () => {
            formRef.value.resetFields();
        };
        return {
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

