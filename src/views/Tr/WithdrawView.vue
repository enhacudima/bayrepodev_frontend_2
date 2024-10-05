<template>
    <a-drawer title="New Withdrawal" :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose">
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @finish="onFinish">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Client Name" name="name">
                        <a-input v-model:value="form.name" placeholder="Please enter client name" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="ID Number" name="idNumber">
                        <a-input v-model:value="form.idNumber" placeholder="Please enter client ID" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Next of kin" name="next_of_kin">
                        <a-switch v-model:checked="form.next_of_kin" checked-children="Yes" un-checked-children="No" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16" v-if="form.next_of_kin">
                <a-col :span="24">
                    <a-form-item label="Next of kin Name" name="next_of_kin_name">
                        <a-input v-model:value="form.next_of_kin_name" placeholder="Please enter client name" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16" v-if="form.next_of_kin">
                <a-col :span="24">
                    <a-form-item label="Next of kin ID Number" name="next_of_kin_id_number">
                        <a-input v-model:value="form.next_of_kin_id_number" placeholder="Please enter client ID" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Transaction Type" name="typeDep">
                        <a-select v-model:value="form.typeDep">
                            <a-select-option value="Total">Total</a-select-option>
                            <a-select-option value="Partial">Partial</a-select-option><!--fix-->
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16" v-if="checkType">
                <a-col :span="24">
                    <a-form-item label="Amount" name="amount"
                        :rules="[{ required: checkType, message: 'Please enter amount' }]">
                        <a-input type="number" v-model:value="form.amount" addon-before="R"
                            placeholder="Please enter amount" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Description" name="description">
                        <a-textarea v-model:value="form.description" :rows="4" placeholder="Please enter description" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item>
                <a-button type="danger" html-type="submit">Request Withdrawal</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
            </a-form-item>
        </a-form>
        <template #extra>
            <a-space>
                <a-button @click="onClose">Cancel</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>
<script>
import { defineComponent, reactive, ref, h, watch } from 'vue'; 
import axios from 'axios'
import { Modal } from 'ant-design-vue';
import eventBus from '@/Helpers/event-bus'
export default defineComponent({
    props:{
       
    },
    components: {
    },

    setup() {
        const form = reactive({
            name: '',
            next_of_kin: false,
            next_of_kin_id_number: '',
            next_of_kin_name:'',
            idNumber: '',
            amount: '',
            owner: '',
            typeDep: '',
            account: '',
            eftReference: '',
            dateDep: null,
            description: '',
            clientUuid:'',
            trType: 2,
            /*
                Account types
                1 funeral
                2 saving
                3 fixed deposit
                4 loan
            */
            accountType:'',

        });
        const checkType = ref(false);

        const resetForm = () => {
            formRef.value.resetFields();
        };
        const rules = {
            name: [{
                required: true,
                message: 'Please enter client name',
            }],
            idNumber: [{
                required: true,
                message: 'Please enter id number',
            }], 
            next_of_kin_name: [{
                required: form.next_of_kin,
                message: 'Please enter client name',
            }],
            next_of_kin_idNumber: [{
                required: form.next_of_kin,
                message: 'Please enter id number',
            }],
            amount: [{
                required: checkType.value,
                message: 'please enter amount',
            }],
            owner: [{
                required: true,
                message: 'Please select an owner',
            }],
            typeDep: [{
                required: true,
                message: 'Please choose the type',
            }],
            description: [{
                required: false,
                message: 'Please enter url description',
            }],
        };
        const visible = ref(false);
        const formRef = ref();

        const showDrawer = () => {
            visible.value = true;
        };

        const onClose = () => {
            eventBus.$emit("Drawer-With-Changed")
            visible.value = false;
        };

        const onFinish = () => {
            send(form)
        };


        watch(() => form.typeDep, () => {
            if (form.typeDep == 'Partial')
                checkType.value = true
            else
                checkType.value = false
        },);

        function send(values) {
            axios.post("/v1/tr/withdrawal", values)
                .then(response => {
                    Modal.success({
                        title: 'Withdrawal Submitted',
                        content: h('div', {}, [
                            h('p', 'Account Id: ' + response.data.account.account_id),
                            h('p', 'TR Id: ' + response.data.tr.tr_id),
                            h('p', 'Amount: ' + response.data.tr.amount),
                            h('p', 'Period: ' + response.data.tr.period),
                        ]),
                    });
                    onClose()
                    formRef.value.resetFields()
                })
                .catch(() => { })
        }
    
        return {
            form,
            formRef,
            rules,
            visible,
            showDrawer,
            onClose, 
            onFinish,
            checkType,
            resetForm,
        };
    },

});
</script>