<template>
  <div class="">
    <h1>Registre-se</h1>
    <form action="/" method="post" @submit="handleSubmit">
      <div>
        <input v-model="name" type="text" name="name" placeholder="Nome de usuário" />
        <p v-show="errors.name">{{ errors.name }}</p>
      </div>
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
        <input
          v-model="confirmPass"
          type="password"
          name="confirmPass"
          placeholder="Confirme a senha"
        />
        <p v-show="errors.confirm">{{ errors.confirm }}</p>
      </div>
      <div>
      <button>Cadastrar</button>
  <Loading :isLoading="isLoading"></Loading>
      </div>
        <p v-show='errorRegister'>{{errorRegister}}</p>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loading from '../loading/Loading.vue';

export default {
  name: 'SignIn',
  components: { Loading },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPass: '',
      errors: {
        name: '',
        password: '',
        confirm: '',
        email: '',
      },
    };
  },
  methods: {

    handleSubmit(e) {
      this.clearErrors();
      e.preventDefault();
      if (!this.name.trim() || this.name.trim().length === 1) {
        this.errors.name = 'Nome de usuário inválido.';
      }
      if (!this.password.trim() || this.password.trim().length < 8) {
        this.errors.password = 'Senha deve ter no mínimo 8 caracteres.';
      }
      if (!this.email.trim()) {
        this.errors.email = 'Campo obrigatório.';
      }
      if (this.confirmPass !== this.password) {
        this.errors.confirm = 'Senhas não conferem.';
      }
      if (
        this.errors.name
        || this.errors.email
        || this.errors.password
        || this.errors.confirm
      ) return;
      this.$store.dispatch('auth/registerRequest', { name: this.name, email: this.email, password: this.password });
    },
    clearErrors() {
      this.errors.name = '';
      this.errors.email = '';
      this.errors.password = '';
      this.errors.confirm = '';
      this.$store.commit('auth/SET_ERROR_REGISTER', '');
    },
  },
  computed: {
    ...mapState('auth', ['isLoading', 'errorRegister']),
  },
};
</script>

<style scoped src="./style.scss" lang='scss'>

</style>
