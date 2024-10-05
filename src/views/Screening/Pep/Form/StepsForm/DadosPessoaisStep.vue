<template>
    <div style="">
        <a-form ref="formRef" :model="formState" layout="vertical" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
            <a-form-item name="name" label="Nome" :rules="[{ required: true }]">
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item name="surname" label="Apelido" :rules="[{ required: true }]">
                <a-input v-model:value="formState.surname" />
            </a-form-item>
            <a-form-item name="nationality" label="Nacionalidade" :rules="[{ required: true }]">
                <a-auto-complete v-model:value="formState.nationality" :options="nationality" style="width: 100%"
                    placeholder="Nacionalidade" :filter-option="filterOption" />
            </a-form-item>
            <a-form-item name="idNumber" label="BI " :rules="[{ required: formState.nationality == 'MOZ' ? true : false  }]">
                <a-input v-model:value="formState.idNumber" />
            </a-form-item>
            <a-form-item name="passport" label="Passporte " :rules="[{ required: formState.nationality != 'MOZ' ? true : false }]">
                <a-input v-model:value="formState.passport" />
            </a-form-item>
            <a-form-item name="phoneNumber" label="Telefone" :rules="[{ required: false }]">
                <a-input v-model:value="formState.phoneNumber" />
            </a-form-item>
            <a-form-item name="dob" label="Data de Nascimento" :rules="[{ required: true }]">
                <a-date-picker v-model:value="formState.dob" value-format="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item name="spouseName" label="Cônjuge Nome" :rules="[{ required: false }]">
                <a-input v-model:value="formState.spouseName" />
            </a-form-item>
            <a-form-item name="spouseSurName" label="Cônjuge Apelido" :rules="[{ required: false }]">
                <a-input v-model:value="formState.spouseSurName" />
            </a-form-item>
            <a-form-item name="spouseNationality" label="Cônjuge Nacionalidade" :rules="[{ required: false }]">
                <a-auto-complete v-model:value="formState.spouseNationality" :options="nationality" style="width: 100%"
                    placeholder="Nacionalidade" :filter-option="filterOption" />
            </a-form-item>
            <a-form-item name="dobSpouse" label="Cônjuge Data de Nascimento" :rules="[{ required: false }]">
                <a-date-picker v-model:value="formState.dobSpouse" value-format="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item  style="padding-top: 20px;">
                <a-button type="primary" html-type="submit">Next </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted } from 'vue';
import EventBus from '@/Helpers/event-bus';
import Cookies from 'js-cookie'
import axios from 'axios';
export default defineComponent({
    components :{

    },
    setup() {
        const nationality = ref([]);
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
            name: '',
            dob: '',
            surname: '',
            idNumber: '',
            passport: '',
            phoneNumber: '',
            nationality: '',
            dobSpouse: '',
            spouseName: '',
            spouseSurName: '',
            spouseNationality: '',
        });
        const onFinish = values => {
            EventBus.$emit("next-form")
            Cookies.set('form2', JSON.stringify(values))
            //var form2 = Cookies.get('form2')
            //console.log('Success:', form2);
        };
        const resetForm = () => {
            formRef.value.resetFields();
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
        onMounted(() => {
            getNationality()
        })
        return {
            nationality,
            filterOption,
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

