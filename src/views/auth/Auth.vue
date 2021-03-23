<template>
  <div class="auth">
    <div class="content">
      <div class="welcome">
        <h1>Dashboard</h1>
        <font-awesome-icon :icon="icon('chart')" />
        <!--  <button @click="component = 'Login'">Login</button>
        <button @click="component = 'SignUp'">Registro</button> -->
      </div>
      <div class="form">
        <transition mode="out-in">
          <keep-alive>
            <component :is="component"></component>
          </keep-alive>
        </transition>

        <p v-if="component === 'Login'">
          Não possui conta?
          <a href="#" @click="component = 'SignUp'">Criar conta</a>
        </p>
        <p v-if="component === 'SignUp'">
          Já possui conta?
          <a href="#" @click="component = 'Login'">Fazer login</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import Login from '../../components/login/Login.vue';
import SignUp from '../../components/signUp/SignUp.vue';

export default {
  name: 'Auth',
  data() {
    return {
      component: 'Login',
      msgLogin: {
        h1: 'Fazer',
      },
    };
  },
  components: {
    Login,
    SignUp,
  },
  methods: {
    icon(name) {
      if (name === 'chart') return faChartPie;
      return null;
    },
  },
};
</script>

<style lang='scss' scoped src="./style.scss";>
@import "style.scss";
</style>
