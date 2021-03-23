<template>
  <div class="home" :class="{'full-screen': fullScreen}">
  <Sidenav/>
  <Header/>
  <div class="main">
  <router-view></router-view>
  </div>
  </div>
</template>


<script>
import {mapState} from 'vuex'
import Header from '../../components/header/Header.vue';
import Sidenav from '../../components/sidenav/Sidenav.vue';

export default {
  name: 'Home',
  components: {
    Header,
    Sidenav,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.name === 'Home') {
        vm.$router.push({ name: 'Overview' });
      }
      //iniciará sem o sidenav em dispositivos móveis
       if(window.matchMedia('(max-width: 768px)').matches){
      vm.$store.dispatch('layout/activeScreen', true)
    }
    });
  },
  computed:{
     ...mapState('layout', ['fullScreen'])
  },

};
</script>
<style lang='scss'>
@import 'style';
</style>
