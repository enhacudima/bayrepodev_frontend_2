<template>
    <a-modal v-model:open="visible"  width="1000px" :title="$t('new') +' '+$t('template')" :footer="null"
            >
    <a-form ref="formRef" :model="form" v-bind="layout" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
                <a-form-item name="name" :label="$t('name')" :rules="[{ required: true }]"  has-feedback>
                    <a-input v-model:value="form.name" :placeholder="$t('unique')" />
                </a-form-item>  
                <a-form-item name="content" :label="$t('content')" :rules="[{ required: true }]" has-feedback>
                    <a-textarea v-model:value="form.content" :placeholder="$t('smsContent')+'{ client_name }'" />
                </a-form-item>
            <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
                <a-button type="primary" html-type="submit">{{ $t('submit')}}</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">{{ $t('reset') }}</a-button>
            </a-form-item>
    </a-form>
    </a-modal>
</template>
<script>
import { defineComponent, reactive, ref, h, onMounted } from 'vue';
import { Modal } from 'ant-design-vue';
import axios from 'axios'
import eventBus from '@/Helpers/event-bus';
export default defineComponent({
    setup() {
        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        };

        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not a valid email!',
                number: '${label} is not a valid number!',
            },
            number: {
                range: '${label} must be between ${min} and ${max}',
            },
        };
        const activeKey = ref(['1']);
        const formRef = ref();
        const roles = ref();
        const visible = ref(false)
        const branches = ref([])
        const form = reactive({
            name: '',
            content: '',
        });
        const onFinish = values => {
            send(values)
        };
        const resetForm = () => {
            formRef.value.resetFields();
        };

        function send(values) {
            axios.post("/v1/SmsBoundTemplate", values)
                .then(response => { 
                    Modal.success({
                        title: 'New SMS Template Saved',
                        content: h('div', {}, [
                            h('p', response.data.name),
                        ]),
                    });
                    visible.value = false
                    eventBus.$emit("New-SmsBoundTemplate-Changed")
                    formRef.value.resetFields() 
                })
            .catch(() => { })
        }
        onMounted(() => {      
        });


        return {
            branches,
            form,
            formRef,
            onFinish,
            layout,
            validateMessages,
            resetForm,
            activeKey,
            roles,
            visible
        };
    },

});
</script>