<template>
  <a-spin tip="Loading..." :spinning="spinning">
    <a-row>
      <a-col :span="8" :offset="8">
        <a-card size="small" :hoverable="true" :style="{width:'100%', marginTop: '6%'}">
          <a-row :style="{width:'100%', marginBottom: '3%'}">
            <a-col :span="5" :offset="9">
              <a-image :style="{width:'100%'}" :src="require('../assets/logo/motswedi-removebg-preview.png')" />
            </a-col>
          </a-row>
          <a-divider />
          <a-form :model="formState" ref="formRef" name="normal_login" class="login-form" @finish="onFinish">
            <a-form-item name="username" :validateStatus="errorState" :help="errorMessage"
              :rules="[{ required: true, message: 'Please input your username!' }]">
              <a-input v-model:value="formState.username" placeholder="Username">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
              <a-input-password v-model:value="formState.password" placeholder="Password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <div class="login-form-wrap">
              <a-tooltip placement="top" title="To reset your password please contact system admin" color="cyan">
                <a class="login-form-forgot">Forgot password</a>
              </a-tooltip>

            </div>

            <a-form-item>
              <a-button block :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                Log in
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>


</template>
<script>
import { defineComponent, reactive, computed, ref, onMounted } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },


  setup() {
    const store = useStore()
    const router = useRouter()
    const formRef = ref();
    const formState = reactive({
      username: '',
      password: '',
      remember: false,
    });

    const onFinish = values => {
      login(values.username, values.password)
    };


    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });
    const spinning = ref(false);
    const errorState = ref()
    const errorMessage = ref()
    onMounted(() => {
      //store.dispatch("clearCookies")

    });
    function login(email, password) {
      spinning.value = true
      store
        .dispatch("login", {
          email: email,
          password: password,
        })
        .then(() => {
          spinning.value = false
          errorState.value = ""
          errorMessage.value = ""
          router.push( "/home");
        })
        .catch(err => {
          console.log(err)
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