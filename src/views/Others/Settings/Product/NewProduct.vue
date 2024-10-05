<template>
    <div>
        <a-modal v-model:open="visible" width="1000px"  title="Create a new Product" :footer="null"
            >
            <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal" @finish="onFinish">
                <a-form-item name="name" label="Name"
                    :rules="[{ required: true, message: 'Please input the name of Fee!' }]">
                    <a-input v-model:value="formState.name" placeholder="Please enter Name" />
                </a-form-item>
                <a-form-item label="Reforce" name="reforce" :rules="[{ required: true, message: 'Please choose one.' }]">
                    <a-select v-model:value="formState.reforce">
                        <a-select-option value="Yes">Yes</a-select-option>
                        <a-select-option value="No">No</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Interval" name="interval" :rules="[{ required: true, message: 'Please choose an Code.' }]">
                    <a-select v-model:value="formState.interval">
                        <!--<a-select-option value="Daily">Daily</a-select-option>
                        <a-select-option value="Weekly">Weekly</a-select-option>
                        <a-select-option value="Quarterly">Quarterly</a-select-option> -->
                        <a-select-option value="Monthly">Monthly</a-select-option>
                        <a-select-option value="Yearly">Yearly</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="'Term (' + formState.interval +')'" name="term" :rules="[{ required: true, message: 'Please enter term.' }]" >
                    <a-input type="term" v-model:value="formState.term" placeholder="Please enter term" />
                </a-form-item>
                <a-form-item label="Code" name="code" :rules="[{ required: true, message: 'Please choose an Code.' }]">
                    <a-select v-model:value="formState.code">
                        <!--<a-select-option value="100">100 (Funeral rate)</a-select-option>
                        <a-select-option value="200">200 (Saving rate)</a-select-option>
                        <a-select-option value="300">300 (Fix deposit rate)</a-select-option>-->
                        <a-select-option value="400">400 (Loan rate)</a-select-option>
                        <!-- <a-select-option value="500">500 (Current Account)</a-select-option> -->
                    </a-select>
                </a-form-item>
                <a-form-item label="Insurance" name="insurance" :rules="[{ required: true, message: 'Please enter insurance.' }]">
                    <a-input type="number" step="any" v-model:value="formState.insurance" placeholder="Please enter insurance" />
                </a-form-item>
                <a-form-item label="Value Type" name="valueType" :rules="[{ required: true, message: 'Please choose an Code.' }]">
                    <a-select v-model:value="formState.valueType">
                        <a-select-option value="%">Percent (%)</a-select-option>
                        <a-select-option value="Natural">Natural</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Value" name="value" :rules="[{ required: true, message: 'Please enter value.' }]">
                    <a-input type="number" step="any" st v-model:value="formState.value" placeholder="Please enter value" />
                </a-form-item>
                <a-form-item label="Days In Arrears (%)" name="daysInArrears" :rules="[{ required: true, message: 'Please enter value.' }]" v-if="formState.code == 400">
                    <a-input type="number" step="any" st v-model:value="formState.daysInArrears" placeholder="Please enter value" />
                </a-form-item>
                <a-form-item label="Min Amount" name="minAmount" :rules="[{ required: true, message: 'Please enter amount.' }]">
                    <a-input type="number" step="any" st v-model:value="formState.minAmount" placeholder="Please enter amount" />
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
import { defineComponent, reactive, ref,onMounted } from 'vue';
import axios from 'axios'

import eventBus from '@/Helpers/event-bus'
export default defineComponent({
    setup() {
        const formRef = ref();
        const visible = ref(false);
        const checkType = ref(false);
        const formState = reactive({
            name: '',
            reforce: 'Yes',
            description: '',
            code: '',
            value: '',
            interval: 'Monthly',
            valueType: '',
            daysInArrears: 0,
            insurance: 0,
            minAmount: 0,
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
            axios.post("/v1/products", values)
                .then(() => {
                    visible.value =false
                    formRef.value.resetFields()
                    eventBus.$emit("New-Products-Changed")
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
            checkType,
        };
   },

});
</script>
<style>
collection-create-form_last-form-item {
    margin-bottom: 0;
}
</style>