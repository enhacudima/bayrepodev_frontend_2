<template>
    <div>
        <a-modal v-model:open="visible" width="1000px" :title="name+'`s Roles'" :footer="null"
            >
            <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal" @finish="onFinish">
                <a-form-item name="roles" label="Roles">
                <a-transfer
                    v-model:target-keys="formState.roles"
                    :data-source="mockData"
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
            roles: [],
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
            axios.put("/v1/user-roles/"+user_id.value, values)
                .then(() => {
                    formRef.value.resetFields()
                    visible.value =false
                    user_id.value = ''
                    eventBus.$emit("New-Role-Changed")
                })
                .catch(() => { })
        }
        onMounted(() => {
            axios.get('v1/roles')
                .then(response => {
                    mockData.value = response.data.data
                });
        });

        watch(
            visible,
            () => {    
                if (visible.value == true) {
                    axios.get('v1/user-roles/' + user_id.value)
                    .then(response => {
                        formState.roles = transform(response.data)
                    }); 
                }    
            },

        );
        
        const transform = (data) =>{
            var t =[]
            data.forEach(el => {
                return t.push(el.id)
            });
            return t;
        }

        const filterOption = (inputValue, option) => {
            return option.name.indexOf(inputValue) > -1;
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