<template>
  <div :class="{spinner: isLoading}">
      <div></div>
      <div></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang='scss' src='./style.scss' scoped >
</style>
