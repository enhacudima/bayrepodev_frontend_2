<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input :value="value" @change="handleChange" @pressEnter="check" />
      <check-outlined
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <edit-outlined type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
import { CheckOutlined, EditOutlined} from '@ant-design/icons-vue';
export default {
  components: {
    CheckOutlined, EditOutlined
  },
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: false,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};
</script>
