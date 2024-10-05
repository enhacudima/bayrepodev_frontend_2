<template>
  <div id="component">
    <file-pond
      name="test"
      ref="pond"
      allow-multiple="true"
      accepted-file-types="image/jpeg, image/png, image/svg+xml, text/csv, text/xml, text/html, application/pdf,pdf, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/xml, application/msword, application/json"
      v-on:init="handleFilePondInit"
    />
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond, { setOptions } from 'vue-filepond'
import Cookies from 'js-cookie'
import { defineComponent, ref, computed, onMounted } from 'vue'
// Import FilePond styles
import 'filepond/dist/filepond.min.css'
// Import FilePond plugins
// Please note that you need to install these plugins separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation filepond-plugin-file-validate-type --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import axios from 'axios'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
)

export default defineComponent({
  components: { FilePond },
  setup() {
    const serverFiles = ref([])
    const token = Cookies.get('token' + import.meta.env.VITE_APP_PORT)
    const baseUrlAPI = import.meta.env.VITE_APP_API_URL
    setOptions({
      server: {
        url: `${baseUrlAPI}/v1/bigfile/filepond`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      chunkUploads: true
    })

    const getFiles = () => {
      axios.get('v1/bigfile/files').then((response) => {
        //console.log(response.data);
        serverFiles.value = response.data
      })
    }
    const myFiles = computed(() => {
      var newfile = []
      serverFiles.value.forEach(function () {
        var temp = {
          source: '4ssXluhfXKqVxHjlNIZoODFFPLDwRe6gifwXNxZD.txt',
          options: {
            type: 'limbo'
          }
        }
        newfile.push(temp)
      })
      return newfile
    })

    onMounted(() => {
      getFiles()
    })
    const handleFilePondInit = () => {
      // FilePond instance methods are available on `this.$refs.pond`
      /* eslint-disable */
      //console.log("FilePond has initialized");
    }

    return {
      setOptions,
      serverFiles,
      myFiles,
      handleFilePondInit
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>