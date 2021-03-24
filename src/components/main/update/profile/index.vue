<template>
   <div class="profile-edit">
       <Modal class='modal-users' :title="modal.title"
     :isActive="modal.active" v-on:close="modal.active = false" :modalType="modal.style">
      <template v-slot:content>
        <p>{{modal.msg}}</p>
      </template>
       <template v-slot:footer>
       <div class="btn-modal">
        <button @click="handleConfirmDelete">Confirmar</button>
        <button @click="modal.active = false">Cancelar</button>
       </div>
      </template>
    </Modal>
   <div class="bg"></div>
        <div class="photo-area" >
        <div class="photo" >
        <img v-if="url"
        :src="url" alt="Perfil" @click="handleFile" />
        <v-gravatar v-else :email="form.email" @click="handleFile"/>
        </div>
      <span @click="handleFile"><font-awesome-icon :icon="icon('edit')"/>
        Nova
        </span>
         <Loading :isLoading="loading" />
        <input type="file" hidden @change="handleChangeFile"/>
      <Messages class='messages' :data="flashMsg" v-on:close="flashMsg.active = false"/>
        </div>
        <div class='form'>
      <form  method="put" @submit.prevent="handleUpdate">
       <div class="input-group">
       <p v-if="errors.name">{{errors.name}}</p>
      <input type="text" :class="{'input-error': errors.name}"placeholder="Nome" v-model="form.name">
       </div>
       <div class="input-group">
       <p v-if="errors.email">{{errors.email}}</p>
      <input type="email":class="{'input-error': errors.email}" placeholder="E-mail" v-model="form.email">
       </div>
       <div class="input-group">
       <p v-if="errors.password">{{errors.password}}</p>
      <input type="password" :class="{'input-error': errors.password}"placeholder="Senha" v-model="form.password">
       </div>
       <div class="input-group">
       <p v-if="errors.confirmPassword">{{errors.confirmPassword}}</p>
      <input type="password" :class="{'input-error': errors.confirmPassword}"placeholder="Confirmar senha" v-model="confirmPassword">
       </div>
          <button>Atualizar dados</button>
      </form>
        <button class="destroy-profile" @click="openModal">Encerrar conta</button>
</div>
   </div>
</template>

<script>
import get from 'lodash.get';
import { mapState } from 'vuex';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import MixinMessage from '../../../mixins/messages';
import MixinModal from '../../../mixins/modal';
import axios from '../../../../services/axios';
import Loading from '../../../loading/Loading.vue';

export default {
  name: 'UpdateProfile',
  components: { Loading },
  mixins: [MixinMessage, MixinModal],
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
      },
      confirmPassword: '',
      userId: '',
      url: '',
      errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        loading: false,
      },
    };
  },
  methods: {
    getFromStore() {
      const {
        id, name, email, user_photos,
      } = this.user;
      this.form = { name, email };
      this.userId = id;
      if (user_photos.length) this.url = user_photos[user_photos.length - 1].url;
    },
    icon(name) {
      if (name === 'edit') return faCamera;
      return null;
    },
    handleChangeFile(e) {
      this.loading = true;
      const file = e.target.files[0];
      if (file) {
        const result = URL.createObjectURL(file);
        this.url = result;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', this.userId);
        axios.post('/photo/user', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((resp) => {
          this.loading = false;
          this.createSuccess('Foto editada com sucesso.');
        }).catch((e) => {
          this.loading = false;
          const status = get(e, 'response.status', false);
          const response = get(e, 'response.data', false);
          if (status === 401) {
                this.loading = false;
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            this.$router.push({ name: 'Auth' });
          }
          if (response) return this.createFailure(response.error);
        });
      }
    },
    handleFile() {
      const inputFile = document.querySelector('input[type="file"]');
      return inputFile.click();
    },
    handleUpdate() {
          this.loading = true;
      this.clearErrors();
      this.validate();
      const {
        name, email, password, confirmPassword,
      } = this.errors;
      if (name || email || password || confirmPassword) return;
      // mandando para o backend somente os campos alterados
      const fieldUpdate = this.form.password ? this.form : { name: this.form.name, email: this.form.email };

      axios.put(`/user/${this.userId}`, fieldUpdate)
        .then((res) => {
          this.loading = false;
          // se o usuário alterar a própria senha ou email volta para o login.
          if (this.form.password || this.form.email !== this.user.email) {
            this.$store.dispatch('auth/errorLogin', 'Faça o login novamente');
            return this.$router.push({ name: 'Auth' });
          }
          return this.createSuccess('Editado com sucesso.');
        })
        .catch((e) => {
          this.loading = false;
          const status = get(e, 'response.status', false);
          const response = get(e, 'response.data', false);
          if (status === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            return this.$router.push({ name: 'Auth' });
          }
          return this.createFailure(response.error[0]);
        });
    },
    validate() {
      for (const key in this.form) {
        if (!this.form[key].trim() && this.form.password) {
          this.errors[key] = 'Campo vazio.';
        }
      }
      if (this.confirmPassword !== this.form.password && this.form.password) {
        this.errors.confirmPassword = 'Senhas não conferem.';
      }
      if (this.form.password && this.form.password.length < 8) {
        this.errors.password = 'Senha deve ter no mínimo 8 caracteres.';
      }
    },
    clearErrors() {
      for (const key in this.errors) {
        this.errors[key] = '';
      }
    },
    openModal() {
      this.modal.active = true;
      this.modal.style = 'danger';
      this.modal.title = 'ATENÇÃO';
      this.modal.msg = 'Tem certeza que deseja encerrar a sua conta ?!';
    },
    handleConfirmDelete() {
      axios.delete(`user/${this.userId}`)
        .then((resp) => {
          this.$router.push({ name: 'Auth' });
        }).catch((e) => {
          const status = get(e, 'response.status', false);
          const response = get(e, 'response.data', false);
          if (status === 401) {
            this.$store.dispatch('auth/errorLogin', 'Sessão Expirada. Faça o login ');
            return this.$router.push({ name: 'Auth' });
          }
          return this.createFailure('Erro.');
        });
    },
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  mounted() {
    this.getFromStore();
  },
};
</script>

<style scoped lang='scss'>
@import './style.scss';
</style>
