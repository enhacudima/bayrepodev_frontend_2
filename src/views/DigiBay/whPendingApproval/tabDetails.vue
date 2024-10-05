<template><a-row :gutter="[12, 12]">
    <a-col :span="12">
        <p><b>Country:</b> {{ detailesData.Country }}</p>
        <p><b>Application ID:</b> {{ detailesData.Application_ID }}</p>
        <p><b>Last Task Created:</b> {{ detailesData.Last_Task_Created }}</p>
        <p><b>Status:</b> {{ detailesData.Status }}</p>
        <p><b>Task Created By Name:</b> {{ detailesData.Task_Created_By_Name }}</p>
        <p><b>Channel:</b> {{ detailesData.Channel }}</p>
        <p><b>Last Updated:</b> {{ detailesData.Last_Updated }}</p>
        <p><b>Action:</b> {{ detailesData.Action }}</p>
        <p><b>First Name:</b> {{ detailesData.First_Name }}</p>
        <p><b>Surname:</b> {{ detailesData.Surname }}</p>
        <p><b>Father Name:</b> {{ detailesData.Father_Name }}</p>
        <p><b>Mother Name:</b> {{ detailesData.Mother_Name }}</p>
        <p><b>Date Of Birth:</b> {{ detailesData.Date_Of_Birth }}</p>
        <p><b>Mobile Phone Number:</b> {{ detailesData.Mobile_Phone_Number }}</p>
        <p><b>Term:</b> {{ detailesData.Term }}</p>
        <p><b>Instalment:</b> {{ detailesData.Instalment }}</p>
        <p><b>Principal Amount:</b> {{ detailesData.Principal_Amount }}</p>
        <p><b>Cash Disbursement:</b> {{ detailesData.Cash_Disbursement }}</p>
        <p><b>Is OTP Validated:</b> {{ detailesData.Is_OTP_Validated }}</p>
        <p><b>Time Category:</b> {{ detailesData.Time_Category }}</p>
    </a-col>

    <a-col :span="12">
        <p><b>Employer Vote Number:</b> {{ detailesData.Employer_Vote_Number }}</p>
        <p><b>Loan Type:</b> {{ detailesData.Loan_Type }}</p>
        <p><b>NUIT:</b> {{ detailesData.NUIT }}</p>
        <p><b>ID Number:</b> {{ detailesData.ID_Number }}</p>
        <p><b>Passport Number:</b> {{ detailesData.Passport_Number }}</p>
        <p><b>Bank Account Number:</b> {{ detailesData.Bank_Account_Number }}</p>
        <p><b>Reference:</b> {{ detailesData.Reference }}</p>
        <p><b>pep Verification:</b> {{ detailesData.pep_verification }}</p>
        <p><b>Risk Category:</b> {{ detailesData.risk_category }}</p>
        <p><b>Risk Category Mesg:</b> {{ detailesData.risk_category_mesg }}</p>
        <p><b>Risk Score:</b> {{ detailesData.risk_score }}</p>
        <p><b>Verificacao nib:</b> 
            <a-popover v-if="detailesData.verificacao_nib == '1'" >
                <template #content>
                    <p>{{ detailesData.verificacao_msg }}</p>
                </template>
                <check-outlined :style="{ color: '#52c41a' }" /> {{ detailesData.verificacao_msg }}
            </a-popover>
            <span v-else>
                <close-circle-outlined :style="{ color: '#eb2f96' }" /> {{ detailesData.verificacao_msg }}
                
            </span>
        </p>
        <p><b>Start Date:</b> {{ detailesData.start_date }}</p>
        <p><b>End Date:</b> {{ detailesData.end_date }}</p>
        <p><b>Estado:</b> {{ detailesData.estado }}</p>
        <p><b>Motivo:</b> {{ detailesData.motivo }}</p>
        <p><b>Data Carregamento:</b> {{ detailesData.data_carregamento }}</p>
        <p><b>Pedido:</b> {{ detailesData.pedido }}</p>
    </a-col>
</a-row>

</template>

<script>
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
export default {
    components: { CheckOutlined, CloseCircleOutlined },
    props: ['detailesData'],
}
</script>

<style>

</style>
