<template>
<transition name="messages">
<div class="messages" v-if="data.active" :class="{danger: data.type === 'fail', done: data.type === 'done'}">
  <font-awesome-icon :icon="icon()" /> <p>{{data.msg}}<p/>
</div>
</transition>
</template>

<script>
import {
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

export default {
  name: 'Messages',
  props: {
     data:{ 
      type: '',
      msg: '',
      time: '',
      active: ''
     }
  },
  data() {
    return {
    };
  },
  methods: {
    icon() {
      if (this.data.type === 'fail') return faTimes;
      if (this.data.type === 'done') return faCheck;
    },
  },
  watch:{
      data(){
          setTimeout(() => {
              this.$emit('close')
          }, this.data.time);
      }
  }
};
</script>

<style scoped lang='scss'>
@import "./style.scss";
</style>
