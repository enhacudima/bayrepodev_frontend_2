<template>
    <b-alert show class="d-flex justify-content-between mb-1">
        {{ node }}
        <span class="fas fa-angle-right" />
    </b-alert>
</template>
<script>
export default {
    name: 'TreeNode',
    props: {
        node: {
            type: String,
            required: true
        }
    }
}
</script>