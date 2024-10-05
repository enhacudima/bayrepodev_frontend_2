<template>
    <a-spin tip="Loading..." :spinning="spinning">
        <a-row>
            <a-col :span="8" :offset="8">
                <a-card size="small" :hoverable="true" :style="{width:'100%', marginTop: '6%'}" title="Change Password">
                    <a-form :model="formState" ref="formRef" name="normal_login" class="login-form" @finish="onFinish">
                        <a-form-item name="current_password"
                            :rules="[{ required: true, message: 'Please input your Current Password!' }]" 
                            :validateStatus="errorStateCurrent" :help="errorMessageCurrent"
                            >
                            <a-input-password v-model:value="formState.current_password" placeholder="Current Password">
                                <template #prefix>
                                    <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input-password>
                        </a-form-item><a-form-item name="new_password"
                            :rules="[{ required: true, message: 'Please input your New password!' }]"
                            :validateStatus="errorState" :help="errorMessage"
                            >
                            <a-input-password v-model:value="formState.new_password" placeholder="New Password">
                                <template #prefix>
                                    <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item name="password_confirmation"
                            :rules="[{ required: true, message: 'Please input password confirmation!' }]"
                            :validateStatus="errorStateConfirm" :help="errorMessageConfirm"
                            
                            >
                            <a-input-password v-model:value="formState.password_confirmation" placeholder="Password Confirmation"
                            >
                                <template #prefix>
                                    <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input-password>
                        </a-form-item>


                        <a-form-item>
                            <a-button block :disabled="disabled" type="primary" html-type="submit"
                                class="login-form-button">
                                Change Password
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-card>
            </a-col>
        </a-row>
    </a-spin>


</template>
<script>
import { defineComponent, reactive, computed, ref,watch } from 'vue';
import {  LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";
import axios from 'axios';
export default defineComponent({
    components: {
        LockOutlined,
    },


    setup() {
        const router = useRouter()
        const formRef = ref();
        const formState = reactive({
            current_password: '',
            new_password: '',
            password_confirmation: '',
        });

        const onFinish = (values) => {
            reset(values)
        };

        
        watch(
            formState,
            () => {
                
                var new_password = formState.new_password;
                var password_confirmation = formState.password_confirmation

                if (new_password !== password_confirmation && password_confirmation.length >= 1) {
                    errorStateConfirm.value = "warning"
                    errorMessageConfirm.value = "Password must match"
                }else{ 
                    errorStateConfirm.value = ""
                    errorMessageConfirm.value = ""
                }

                if (!(new_password.length >= 8 >= 1)) {
                    errorState.value = "warning"
                    errorMessage.value = "Min 8 characters"
                } else if (!(/^(?=.*[!@#*$%&_|])/.test(new_password)) && new_password.length >= 1) {
                    errorState.value = "warning"
                    errorMessage.value = "At least one special character."
                }else if (!(/^(?=.*[a-z])/.test(new_password))&& new_password.length >= 1) {
                    errorState.value = "warning"
                    errorMessage.value = "At least one low letter."
                }else if (!(/^(?=.*[A-Z])/.test(new_password))&& new_password.length >= 1) {
                    errorState.value = "warning"
                    errorMessage.value = "At least one capital letter."
                }else if (!(/^(?=.*[0-9])/.test(new_password))&& new_password.length >= 1) {
                    errorState.value = "warning"
                    errorMessage.value = "At least one number."
                }
                else{ 
                    errorState.value = ""
                    errorMessage.value = ""
                }

            },
        );

        const disabled = computed(() => {
            return !(formState.current_password && formState.new_password && formState.password_confirmation && !(formState.new_password !== formState.password_confirmation && formState.password_confirmation.length >= 1));
        });
        const spinning = ref(false);
        const errorState = ref()
        const errorMessageCurrent =ref()
        const errorMessage = ref()
        const errorMessageConfirm = ref()
        const errorStateCurrent = ref()
        const errorStateConfirm = ref()
        function reset(values) {
            spinning.value = true
            axios.post('/v1/user-password-change', values)
                .then(() => {
                    spinning.value = false
                    router.push("/home");
                })
                .catch(err => {
                    //alert(err)
                    spinning.value = false
                    var status = err.response.status;

                    if (status == 403) {
                        errorState.value = "error"
                        errorMessage.value = err.response.data.error
                    } else if (status == 422) {
                        const errors = err.response.data; 
                        if (errors.errors.error[0]) {
                            errorState.value = "warning"
                            errorMessage.value = err.response.data.errors.error[0]
                        }
                    } 

                });
        }
        return {
            formState,
            onFinish,
            spinning,
            disabled,
            formRef,
            errorState,
            errorMessage,
            errorMessageCurrent,
            errorStateCurrent,
            errorMessageConfirm,
            errorStateConfirm

 
 };
},

});
</script>
<style>
#components-form-demo-normal-login .login-form {
    max-width: 100%;
}

#components-form-demo-normal-login .login-form-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#components-form-demo-normal-login .login-form-forgot {
    margin-bottom: 24px;
}

#components-form-demo-normal-login .login-form-button {
    width: 100%;
}
</style>