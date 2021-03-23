<template>
  <div class="update-product">
    <header>
    <Messages  :data="flashMsg" v-on:close="flashMsg.active = false"/>
    </header>

    <form method="put" class="form-products" @submit.prevent="handleUpdate">
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
         <img v-if="url" :src="url" alt="foto" @click="handleFile">
         </div>
        <input type="file" hidden @change="handleChangeFile"/>
      </div>
       <Loading :isLoading="loading" class="loading" />
      <button :disable="form">Editar</button>
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
  name: 'UpdateProduct',
  data() {
    return {
      form: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      },
      url: '',
      loading: false,
      errors: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      },
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
      this.loading = true;
      const file = e.target.files[0];
      if (file) {
        const result = URL.createObjectURL(file);
        this.url = result;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('product', this.$route.params.id);
        axios.post('/photo/product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((resp) => {
          this.loading = false;
          this.createSuccess();
        }).catch((e) => {
          this.loading = false;
          const response = get(e, 'response.status', false);
          if (response === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            this.$router.push({ name: 'Auth' });
          }
        });
      }
    },
    getData() {
      const { id } = this.$route.params;
      axios.get(`/product/${id}`)
        .then(({ data }) => {
          const {
            name, category, description, price, stock, product_photos,
          } = data;
          const photo = get(data, 'product_photos', '');
          this.form = {
            name, category, description, price, stock,
          };
          this.url = photo.length ? photo[photo.length - 1].url : '';
        });
    },
    handleUpdate() {
      this.clearErrors();
      this.validate();
      const {
        name, description, price, stock, category,
      } = this.errors;
      if (name || description || price || stock || category) return;
      this.form.price = this.getPrice();
      this.loading = true;
      axios.put(`/product/${this.$route.params.id}`, { ...this.form })
        .then((res) => {
          this.loading = false;
          this.createSuccess('Editado.');
        })
        .catch((e) => {
          this.loading = false;
          const status = get(e, 'response.status', false);
          const response = get(e, 'response.data', false);
          if (status === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            return this.$router.push({ name: 'Auth' });
          }
          console.log(response);
          return this.createFailure(response.error);
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
  watch: {
    form(v) {
      console.log(v);
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped lang='scss'>
@import "style.scss";
</style>
