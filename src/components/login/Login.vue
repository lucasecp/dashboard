<template>
  <div class="">
    <h1>Login</h1>
    <form action="/" method="post" @submit="handleSubmit">
      <div>
        <input v-model="email" type="email" name="email" placeholder="Email" />

        <p v-show="errors.email">{{ errors.email }}</p>
      </div>
      <div>
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder="Senha"
        />

        <p v-show="errors.password">{{ errors.password }}</p>
      </div>
      <div>
        <button>Entrar</button>
        <Loading :isLoading="isLoading"></Loading>
      </div>
      <p v-show="errorLogin">{{ errorLogin }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Loading from '../loading/Loading.vue';

export default {
  name: 'Login',
  components: {
    Loading,
  },
  data() {
    return {
      email: '',
      password: '',
      errors: {
        password: '',
        email: '',
      },
    };
  },
  methods: {
    ...mapActions(['auth/loginRequest']),
    handleSubmit(e) {
      this.clearErrors();
      e.preventDefault();
      if (!this.password.trim() || this.password.trim().length < 8) {
        this.errors.password = 'Senha inválida.';
      }
      if (!this.email.trim()) {
        this.errors.email = 'Campo obrigatório.';
      }
      if (
        this.errors.name
        || this.errors.email
        || this.errors.password
        || this.errors.confirm
      ) { return; }
      this.$store.dispatch('auth/loginRequest', {
        email: this.email,
        password: this.password,
      });
    },
    clearErrors() {
      this.errors.name = '';
      this.errors.email = '';
      this.errors.password = '';
      this.errors.confirm = '';
      this.$store.dispatch('auth/errorLogin', '');
    },
  },
  computed: {
    ...mapState('auth', ['isLoading', 'errorLogin']),
  },
};
</script>

<style lang='scss' src='./style.scss' scoped >
</style>
