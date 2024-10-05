<template>
    <a-drawer :title="title" :width="500" placement="right" :closable="false" @close="onClose" :visible="draw"
        :zIndex="1050">
        <a-card title="XML Files">

            <a-card-grid style="width: 50%; text-align: center" v-for="(file,index) in files" :key="index">
                <a-result>
                    <template #icon>
                        <FileExclamationFilled />
                    </template>
                    <template #extra>
                        <span>
                            <a-tooltip color="blue">
                                <template #title>Date:{{ file.updated_at }}, Range: {{ file.range }},
                                    Code: {{ file.uuid  }},
                                    Description: {{file.description}}, Comment: {{ file.comment }}</template>
                                <a :href="$baseUrl + 'baylend-xml/' + file.uuid">{{ file.title}}
                                    <CloudDownloadOutlined />
                                </a>
                            </a-tooltip>
                        </span>
                    </template>
                </a-result>
            </a-card-grid>
        </a-card>
    </a-drawer>

</template>
<script>
import {
    CloudDownloadOutlined,
    FileExclamationFilled
} from '@ant-design/icons-vue';
import axios from 'axios'
export default {
    watch: {
        draw() {
            this.getFiles();
        }
    },
    data: function () {
        return {
            bulk: '',
            files: [],
            draw: false,
            title: '',
            fileDraw: '',
            loading: true,
            interaction: []
        };
    },
    methods: {
        getFiles() {
            axios
                .get("/v1/baylend-xml-files/" + this.bulk)
                .then((response) => {
                    //console.log(response.data);
                    this.files = response.data;
                    this.loading = false
                });
        },
        detail(file) {
            //console.log(file)
            this.title = file.filename;
            this.fileDraw = file;
            this.draw = true;

        },
        onClose() {
            this.draw = false;
        },
        truncate(text, length = 20, suffix = '...') {
            if (text.length > length) {
                return text.substring(0, length) + suffix;
            } else {
                return text;
            }
        }
    },
    components: {
        CloudDownloadOutlined,
        FileExclamationFilled
    },
    computed: {
       /* serverFiles: function () {
            return this.files.sort((b, a) => a.id - b.id);
        },*/
    },
    mounted() {
        //this.getFiles();
    }
};

</script>
