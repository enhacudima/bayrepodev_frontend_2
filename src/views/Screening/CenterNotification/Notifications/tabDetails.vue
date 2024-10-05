<template>
     <a-result title="Comming Soon!">
        <template #icon>
          <smile-twoTone />
        </template>
        <template #extra>
          <a-button type="primary">Ok</a-button>
        </template>
      </a-result>
</template>

<script>
import { SmileTwoTone } from '@ant-design/icons-vue';
//import TreeNode from '@/components/TreeNode/TreeNode'
export default {
    components: {
        SmileTwoTone
    },
    props: ['detailesData'],
}
</script>

<style>

</style>
