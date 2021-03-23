<template>
  <div class="products">
    <Modal :isActive="modal.active"
     :title="modal.title" :modalType="modal.style" v-on:close="modal.active = false">
      <template v-slot:content>
        <p>{{modal.msg}}</p>
      </template>
      <template v-slot:footer>
        <button @click="handleConfirmDelete" class="confirm">Confirmar</button>
        <button @click="modal.active = false" class="cancel">Cancelar</button>
      </template>
    </Modal>
    <div class="actions">
    <form method="get" @submit.prevent="handleSubmit" >
      <input type="text" v-model="input" placeholder="Produtos">
      <button class="icon-search">
      <font-awesome-icon :icon='icon("search")'/>
      </button>
    </form>
    <Messages :data="flashMsg" v-on:close="flashMsg.active = false"/>

    <router-link :to="{name: 'Criar produto'}">
      <font-awesome-icon :icon="icon('plus')"/>Novo</router-link>
    </div>
<div class='table'>
    <table cellspacing='0'>
     <thead>
        <tr>
           <th>Nome</th>
           <th>Categoria</th>
           <th>Preço</th>
           <th>Estoque</th>
           <th class="action">Ação</th>
        </tr>
     </thead>
     <tbody>
        <tr class='data-product' v-for="product in products" :key="product.id">
            <td>{{product.name}}</td>
            <td>{{product.category}}</td>
            <td>{{getCurrencyValue(product.price)}}</td>
            <td>{{product.stock}}</td>
            <td class='action-icon'> 
              <router-link :to="{name: 'Editar produto', params: {id: product.id}}">
                 <font-awesome-icon :icon="icon('edit')"/>
            </router-link>
           <button @click="handleDelete(product.id,product.name)">
              <font-awesome-icon :icon="icon('delete')" />
             </button> </td>
        </tr>
     </tbody>
    </table>

</div>

   <Pagination class="pagination" :total='totalLength' :limit="limit" />
  </div>
</template>

<script>

import {
  faEdit, faTimes, faPlusCircle, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import get from 'lodash.get';
import axios from '../../../../services/axios';
import MixinMessage from '../../../mixins/messages'
import MixinModal from '../../../mixins/modal'
import MixinPagination from '../../../mixins/pagination'

export default {
  mixins:[MixinMessage,MixinModal,MixinPagination],
  name: 'Product',
  data() {
    return {
      products: {},
      loading: false,
      input: '',
      query: '',
      productId: '',
    };
  },
  methods: {
    getData() {
      this.loading = true;
      axios.get(this.url).then((res) => {
        this.totalLength = Number(res.headers['count-data']);
        this.products = res.data;
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
        const response = get(e, 'response.status', false);
        if (response === 401) {
          this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
          this.$router.push({ name: 'Auth' });
        }
      });
    },
    getCurrencyValue(value) {
      return parseInt(value).toLocaleString('pt-BR', { minimumIntegerDigits: 2, currency: 'BRL', style: 'currency' });
    },
    icon(name) {
      if (name === 'delete') return faTimes;
      if (name === 'plus') return faPlusCircle;
      if (name === 'edit') return faEdit;
      if (name === 'search') return faSearch;
      return null;
    },
    handleSubmit() {
      this.query = this.input;
      this.pushUrl({ q: this.query });
    },
    pushUrl(query) {
      this.$router.push({
        query: {
          page: this.currentPage,
          ...query,
        },
      });
    },
    fillQuery() {
      const { page } = this.$route.query;
      this.currentPage = Number(page);
    },
    handleDelete(id, name) {
      this.productId = id;
      this.openDangerModal(name);
    },
    handleConfirmDelete() {
      this.loading = true;
      axios.delete(`/product/${this.productId}`)
        .then(() => {
          this.loading = false;
          this.getData();
          this.modal.active = false;
          this.createSuccess("Produto deletado.")
        }).catch((e) => {
          this.loading = false;
          const response = get(e, 'response.status', false);
          if (response === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            this.$router.push({ name: 'Auth' });
          }
          this.createFailure()
        });   
    },
  },
  computed: {
    url() {
      let { page } = this.$route.query;
      if (!page || Number(page) < 1) {
        page = this.currentPage;
        this.pushUrl();
      } else this.fillQuery();
      return `product/all?page=${page}&limit=${this.limit}&q=${this.query}`;
    },
  },
  watch: {
    url() {
      this.getData();
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
