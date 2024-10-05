<template>
    <div>
        <a-modal v-model:open="visible" width="1000px" :title="'Edit Role: '+formState.name " :footer="null"
            >
            <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal" @finish="onFinish">
                <a-form-item name="name" label="Name"
                    :rules="[{ required: true, message: 'Please input the name of role!' }]">
                    <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item name="guard_name" label="Guard name"
                    :rules="[{ required: true, message: 'Please input the name of guard name!' }]">
                    <a-select v-model:value="formState.guard_name">
                        <a-select-option value="web">web</a-select-option>
                        <a-select-option value="api">api</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item name="description" label="Description">
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>
                <a-form-item name="permissions" label="Permissions">
                <a-transfer
                    v-model:target-keys="formState.permissions"
                    :data-source="filtered"
                    show-search
                    :filter-option="filterOption"
                    :render="item => item.name.replaceAll('_', ' ').toUpperCase()"
                    :rowKey="item => item.id"  
                    :list-style="{
                    width: '45%',
                    height: '300px',
                    }"
                />
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
import { defineComponent, reactive, ref, onMounted, h, computed } from 'vue';
import axios from 'axios'
import { Modal } from 'ant-design-vue';
import eventBus from '@/Helpers/event-bus'
export default defineComponent({
    setup() {
        const formRef = ref();
        const id = ref();
        const visible = ref(false);
        const mockData = ref([]);
        const formState = reactive({
            name: '',
            description: '',
            permissions: [],
            guard_name: '',
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
            axios.put("/v1/roles/"+id.value, values)
                .then(() => {
                    Modal.success({
                        title: 'Action',
                        content: h('div', {}, [
                            h('p', 'Role updated Successfully'),
                        ]),
                    });
                    formRef.value.resetFields()
                    visible.value =false
                    eventBus.$emit("New-Role-Changed")
                })
                .catch(() => { })
        }
        onMounted(() => {
            axios.get('v1/permissions')
                .then(response => {
                    mockData.value = response.data
                });


        });
        const filtered = computed(() => {
            return mockData.value.filter((e) => e.guard_name == formState.guard_name);
            
        });

        const filterOption = (inputValue, option) => {
            return option.name.indexOf(inputValue) > -1;
        };


  return {
            filtered,
            formState,
            formRef,
            visible,
            onFinish,
            mockData,
            state,
            filterOption,
            resetForm,
            id,
        };
},

});
</script>
<style>
collection-create-form_last-form-item {
    margin-bottom: 0;
}
</style>