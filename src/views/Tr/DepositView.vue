<template>
    <a-drawer title="New deposit" :width="720" :visible="visibleDep" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose">
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @finish="onFinish">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Owner Account" name="owner_account">
                        <a-switch v-model:checked="form.owner_account" checked-children="Yes" un-checked-children="No" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16"  v-if="!form.owner_account">
                <a-col :span="24">
                    <a-form-item label="Client Name" name="name">
                        <a-input v-model:value="form.name" placeholder="Please enter client name" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16" v-if="!form.owner_account">
                <a-col :span="24">
                    <a-form-item label="ID Number" name="idNumber">
                        <a-input v-model:value="form.idNumber" placeholder="Please enter client ID" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16" v-if="!last_tr">
                <a-col :span="24">
                    <a-form-item label="Product" name="product" >
                        <a-select v-model:value="form.product">
                            <a-select-option v-for="(product, key) in products" :key="key" :value="product.uuid" >{{product.name}}</a-select-option>
                            <!--fix-->
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Transaction Type" name="typeDep">
                        <a-select v-model:value="form.typeDep">
                            <a-select-option value="Cash">Cash</a-select-option>
                            <a-select-option value="EFT">EFT</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12" v-if="checkType">
                    <a-form-item label="Account" name="account"
                        :rules="[{ required: checkType, message: 'Please choose an account' }]">
                        <a-select v-model:value="form.account">
                            <a-select-option value="1578866698">1578866698</a-select-option>
                            <a-select-option value="1578866698">1578866698</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12" v-if="checkType">
                    <a-form-item label="EFT Reference" name="eftReference"
                        :rules="[{ required: checkType, message: 'Please EFT Reference' }]">
                        <a-input v-model:value="form.eftReference" placeholder="Please enter EFT Reference" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Payment Date" name="dateDep">
                        <a-date-picker v-model:value="form.dateDep" style="width: 100%" value-format="YYYY-MM-DD"
                            :get-popup-container="trigger => trigger.parentElement" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Amount" name="amount">
                        <a-input type="number"  @wheel="$event.target.blur()" v-model:value="form.amount" addon-before="R"
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
                <a-button type="primary" html-type="submit">Submit</a-button>
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
            product: '',
            name: '',
            idNumber: '',
            amount: '',
            owner: '',
            typeDep: '',
            account: '',
            eftReference: '',
            dateDep: null,
            description: '',
            clientUuid:'',
            trType: 1,
            /*
                Account types
                1 funeral
                2 saving
                3 fixed deposit
                4 loan
            */
            accountType:'',
            owner_account: true,

        });
        const checkType = ref(false);
        const productType = ref();
        const last_tr = ref();
        const products = ref([]);

        const resetForm = () => {
            formRef.value.resetFields();
        };
        const rules = {
            owner_account: [{
                required: true,
                message: 'Please select client type',
            }],
            name: [{
                required: true,
                message: 'Please enter client name',
            }],
            idNumber: [{
                required: true,
                message: 'Please enter id number',
            }],
            product: [{
                required: true,
                message: 'Please choose an product',
            }],
            amount: [{
                required: true,
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
            account: [{
                required: checkType.value,
                message: 'Please choose the account',
            }],
            dateDep: [{
                required: true,
                message: 'Please choose the payment date',
            }],
            description: [{
                required: false,
                message: 'Please enter url description',
            }],
        };
        const visibleDep = ref(false);
        const formRef = ref();

        const showDrawer = () => {
            visibleDep.value = true;
        };

        const onClose = () => {
            eventBus.$emit("Drawer-Dep-Changed")
            visibleDep.value = false;
        };

        const onFinish = () => {
            send(form)
        };

        watch(() => form.typeDep, () => {
            if (form.typeDep == 'EFT')
            checkType.value = true
            else
            checkType.value = false
        },);

        watch(() => visibleDep.value, () => {
            if (!last_tr.value)
            axios.get('v1/products-type/' + productType.value)
            .then(response => {
                products.value = response.data
            });
                
        });
        function send(values) {
            axios.post("/v1/tr/deposit", values)
                .then(response => {
                    Modal.success({
                        title: 'Deposit Accepted',
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
            visibleDep,
            showDrawer,
            onClose, 
            onFinish,
            checkType,
            resetForm,
            productType,
            last_tr,
            products,
        };
    },

});
</script>