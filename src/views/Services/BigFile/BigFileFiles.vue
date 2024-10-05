<template>
    <a-skeleton active :loading="loading">
        <template v-if="serverFiles != undefined && serverFiles.length">
            <a-row :gutter="20">
                <a-col :span="4" v-for="(item, index) in serverFiles" :key="index">
                    <a-card hoverable small :style="{ marginBottom: '24px' }" >
                        <a-card-meta :title="truncate(item.filename)" >
                            <template #avatar>
                                <a-avatar style="background-color: #91d5ff" shape="square" size="small">
                                    <template #icon>
                                        <file-image-outlined v-if="item.extension === 'jpeg' | item.extension === 'png' | item.extension === 'jpg'" /> 
                                        <file-excel-outlined v-else-if="item.extension === 'xlsx' | item.extension === 'xls'"/> 
                                        <file-outlined v-else-if="item.extension === 'csv'" /> 
                                        <file-pdf-outlined v-else-if="item.extension === 'pdf'"/> 
                                        <file-word-outlined v-else-if="item.extension === 'doc'" />
                                        <file-exclamation-outlined v-else/>
                                    </template>
                                </a-avatar>
                            </template>
                            <template #description>
                                <p><b>Extension: </b> {{ item.extension }}</p>
                                <p><b>Created: </b> {{ dataTimeFormat(item.created_at) }}</p>
                                <p><b>Expires: </b> {{ item.expires_at }}</p>
                            </template>
                        </a-card-meta>
                        <template #actions>
                            <file-exclamation-outlined key="logs" @click="detail(item)" />
                        </template>
                    </a-card>
                </a-col>
            </a-row>
            <br />
        </template>    
        <a-empty  v-else/>
    </a-skeleton>


    <div>
        <a-drawer :title="title" :width="500" placement="right" :closable="false" @close="onClose" :visible="draw"
            :zIndex="1050">
            <a-timeline>
                <a-timeline-item>
                    <b>Details</b>
                    <a-list itemLayout="vertical">

                        <a-list-item>
                            <a-comment>
                                <template #content>
                                    <p>Extension: <i>{{fileDraw.extension}}</i></p>
                                    <p>Created: <i>{{ dataTimeFormat(fileDraw.created_at)}}</i></p>
                                    <p>Expires: <i>{{fileDraw.expires_at}}</i></p>
                                    <p>Name: <i>{{fileDraw.filename}}</i></p>
                                    <p>
                                        <a-button type="primary" :href="$baseUrl+'bigfile/download/'+fileDraw.id" block>
                                            <cloud-download-outlined :style="{fontSize: '20px'}" />
                                        </a-button>
                                    </p>
                                </template>
                            </a-comment>
                        </a-list-item>
                    </a-list>
                </a-timeline-item>
            </a-timeline>

            <a-timeline>
                <a-timeline-item
                    v-if="fileDraw.extension === 'xlsx' | fileDraw.extension === 'xls' | fileDraw.extension === 'csv'">
                    <b>Interaction</b>
                    <a-list itemLayout="vertical">

                        <a-list-item>
                            <a-comment>
                                <template #content>
                                    <template v-for="(item, index) in interaction.interaction" :key="index">
                                        <a-row>
                                            
                                            <a-popconfirm :title="$t('sureToInteract')"  @confirm="onInteraction(item.url, fileDraw.id)">
                                                <a-button type="primary" :style="{  marginTop: '10px'}"
                                                    block>
                                                    <cloud-server-outlined
                                                        :style="{ fontSize: '20px'}" />
                                                    {{item.name}}
                                                </a-button>
                                            </a-popconfirm>
                                        </a-row>
                                    </template>
                                </template>
                            </a-comment>

                        </a-list-item>
                    </a-list>
                </a-timeline-item>
                <a-timeline-item
                        >
                        <b>Post</b>
                        <a-list itemLayout="vertical">

                            <a-list-item>
                                <a-comment>
                                    <template #content>
                                        <template v-for="(item, index) in interaction.post
                                        " :key="index">
                                            <a-row>
                                            
                                                <a-popconfirm :title="$t('sureToInteract')"  @confirm="onInteraction(item.url, fileDraw.id)">
                                                    <a-button type="primary" :style="{ marginTop: '10px' }"
                                                        block>
                                                        <cloud-server-outlined
                                                            :style="{ fontSize: '20px' }" />
                                                        {{ item.name }}
                                                    </a-button>
                                                </a-popconfirm>
                                            </a-row>
                                        </template>
                                    </template>
                                </a-comment>

                            </a-list-item>
                        </a-list>
                    </a-timeline-item>
            </a-timeline>

        </a-drawer>
    </div>
</template>
<script>
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import EventBus from '@/Helpers/event-bus';
    import {
        FileImageOutlined,
        FileExcelOutlined,
        FileExclamationOutlined,
        FileWordOutlined,
        FilePdfOutlined,
        CloudServerOutlined,
        CloudDownloadOutlined,
        FileOutlined
        } from '@ant-design/icons-vue';
    import axios from 'axios';
    export default defineComponent({
    components: {
        FileImageOutlined,
        FileExcelOutlined,
        FileExclamationOutlined,
        FileWordOutlined,
        FilePdfOutlined,
        CloudServerOutlined,
        CloudDownloadOutlined,
        FileOutlined,
        
    },
    setup() {
        const dataTimeFormat = (d) => {
            var date = format(new Date(d), 'yyyy-MM-dd hh:mm:ss')
            if (date == "NaN-aN-aN") {
                date = "1900-01-01 00:00:00"
            }
            return date;
        };
        function format(x, y) {
            var z = {
                M: x.getMonth() + 1,
                d: x.getDate(),
                h: x.getHours(),
                m: x.getMinutes(),
                s: x.getSeconds()
            };
            y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
                return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
            });

            return y.replace(/(y+)/g, function (v) {
                return x.getFullYear().toString().slice(-v.length)
            });
        }
        
        const files = ref([])
        const draw = ref(false)
        const title = ref()
        const fileDraw = ref()
        const loading = ref(true)
        const interaction = ref([])

        const getFiles = () => {
            axios
                .get("v1/bigfile/files")
                .then((response) => {
                    //console.log(response.data);
                    files.value = response.data.files;
                    interaction.value = response.data;
                    loading.value = false
                });
        }
        const detail = (file) =>{
            //console.log(file)
            title.value = file.filename;
            fileDraw.value = file;
            draw.value = true;

        }
        const onClose = () => {
            draw.value = false;
        }
        EventBus.$emit("my-event")
        
        onMounted(() => {
            getFiles();
        });
        const serverFiles = computed(() => {return files.value.slice(0).reverse().sort((a, b) => {

                // a before o - Jane takes precedence
                if (a.id > b.id) { return -1 }
                // o before a - John takes precedence
                if (b.id > a.id) { return 1 }

                // both names are the same
                return 0
            }) })
        
        const truncate = (text, length = 20, suffix = '...') => {
            if (text.length > length) {
                return text.substring(0, length) + suffix;
            } else {
                return text;
            }
        }
        EventBus.$on("big-files-change", () => {
            loading.value = true
            getFiles();
        });
        const onInteraction = (url,id)=>{
             axios
                .get(`v1/bigfile/interaction?url=${url}&id=${id}`)
                .then((response) => {
                    onClose(response)
                })
                .catch(
                     onClose()
                );
        }

        return {
            serverFiles,
            truncate,
            getFiles,
            onClose,
            detail,
            files,
            draw,
            title,
            fileDraw,
            loading,
            interaction,
            dataTimeFormat,
            onInteraction
        };
    },
});
 
</script>