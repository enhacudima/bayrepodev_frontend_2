<template>
    <a-popover :title="$t('details')" >
        <template #content>
            <a-list item-layout="horizontal" size="small" class="item">
                <a-list-item key="6" v-if="!showUserFullName">
                    <a-list-item-meta
                    :description="state.fulName"
                    >
                    <template #title>
                        {{ $t('name') }}
                    </template>
                    <template #avatar>
                        <UserOutlined />
                    </template>
                    </a-list-item-meta>
                </a-list-item>
                <a-list-item key="1">
                    <a-list-item-meta
                    :description="state.data.title"
                    >
                    <template #title>
                        {{ $t('title') }}
                    </template>
                    <template #avatar>
                        <AppstoreAddOutlined />
                    </template>
                    </a-list-item-meta>
                </a-list-item>
                <a-list-item key="2">
                    <a-list-item-meta
                    :description="state.data.email"
                    >
                    <template #title>
                        {{ $t('email') }}
                    </template>
                    <template #avatar>
                        <UserOutlined />
                    </template>
                    </a-list-item-meta>
                </a-list-item>

                <a-list-item key="3">
                    <a-list-item-meta
                    :description="state.data.phone"
                    >
                    <template #title>
                        {{ $t('phone') }}
                    </template>
                    <template #avatar>
                        <phone-outlined />
                    </template>
                    </a-list-item-meta>
                </a-list-item>
                <a-list-item key="4" v-if="state.data.branch_name">
                    <a-list-item-meta
                    :description="state.data.branch_name ? state.data.branch_name.outletSyncNameCorrected : ''"
                    >
                    <template #title>
                        {{ $t('branch') }}
                    </template>
                    <template #avatar>
                        <environment-outlined />
                    </template>
                    </a-list-item-meta>
                </a-list-item>
                
                <a-list-item key="5" v-if="state.data.team_name">
                    <a-list-item-meta
                    :description="state.data.team_name ? state.data.team_name.name : ''"
                    >
                    <template #title>
                        {{ $t('team') }}
                    </template>
                    <template #avatar>
                        <TeamOutlined />
                    </template>
                    </a-list-item-meta>
                </a-list-item>
            </a-list>
            <table>
               
            </table>
        </template>
        <a>
            <a-badge :dot="showDotRef" :color="state.data.online == true ? '#87d068' : '#f50'" >
                <a-avatar  :shape="avatarShape ? avatarShape : 'circle'" :size="avatarSize ? avatarSize : 'large'"  style="background-color: #1890ff" v-if="state.data.avatar == 'default.jpg' ||  typeof state.data.avatar == 'undefined'">
                    <template #icon>
                    <UserOutlined />
                    </template>
                </a-avatar>
                <a-avatar :shape="avatarShape ? avatarShape : 'circle'"  :size="avatarSize ? avatarSize : 'large'" :src="$baseUrl + 'storage/uploads/avatars/' + state.data.avatar" style="background-color: #1890ff" v-else> </a-avatar>
            </a-badge>    
            <template v-if="showUserFullName">{{"&nbsp; &nbsp;"+state.fulName }}</template>
        </a>
    </a-popover>
</template>
<script>
import { defineComponent, reactive, onMounted, computed } from 'vue';
import { AppstoreAddOutlined, EnvironmentOutlined, UserOutlined, TeamOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
export default defineComponent({
    components: {
        AppstoreAddOutlined, EnvironmentOutlined, UserOutlined, TeamOutlined, PhoneOutlined
    },
    props: {
        UserIDRef: { type: Number },
        UserDataRef: { type: Object },
        showNameRef: { type: Boolean },
        showDotRef: { type: Boolean },
        avatarSizeRef: { type: String },
        avatarShapeRef: { type: String },
    },
    setup(props) {
        
        const userID = computed(() => props.UserIDRef)
        const UserData = computed(() => props.UserDataRef)
        const showUserFullName = computed(() => props.showNameRef)
        const avatarSize = computed(() => props.avatarSizeRef)
        const avatarShape = computed(() => props.avatarShapeRef)
        const state = reactive({
            data: [],
            fulName: ''
        });
        onMounted(() => {
            if(UserData.value){
                state.data = UserData.value
                state.fulName = UserData.value.name + ' ' + UserData.value.lname
            }
            else
            axios.get('v1/me-by-id/'+ userID.value)
                .then(response => {
                    state.data = response.data.data
                    state.fulName = response.data.data.name + ' ' + response.data.data.lname
                    //console.log(state.data)
                });

        });

        return {
            state,
            showUserFullName,
            avatarSize,
            avatarShape
        };
    },
});
</script>
<style scoped>
.item {
  width: 35vh
}
</style>