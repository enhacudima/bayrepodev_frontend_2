<template>
    <div>
        <a-modal v-model:open="visible" :title="'Create a new XML: ' + bulk" ok-text="Create" cancel-text="Cancel"
            @ok="onOk">
            <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
                <a-form-item name="title" label="Title"
                    :rules="[{ required: true, message: 'Please input the title of collection!' }]">
                    <a-input v-model:value="formState.title" />
                </a-form-item>
                <a-form-item name="range" label="Range (Min 750K)"
                    :rules="[{ required: true, message: 'Please input the range!' }]">
                    <a-slider v-model:value="formState.range" tooltipVisible range :min="min" :max="max"
                        :step="(max-min) /10" />
                </a-form-item>
                <a-form-item name="description" label="Description">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { defineComponent, reactive, ref, watch, h } from 'vue';
import { Modal, notification } from 'ant-design-vue';
import axios from 'axios'
export default defineComponent({
    props: {
        bulk: String,
    },

    setup(props) {
        const formRef = ref();
        const min = ref(0);
        const max = ref(0);
        const visible = ref(false);
        const formState = reactive({
            title: '',
            description: '',
            cons_dis_bulk: '',
            range: [750000,999999999],
        });
        watch(props, (currentValue) => {
            formState.cons_dis_bulk = currentValue.bulk
        });

        const onOk = () => {
            formRef.value.validateFields().then(() => {
               send(formState)
                visible.value = false;
            })
        };

        function send(values) {
            axios.post("/v1/baylend-xml-genarete", values)
                .then(() => {
                    Modal.success({
                        title: 'Creating XML ..',
                        content: h('div', {}, [
                            h('p', 'Your request is on queue.'),
                        ]),
                    });
                    formRef.value.resetFields();
                })
                .catch( e => {
                    if (isset(() => e.response.status) ) {
                        if (e.response.status == 422) {
                            composerMessage(e.response.data.errors)
                        }else{
                            openNotification('error', 'Error.', 'Internal error.' )
                        }
                    }else{
                        Modal.error({
                            title: 'Error on creating XML',
                            content: h('div', {}, [
                                h('p', 'Unable to process your request.'),
                            ]),
                        });
                    }

                })
        }

        function isset(accessor) {
            try {
                // Note we're seeing if the returned value of our function is not
                // undefined or null
                return accessor() !== undefined && accessor() !== null
            } catch (e) {
                // And we're able to catch the Error it would normally throw for
                // referencing a property of undefined
                return false
            }
        }

        function composerMessage(params) {
            for (let [key, value] of Object.entries(params)) {
                openNotification('error', 'The given data was invalid.', `${text(key)}: ${value}`)
            }
        }
        function text(params) {
            return params.replaceAll('_', ' ').toUpperCase();
        }

        function openNotification (type, m, d) {
            notification.config({
                placement: 'topRight',
                top: 60,
                duration: 8,
            });
            notification[type]({
                message: m,
                description: d,
            });
        }


        return {
            formState,
            formRef,
            visible,
            onOk,
            min,
            max
        };
    },

});
</script>
<style>
.collection-create-form_last-form-item {
    margin-bottom: 0;
}
</style>
