<template>
  <header>
  <div>
     <font-awesome-icon :icon='icon("bars")' @click='handleFullScreen'/>
    <h1>{{this.$route.name}}</h1>
  </div>
   
    <div class="logout" @click="handleLogout">
   <font-awesome-icon :icon='icon("powerOff")'/>
    <span>Sair</span>
    </div>
  </header>
</template>

<script>
import { faSearch,faSignInAlt,faBars } from '@fortawesome/free-solid-svg-icons';

export default {
   name: 'Header',
     methods: {
    icon(name) {
      if (name === 'search') return faSearch;
      if (name === 'powerOff') return faSignInAlt;
      if (name === 'bars') return faBars;
      return null;
    },
    handleLogout(){
      this.$store.dispatch('auth/signOut');
      this.$router.push({name: 'Auth'})
    },
    handleFullScreen(){
      const isActive = this.$store.getters['layout/isActive']
      this.$store.dispatch('layout/activeScreen', !isActive)
    }
  },
}
</script>

<style  lang='scss' src='./style.scss' scoped>

</style>