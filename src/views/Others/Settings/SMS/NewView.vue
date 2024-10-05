<template>
    <div>
        <a-modal v-model:open="visible" width="1000px"  title="Create a new Fee" :footer="null"
            >
            <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal" @finish="onFinish">
                <a-form-item name="name" label="Name"
                    :rules="[{ required: true, message: 'Please input the name of Fee!' }]">
                    <a-input v-model:value="formState.name" placeholder="Please enter Name" />
                </a-form-item>
                <a-form-item label="Code" name="code" :rules="[{ required: true, message: 'Please choose an Code.' }]">
                    <a-select v-model:value="formState.code">
                        <a-select-option value="200">200 (New Client)</a-select-option>
                        <a-select-option value="201">201 (New Group Client)</a-select-option>
                        <a-select-option value="202">202 (New Saving)</a-select-option>
                        <a-select-option value="203">203 (TR Fee)</a-select-option>
                        <a-select-option value="204">204 (Fixed deposit withdrowal)</a-select-option>
                        <a-select-option value="205">205 (Saving Withdrowal)</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Value Type" name="valueType" :rules="[{ required: true, message: 'Please choose an Code.' }]">
                    <a-select v-model:value="formState.valueType">
                        <a-select-option value="%">Percent (%)</a-select-option>
                        <a-select-option value="Natural">Natural</a-select-option>
                        <a-select-option value="Intervals">Intervals</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Amount" name="amount" :rules="[{ required: true, message: 'Please enter amount.' }]">
                    <a-input type="number" v-model:value="formState.amount" addon-before="ZAR" placeholder="Please enter amount" />
                </a-form-item>
                <a-form-item name="description" label="Description">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">Submit</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
            </a-form-item>

            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { defineComponent, reactive, ref,onMounted,h } from 'vue';
import axios from 'axios'
import { Modal } from 'ant-design-vue';

import eventBus from '@/Helpers/event-bus'
export default defineComponent({
    setup() {
        const formRef = ref();
        const visible = ref(false);
        const formState = reactive({
            name: '',
            description: '',
            code: '',
            amount: '',
            valueType: 'Natural'
        });
        const state = reactive({
        });

        
        const onFinish = () => {
            send(formState)
        };

        const resetForm = () => {
            formRef.value.resetFields();
        };
        function send(values) {
            axios.post("/v1/fees", values)
                .then(() => {
                    Modal.success({
                        title: 'Action',
                        content: h('div', {}, [
                            h('p', 'Fee Created Successfully'),
                        ]),
                    });
                    visible.value =false
                    formRef.value.resetFields()
                    eventBus.$emit("New-Fee-Changed")
                })
                .catch(() => { })
        }
        onMounted(() => {
        });



  return {
            formState,
            formRef,
            visible,
            onFinish,
            state,
            resetForm,
        };
   },

});
</script>
<style>
collection-create-form_last-form-item {
    margin-bottom: 0;
}
</style>