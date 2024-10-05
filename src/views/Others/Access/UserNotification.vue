<template>
    <div>
        <a-modal v-model:open="visible" width="100%" wrap-class-name="full-modal" :title="name+'`s Notifications'" :footer="null"
            >
            <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal" @finish="onFinish">
                <a-form-item name="notifications" label="Notifications">
                <a-transfer
                    v-model:target-keys="formState.notifications"
                    :data-source="mockData"
                    show-search
                    :filter-option="filterOption"
                    :render="item => item.appname.replaceAll('_', ' ').toUpperCase() +' : '+ item.notificationname.replaceAll('_', ' ').toUpperCase()"
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
import { defineComponent, reactive, ref,onMounted,watch } from 'vue';
import axios from 'axios'
import eventBus from '@/Helpers/event-bus'
export default defineComponent({
    setup() {
        const formRef = ref();
        const name = ref()
        const user_id = ref()
        const visible = ref(false);
        const mockData = ref([]);
        const formState = reactive({
            notifications: [],
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
            axios.put("/v1/user-notifications/"+user_id.value, values)
                .then(() => {
                    formRef.value.resetFields()
                    visible.value =false
                    user_id.value = ''
                    eventBus.$emit("New-Role-Changed")
                })
                .catch(() => { })
        }
        onMounted(() => {
            axios.get('v1/notifications')
                .then(response => {
                    mockData.value = response.data.data
                });
        });

        watch(
            visible,
            () => {    
                if (visible.value == true) {
                    axios.get('v1/user-notifications/' + user_id.value)
                    .then(response => {
                        formState.notifications = transform(response.data)
                    }); 
                }    
            },

        );
        
        const transform = (data) =>{
            var t =[]
            data.forEach(el => {
                return t.push(el.syncnotification_id)
            });
            return t;
        }

        const filterOption = (inputValue, option) => {
            return option.appname.indexOf(inputValue) > -1;
        };



  return {
            formState,
            formRef,
            visible,
            onFinish,
            mockData,
            state,
            filterOption,
            resetForm,
            user_id,
            name
      };
},

});
</script>
<style>
collection-create-form_last-form-item {
    margin-bottom: 0;
}
</style>