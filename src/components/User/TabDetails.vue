<template>
    <a-skeleton :loading="loading" active avatar>
        <a-row :gutter="[8,16]">
            <a-col :span="8">
                <a-avatar style="background-color: #1890ff" :size="250" v-if="detailesData.avatar == 'default.jpg'">
                    <template #icon>
                        <UserOutlined />
                    </template>
                </a-avatar>
                <a-avatar shape="square" :size="250" :src="$baseUrl + 'storage/uploads/avatars/' + detailesData.avatar" style="background-color: #1890ff" v-else>
                </a-avatar>
            </a-col>
            <a-col :span="16">
                <a-row :gutter="[18, 6]">
                    <a-col :span="12">
                        <p><b>{{ $t('name') }}:</b> {{ detailesData.name }}</p>
                        <p><b>{{ $t('last_name') }}:</b> {{ detailesData.lname }}</p>
                        <p><b>{{ $t('last_update')}}:</b> {{ date(detailesData.updatedAt) }}</p>
                        <p><b>{{ $t('title')}}:</b> {{ detailesData.title }}</p>
                        <p><b>{{ $t('phone')}}:</b> {{ detailesData.phone }}</p>
                        <p><b>{{ $t('user_name')}}:</b> {{ detailesData.username }}</p>
                        <p><b>{{ $t('email')}}:</b> {{ detailesData.email }}</p>
                    </a-col>
                
                    <a-col :span="12">
                        <p><b>{{ $t('ticket_notification')}}:</b> {{ detailesData.ticket_notification }}</p>
                        <p><b>{{ $t('login_format')}}:</b> {{ detailesData.logins }}</p>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </a-skeleton>    
</template>

<script>
import moment from 'moment'
import { defineComponent,ref, watch, computed } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
//import Cookies from 'js-cookie'
import i18n from '@/Locale/i18n';
export default defineComponent({
    components:{
        UserOutlined
    },
    props: ['detailesData'],
    created: function () {
        this.moment = moment;
    },
    setup(props){
        const loading = ref(true)
        const userData = computed(() => props.detailesData)
        watch(userData, () => {
            userData.value ? loading.value = false : loading.value = true
        });
        const locale = i18n.global.locale
        let todaysDate = (date) => new Date(date);
        let date = (date) => moment(todaysDate(date)).locale(locale).format("ddd MMM DD, YYYY [at] HH:mm a")
        return {
            todaysDate,
            loading,
            date
        }
    }
})
</script>

<style>

</style>
