<template>
  <div class="orders">

  <div class='table'>
    <table cellspacing='0'>
     <thead>
        <tr>
           <th>N° pedido</th>
           <th>Cliente</th>
           <th>Produtos</th>
           <th>Data</th>
        </tr>
     </thead>
     <tbody>
        <tr v-for="(client,index) in orders" :key="index" v-if="client.products.length">
            <td>{{client.products[client.products.length -1].order_products_users.id}}</td>
            <td>{{client.email}}</td>
            <td>{{client.products[client.products.length -1].name }}</td>
            <td>
           {{client.products[client.products.length -1].
           order_products_users.created_at.slice(0,10) }}
           </td>
        </tr>
     </tbody>
    </table>
  </div>
   <Pagination class="pagination" :total='totalLength' :limit="limit" />
  </div>
</template>

<script>
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import get from 'lodash.get';
import axios from '../../../../services/axios';
import MixinPagination from '../../../mixins/pagination'
export default {
  mixins:[MixinPagination],
  name: 'Orders',
  data() {
    return {
      orders: {},
      loading: false,
      input: ''
    };
  },
  methods: {
    getData() {
      this.loading = true;
      axios.get(this.url).then((res) => {
        this.totalLength = Number(res.headers['count-data']);
        this.orders = res.data;
        this.loading = false;
        if (!this.$route.query.page) {
          this.$router.push({ query: { page: this.currentPage, limit: this.limit } });
        }
      }).catch((e) => {
        this.loading = false;
        const response = get(e, 'e.response.status', false);
        if (response === 401) this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
      });
    },
      pushUrl() {
      this.$router.push({
        query: {
          page: this.currentPage,
        },
      });
    },
    fillQuery() {
      const { page } = this.$route.query;
      this.currentPage = Number(page);
    },
    icon(name) {
      if (name === 'search') return faSearch;
      return null;
    },
  },
  computed: {
    url() {
      let { page } = this.$route.query;
      if (!page || Number(page) < 1 ) {
        page = this.currentPage;
        this.pushUrl();
      } else this.fillQuery();
      return `order/all?page=${page}&limit=${this.limit}`;
    },
  },
  watch: {
    url(v) {
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
