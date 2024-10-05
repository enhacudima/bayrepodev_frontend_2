<template>
    <a-card title="Loan Simulator" :bordered="true" :style="{ width: '100%', marginTop:'10px'}">
        <a-form ref="formRef" :model="form" name="validate_other" v-bind="formItemLayout" @finish="onFinish">
        <!--    <a-form-item label="Client Name" :rules="[{ required: form.submit_approval, message: 'Please select client!' }]"
                has-feedback name="client" >
                <a-select show-search v-model:value="form.client"  :default-active-first-option="false" label-in-value placeholder="Select Client"
                    style="width: 100%" :filter-option="false" :not-found-content="fetching ? undefined : null"
                    :options="data" @search="fetchUser" allowClear>

                    <template v-if="fetching" #notFoundContent>
                        <a-spin size="small" />
                    </template>
                </a-select>
            </a-form-item>
       
            <a-form-item label="Product" name="product" :rules="[{ required: true, message: 'Please select product!' }]" has-feedback>
                <a-select v-model:value="form.product" allowClear>
                    <a-select-option v-for="(product, key) in products" :key="key" :value="product.uuid">{{product.name}}
                    </a-select-option>
                </a-select>
            </a-form-item>

             -->
            <a-form-item  label="Net Salary" name="salary" :rules="[{ required: true, message: 'Please enter Net Salary!' }]" has-feedback :style="{ width: '100%', marginTop:'24px'}">
                <a-input type="number" @wheel="$event.target.blur()" v-model:value="form.salary" addon-before="MTN"
                    placeholder="Please enter Net Salary" />
            </a-form-item>
            <a-form-item label="Submit for approval" name="submit_approval" v-if="form.product">
                <a-switch v-model:checked="form.submit_approval" checked-children="Yes" un-checked-children="No" />
            </a-form-item>
            <a-form-item name="notes" label="Notes" :style="{ width: '100%', marginTop:'24px'}"  v-if="form.submit_approval" >
                <a-textarea v-model:value="form.notes" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
                <a-button type="primary"  html-type="submit">{{ form.submit_approval == true ? 'Submit' : 'Simulator' }}</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
                <a-button style="margin-left: 10px" type="primary" @click="onPrint()">
                    <template #icon>
                    <PrinterOutlined />
                    </template>
                    Download
                </a-button>
            </a-form-item>
        </a-form>
        <a-divider dashed />
        <!--<a-row :gutter="24">
            <a-col :span="12" :offset="0" v-if="form.product">
                <a-card hoverable size="small">
                    <p><b>Signature:</b> {{productsDetails.name}}</p>
                    <p><b>Code:</b> {{productsDetails.code}}</p>
                    <p><b>Insurance:</b> {{ new Intl.NumberFormat().format(productsDetails.insurance * 12) }} (Annual)</p>
                    <p><b>Interval:</b> {{productsDetails.interval}}</p>
                    <p><b>Term:</b> {{productsDetails.term}}</p>
                    <p><b>Rate:</b> {{ new Intl.NumberFormat().format(productsDetails.value / 12) }}{{productsDetails.value_type}} (Annual)</p>
                    <p><b>Description:</b> {{productsDetails.description}}</p>
                </a-card>
            </a-col>
            <a-col :span="9" :offset="2" v-if="loanDetails">
                <a-card hoverable size="small">
                    <p><b>Monthly payment:</b> {{ new Intl.NumberFormat().format(loanDetails.instalment) }}</p>
                    <p><b>Total insurance:</b> {{ new Intl.NumberFormat().format(loanDetails.total_insurance) }}</p>
                    <p><b>Total interest:</b> {{ new Intl.NumberFormat().format(loanDetails.totalInterest) }}</p>
                    <p><b>Total cost of loan:</b> {{ new Intl.NumberFormat().format(loanDetails.totalCost) }}</p>
                    <a-divider dashed />
                    <p><b>Total settlement :</b> {{ new Intl.NumberFormat().format(loanDetails.old_loan_amount) }}</p>
                    <p><b>Total issued cash:</b> {{ new Intl.NumberFormat().format(loanDetails.issued_cash) }}</p>
                </a-card>
            </a-col>
        </a-row>-->
        <dates :style="{ width: '100%', marginTop:'24px'}" ref="datesDate" />

    </a-card>
</template>
<script>
import { defineComponent, reactive, toRefs,/* watch, */ref, /*onMounted,*/ inject } from 'vue';
//import { debounce } from 'lodash-es'
import { PrinterOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import dates from "./LoansView.vue";
export default defineComponent({
    components: {
        dates,
        PrinterOutlined
    },

    setup() {
        const webApi = inject('baseUrl')
        //let lastFetchId = 0;
        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        };
        const products = ref([]);
        const productsDetails = ref([]);
        const loanDetails = ref();
        const datesDate = ref();
        //const productType = ref(400);

        const state = reactive({
            data: [],
            value: [],
            fetching: false,
        });
        const formRef = ref();
        const form = reactive({
            'client': [],
            'product': '',
            'notes': '',
            'salary': '',
            'submit_approval': false,
            'other_deduction':0
        });

        const onFinish = values => {
            values.other_deduction = 0
            send(values)
        };

        const resetForm = () => {
            formRef.value.resetFields();
        };
        /*const fetchUser = debounce(value => {
            //console.log('fetching user', value);
            lastFetchId += 1;
            const fetchId = lastFetchId;
            state.data = [];
            state.fetching = true;
            axios.get('v1/clients/find/' + value)
                .then(response => {
                    if (fetchId !== lastFetchId) {
                        // for fetch callback order
                        return;
                    }
                    const data = response.data.map(client => ({
                        label: `${client.first_names} ${client.surname} - ID ${client.client_id}`,
                        value: client.uuid,
                    }));
                    state.data = data;
                    state.fetching = false;
                });
        }, 300);

        watch(state.value, () => {
            state.data = [];
            state.fetching = false;
        });
        */

        /*watch(form, (val) => {
            if (val.product)
            axios.get('v1/products/' + val.product)
                .then(response => {
                    productsDetails.value = response.data
                });
        });*/

        function send(values) {
            axios.post("/v1/loan-simulator-salary", values)
                .then(response => {
                    datesDate.value.loading = true
                    //loanDetails.value = response.data
                    datesDate.value.dataSource = response.data
                    console.log(response.data)
                    datesDate.value.loading = false
                    if (values.submit_approval == true)
                        resetForm()
                })
                .catch(() => { })
        }
        /*onMounted(() => {
            axios.get('v1/products-list/' + productType.value)
                .then(response => {
                    products.value = response.data
                });

        })*/

        const onPrint = (() =>{
            goToPDF()
        })

        function goToPDF() {
            window.open(webApi + "payment-plan-non-pdf-stream/account/" + form.product + "/" + form.amount, '_blank')
        }

        return {
            onFinish,
            //formRef,
            form,
            resetForm,
            formItemLayout,
            ...toRefs(state),
            //fetchUser,
            products,
            productsDetails,
            loanDetails,
            datesDate,
            onPrint
        };
    },

});
</script>