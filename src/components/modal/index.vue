<template>
 <transition name='modal'>
<div class="modal-container" :class="modalType" @click="handleClick" v-if="isActive">

  <div class="modal" :style="style">
    <div class="modal-header">
        <h1>{{title}}</h1>
    </div>
      <button class="close-modal" >
          <font-awesome-icon :icon="icon('delete')" @click="handleClick"/>
      </button>
      <div class="modal-content">
       <slot name="content"></slot>
      </div>
      <div class="modal-footer">
      <slot name="footer"></slot>
      </div>
  </div>

</div>
   </transition>

</template>

<script>
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default {
  name: 'Pagination',
  props: {
    isActive: {
      type: Boolean,
    },
    width: {
      type: Number,
      default: 400,
    },
    title:{
      type: String,
      default: ''
    },
    modalType:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      style: {
        width: `${this.width}px`,
      },
    };
  },
  methods: {
    icon(name) {
      if (name === 'delete') return faTimes;
      return null;
    },
    handleClick(e) {
      if (e.target === e.currentTarget) {
        this.$emit('close');
      }
    },
  },
};
</script>

<style scoped lang='scss'>
@import "style.scss";
</style>
