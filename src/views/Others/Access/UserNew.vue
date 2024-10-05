<template>
    <a-modal v-model:open="visible"  width="1000px" :title="'New User'" :footer="null"
            >
    <a-form ref="formRef" :model="form" v-bind="layout" name="nest-messages" :validate-messages="validateMessages"
            @finish="onFinish">
            <a-collapse v-model:activeKey="activeKey" :style="{ marginBottom: '24px' }">
                <a-collapse-panel key="1" header="User Info">
                    <a-form-item name="name" label="Name" :rules="[{ required: true }]" has-feedback>
                        <a-input v-model:value="form.name" />
                    </a-form-item>
                    <a-form-item name="lname" label="Last Name" :rules="[{ required: true }]" has-feedback>
                            <a-input v-model:value="form.lname" />
                    </a-form-item>
                    <a-form-item name="email" label="Email" :rules="[{ type: 'email', required: true }]" has-feedback>
                        <a-input v-model:value="form.email" />
                    </a-form-item>
                    <a-form-item name="branch" label="Branch" has-feedback
                        :rules="[{ required: true, message: 'Please select Branch!' }]">
                        <a-select v-model:value="form.branch" placeholder="Branch">
                            <a-select-option :value="branch.id_agencia" v-for="(branch, key) in branches" :key="key"> {{ branch.outletSyncNameCorrected }} - {{ branch.province.name }} </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item name="logins" label="Login Type" has-feedback
                        :rules="[{ required: true, message: 'Please select login type!' }]">
                        <a-select v-model:value="form.logins" placeholder="Login Type">
                            <a-select-option value="default">default</a-select-option>
                            <a-select-option value="multiple">multiple</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item name="username" label="Username" has-feedback>
                        <a-input v-model:value="form.username" />
                    </a-form-item>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="Contact">
                    <a-form-item label="Mobile Number" :rules="[{ required: true, message: 'Please type Mobile Number!' }]"
                        has-feedback name="phone">
                        <a-input type="number" v-model:value="form.phone" placeholder="Mobile Number" />
                    </a-form-item>
                </a-collapse-panel>
                <a-collapse-panel key="3" header="Details" >
                    <a-form-item name="title" label="Title" has-feedback
                        :rules="[{ required: true, message: 'Please select Title!' }]"
                        :style="{ width: '100%', marginTop: '20px' }">
                        <a-select v-model:value="form.title" placeholder="Title">
                            <a-select-option v-for="(role, index) in roles"  :key="index" :value="role.name">{{ role.name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item name="notes" label="Notes" has-feedback>
                        <a-textarea v-model:value="form.notes" />
                    </a-form-item>
                </a-collapse-panel>
            </a-collapse>
            <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
                <a-button type="primary" html-type="submit">Submit</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
            </a-form-item>
    </a-form>
    </a-modal>
</template>
<script>
import { defineComponent, reactive, ref, h, onMounted } from 'vue';
import { Modal } from 'ant-design-vue';
import axios from 'axios'
import eventBus from '@/Helpers/event-bus'
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
            lname: '',
            email: '',
            branch: '',
            referral: '',
            phone: '',
            username: '',
            title: '',
            notes: '',
            logins: '',
        });
        const onFinish = values => {
            send(values)
        };
        const resetForm = () => {
            formRef.value.resetFields();
        };

        function send(values) {
            axios.post("/v1/users", values)
                .then(response => { 
                    Modal.success({
                        title: 'User Password',
                        content: h('div', {}, [
                            h('p', response.data.password),
                        ]),
                    });
                    visible.value = false
                    eventBus.$emit("New-User-Changed")
                    formRef.value.resetFields() })
            .catch(() => { })
        }
        onMounted(() => {
            axios.get('v1/roles')
                .then(response => {
                    roles.value = response.data.data
                });
            
            axios.get('v1/branches')
                .then(response => {
                    branches.value = response.data
                });       
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