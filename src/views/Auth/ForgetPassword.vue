<template>
  <a-spin tip="Loading..." :spinning="spinning">
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8"  >
        <a-card size="small" :hoverable="true" :style="{width:'100%', marginTop: '6%'}">
          <a-row :style="{width:'100%', marginBottom: '3%'}">
            <a-col :span="5" :offset="9">
              <a-image :style="{width:'100%'}" :src="require('../../assets/logo/motswedi-removebg-preview.png')" />
            </a-col>
          </a-row>
          <a-divider />
          <a-form :model="formState" ref="formRef" name="normal_login" class="login-form" @finish="onFinish">
            <a-form-item name="email" :validateStatus="errorState" :help="errorMessage"
              :rules="[{ required: true, message: 'Please input your Email!', type: 'email'  }]">
              <a-input v-model:value="formState.email" placeholder="Email" >
                <template #prefix>
                  <send-outlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button block :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                Send Reset Link
              </a-button>
                Or
                <a href="/">Login</a>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>


</template>
<script>
import { defineComponent, reactive, computed, ref, onMounted } from 'vue';
import { SendOutlined  } from '@ant-design/icons-vue';
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
import axios from 'axios';
export default defineComponent({
  components: {
    SendOutlined,
  },


  setup() {
    const store = useStore()
    const router = useRouter()
    const formRef = ref();
    const formState = reactive({
      email: '',
    });

    const onFinish = values => {
      send(values)
    };


    const disabled = computed(() => {
      return !(formState.email);
    });
    const spinning = ref(false);
    const errorState = ref()
    const errorMessage = ref()
    onMounted(() => {
      //store.dispatch("clearCookies")

    });
    function send(values) {
      spinning.value = true
      store
        axios.post("v1/reset-password-admin", values)
        .then(() => {
          spinning.value = false
          errorState.value = ""
          errorMessage.value = ""
          router.push( "/reset-password-result");
        })
        .catch(err => {
          console.log(err.code)
          spinning.value = false
          var status = err.response.status;

          if (status == 403) {
            errorState.value = "error"
            errorMessage.value = err.response.data.error
          } else if (status == 422) {
            const errors = err.response.data;
            if (errors.errors.email[0]) {
              errorState.value = "warning"
              errorMessage.value = err.response.data.errors.email[0]
            }
          } else if (status == 429) {
            errorState.value = "warning"
            errorMessage.value = err.response.data.errors.email[0]
          }else if(err.code) {
            errorState.value = "error"
            errorMessage.value = err.message
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
      errorMessage
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