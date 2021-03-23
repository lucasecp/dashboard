<template>
  <div class="create-product">
    <header>
    <Messages :data="flashMsg" v-on:close="flashMsg.active = false"/>
    </header>

    <form method="post" class="form-products" @submit.prevent="handleSubmit">
    <div class="input-group">
    <p class="errors" v-if="errors.name">{{errors.name}}</p>
    <label for="name">Nome:</label>
     <input type="text" :class="{'input-error': errors.name}" v-model="form.name"  >
    </div>
    <div class="input-group">
     <p class="errors" v-if="errors.price">{{errors.price}}</p>
    <label for="price">Preço:</label>
     <input type="text" :class="{'input-error': errors.price}" v-model="form.price" >
    </div>
    <div class="input-group">
    <label for="stock">Estoque:</label>
     <input type="text" :class="{'input-error': errors.stock}" v-model="form.stock">
   <p class="errors" v-if="errors.stock">{{errors.stock}}</p>
    </div>
    <div class="input-group">
      <p class="errors" v-if="errors.category">{{errors.category}}</p>
    <label for="category">Categoria:</label>
      <select :class="{'input-error': errors.category}" v-model="form.category" id="" value="selecione">
        <option value="jogos">Jogos</option>
        <option value="consoles">Consoles</option>
        <option value="acessorios">Acessórios</option>
      </select>
    </div>

      <div class="input-group">
     <p class="errors" v-if="errors.description">{{errors.description}}</p>
      <label for="name">Descrição:</label>
      <textarea :class="{'input-error': errors.description}" v-model="form.description" ></textarea>
      </div>
      <div class="file">
         <h3>Adicionar foto</h3>
         <div class="img-file" @click.prevent='handleFile'>
         <font-awesome-icon :icon='icon("file")' v-if="!url"/>
         <img v-if="url" :src="url" alt="foto">
         </div>
        <input type="file" hidden @change="handleChangeFile"/>
      </div>
 <Loading :isLoading="loading" class="loading" />
      <button >Criar</button>
    </form>
  </div>
</template>

<script>
import get from 'lodash.get';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../../services/axios';
import MixinMessage from '../../../mixins/messages';
import Loading from '../../../loading/Loading.vue';

export default {
  mixins: [MixinMessage],
  components: { Loading },
  name: 'CreateProduct',
  data() {
    return {
      user: {
        id: '',
      },
      form: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      },
      url: '',
      file: '',
      errors: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      },
      loading: false,
    };
  },
  methods: {
    icon(name) {
      if (name === 'file') return faPlusCircle;
      return null;
    },
    handleFile() {
      const inputFile = document.querySelector('.file input');
      return inputFile.click();
    },
    handleChangeFile(e) {
      this.file = e.target.files[0];
      const result = URL.createObjectURL(this.file);
      this.url = result;
    },
    savePhoto() {
      const formData = new FormData();
      formData.append('image', this.file);
      formData.append('product', this.user.id);
      axios.post('/photo/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((resp) => {
        this.loading = false;
        this.createSuccess('Produto criado com sucesso.');
      }).catch((e) => {
        this.loading = false;
        const response = get(e, 'response.status', false);
        if (response === 401) {
          this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
          this.$router.push({ name: 'Auth' });
        }
      });
    },
    handleSubmit() {
      this.clearErrors();
      this.validate();
      const {
        name, description, price, stock, category,
      } = this.errors;
      // verficando se há algum erro
      if (name || description || price || stock || category) return;
      this.form.price = this.getPrice();
      this.loading= true
      axios.post('/product', { ...this.form, sold: 0 })
        .then(({ data }) => {
          this.user.id = data.id;
          if (this.file) return this.savePhoto();
          this.loading= false
          this.createSuccess('Produto criado com sucesso.');
        })
        .catch((e) => {
          const status = get(e, 'response.status', false);
          const response = get(e, 'response.data', false);
          if (status === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            return this.$router.push({ name: 'Auth' });
          }
          return response.error.map((d) => this.createFailure(d));
        });
    },
    validate() {
      for (const key in this.form) {
        if (!this.form[key].trim()) {
          this.errors[key] = 'Campo obrigatório.';
        }
      }
      if (typeof Number(this.form.price) !== 'number' || Number(this.form.price) <= 0) this.errors.price = 'Preço inválido.';
      if (typeof Number(this.form.stock) !== 'number' || Number(this.form.stock) <= 0) this.errors.stock = 'Estoque inválido.';
    },
    clearErrors() {
      for (const key in this.errors) {
        this.errors[key] = '';
      }
    },
    // Função caso o preço tenha vírgula
    getPrice() {
      let format = '';
      const { price } = this.form;
      if (price) {
        for (let i = 0; i < price.length; i++) {
          format += price[i] === ',' ? '.' : price[i];
        }
      }
      return format;
    },
  },
  created() {

  },
};
</script>

<style scoped lang='scss'>
@import "style.scss";
</style>
