<template>
<template></template>
</template>
<script>
import { notification } from 'ant-design-vue';
import { defineComponent } from 'vue';
import EventBus from '../../Helpers/event-bus';
export default defineComponent({
    created() {
        EventBus.$on("notificationM", (data) => {
            this.openNotificationWithIcon(data.color, data.title , data.text, 'topRight')
        });
    },
    methods:{
        openNotificationWithIcon: function (type, m='Error', d, p ='topRight') {
                notification.config({
                    placement: p,
                    top: 60,
                    duration: 5,
                });
                notification[type]({
                    message: m,
                    description: d,
                });
            },
    }

});
</script>