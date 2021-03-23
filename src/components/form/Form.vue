<template>
    <form action="" :method="method">
      <input
        v-for="(input, index) in fields"
        :type="input.type"
        :placeholder="input.placeHolder"
        v-model="input.model"
        :key="index"
      />
      <slot></slot>
    </form>
</template>

<script>
export default {
  props: {
    method: String,
    fields: {
      type: Array,
      required: true,
    },
  },
  name: 'Form',
};
</script>

<style scoped lang='scss'>
@import "./style.scss";
</style>
