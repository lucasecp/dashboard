<template>
  <div class="users">
    <Modal class='modal-users' :title="modal.title"
     :isActive="modal.active" v-on:close="modal.active = false" :modalType="modal.style">
      <template v-slot:content>
        <p>{{modal.msg}}</p>
      </template>
       <template v-slot:footer>
        <button @click="modal.active = false">ok</button>
      </template>
    </Modal>
    <header>
    <form method="get" @submit.prevent="handleSubmit" >
      <input type="text" v-model="input" placeholder="Usuário">
      <button class="icon-search">
      <font-awesome-icon :icon='icon("search")'/>
      </button>
    </form>
    <Messages :data="flashMsg" v-on:close="flashMsg.active = false"/>
    </header>
    <div class='table'>
    <table cellspacing='0'>
     <thead>
        <tr>
           <th>Username</th>
           <th>Email</th>
           <th>Admin</th>
        </tr>
     </thead>
     <tbody>
        <tr v-for="(User,index) in users" :key="index" v-if="User.id !== user.id" >
            <td>{{User.name}}</td>
            <td>{{User.email}}</td>
            <td>
               <button :class="{'is-admin': User.admin}" @click="handleAdmin(User.id,User.admin)">
                  <div class="ball"></div>
               </button>
            </td>
        </tr>
     </tbody>
    </table>
    </div>
   <Pagination class="pagination" :total='totalLength' :limit="limit" />

  </div>
</template>

<script>
import {mapState} from 'vuex';
import get from 'lodash.get';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../../services/axios';
import MixinMessage from '../../../mixins/messages'
import MixinModal from '../../../mixins/modal'
import MixinPagination from '../../../mixins/pagination'

export default {
  mixins:[MixinMessage,MixinModal,MixinPagination],
  name: 'Users',
  data() {
    return {
      users: {},
      loading: false,
      input: '',
      query: '',
    };
  },
  methods: {
    getData() {
      this.loading = true;
      axios.get(this.url).then((res) => {
        this.totalLength = Number(res.headers['count-data']);
        this.users = res.data;
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
        const response = get(e, 'response.status', false);
        if (response === 401) this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
      });
    },
    icon(name) {
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
    handleAdmin(userId, toggleAdmin) {
      //verficando se o usuário do sistema é admin
      const { admin } = get(this.$store.state, 'auth.user', false);
      if (!admin) return this.openPermitionModal();

      this.loading = true;
    return axios.put(`user/${userId}`, { admin: !toggleAdmin })
        .then(() => {
          this.loading = false;
          this.getData(this.url)
          this.createSuccess('Feito.');
        }).catch((e) => {
          this.loading = false;
          const response = get(e, 'response.status', false);
          if (response === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            this.$router.push({name: 'Auth'})
            }
            this.createFailure('Erro.')
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
      return `user/all?page=${page}&limit=${this.limit}&q=${this.query}`;
    },
    ...mapState('auth', ['user']),

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
