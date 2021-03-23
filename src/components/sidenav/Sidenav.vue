<template>
<aside class="sidenav" :class="{'full-screen': fullScreen}">

      <div class='profile-pic'>
        <router-link :to="{name: 'Editar usuário'}">
        <div>
        <img v-if="profilePic" :src="profilePic" alt="Perfil" />
        <v-gravatar v-else :email='sidenavUser.email' />
        </div>
        <p>{{sidenavUser.name}}</p>
        </router-link>
      </div>
  <nav>
    <router-link :to="{ name: 'Overview' }"
      ><font-awesome-icon :icon="icon('home')" />Overview</router-link >
    <div class="sublist" :class="{'sublist-active':sublistActive}">
      <div @click="sublistActive = !sublistActive">
    <router-link :to="{ name: 'Produtos' }"
      ><font-awesome-icon :icon="icon('bag')" />Produtos
      <font-awesome-icon :icon="icon('down')" class='svg-right'/></router-link>
      </div>
      <ul >
          <transition name="sidenav-products">
        <li v-if="sublistActive"><router-link :to="{name: 'Criar produto'}">
           <font-awesome-icon :icon="icon('plus')" />Novo</router-link>
        </li>
          </transition>
      </ul>
    
    </div>

      <router-link :to="{ name: 'Pedidos' }"
      ><font-awesome-icon :icon="icon('orders')" />Pedidos</router-link>

        <router-link :to="{ name: 'Usuários' }"
      ><font-awesome-icon :icon="icon('users')" />Usuários</router-link>
  </nav>

</aside>
</template>

<script>
import {
  faChartPie,
  faUsers,
  faShoppingBag,
  faReceipt,
  faPlus,
  faSortDown,faMoon,faSun,
} from '@fortawesome/free-solid-svg-icons';
import {mapState} from 'vuex'
export default {
  name: 'Sidenav',
  data() {
    return {
      sidenavUser:{
        name: '',
        email: ''
      },
      profilePic: '',
      sublistActive: false,
    };
  },
  methods: {
    icon(name) {
      if (name === 'home') return faChartPie;
      if (name === 'users') return faUsers;
      if (name === 'bag') return faShoppingBag;
      if (name === 'orders') return faReceipt;
      if (name === 'plus') return faPlus;
      if (name === 'down') return faSortDown;
      if (name === 'sun') return faSun;
      if (name === 'moon') return faMoon;
      return null;
    },
       getFromStore(){
      const { name,email,user_photos} = this.user;
      this.sidenavUser = {name,email};
      if(user_photos.length) this.profilePic = user_photos[user_photos.length -1].url
    },
  },
  computed:{
    ...mapState('auth',['user']),
    ...mapState('layout',['fullScreen'])
  },
  mounted(){
    this.getFromStore()
  },
};
</script>

<style scoped lang='scss'>
@import "./style.scss";
</style>
