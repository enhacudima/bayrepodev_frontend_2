<template>
    <a-modal v-model:open="visible"  width="1000px" :title="$t('new') +' Job'" :footer="null"
            >
    <a-form ref="formRef" :model="form" v-bind="layout" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
                <a-form-item name="date_time" label="Date & Time" v-bind="config" >
                    <a-date-picker
                        v-model:value="form.date_time"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%"
                    />
                </a-form-item>  
                <a-form-item name="notes" :label="$t('note')" :rules="[{ required: true }]" has-feedback>
                    <a-textarea v-model:value="form.notes" :placeholder="$t('note')" />
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
        const config = {
            rules: [{
                type: 'string',
                required: true,
                message: 'Please select time!',
            }],
        };
        const bound_uuid = ref('');
        const activeKey = ref(['1']);
        const formRef = ref();
        const roles = ref();
        const visible = ref(false)
        const branches = ref([])
        
        const form = reactive({
            date_time: '',
            notes: '',
        });
        const onFinish = values => {
            values.bound_uuid = bound_uuid.value
            //console.log(values)
            send(values)
        };
        const resetForm = () => {
            formRef.value.resetFields();
        };

        function send(values) {
            axios.post("/v1/smsboundjob", values)
                .then(response => { 
                    Modal.success({
                        title: 'New Job Saved',
                        content: h('div', {}, [
                            h('p', response.data.name),
                        ]),
                    });
                    visible.value = false
                    eventBus.$emit("bound-Changed")
                    formRef.value.resetFields() 
                })
            .catch(() => { })
        }
        onMounted(() => {      
        });


        return {
            bound_uuid,
            branches,
            form,
            formRef,
            onFinish,
            layout,
            validateMessages,
            resetForm,
            activeKey,
            roles,
            visible,
            config
        };
    },

});
</script>