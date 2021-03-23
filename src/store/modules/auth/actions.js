import axios from '../../../services/axios';
import * as storage from './storage';
import router from '../../../router';

export default {
  actions: {
    async loginRequest({ commit, dispatch }, payload) {
      commit('SET_LOADING', true);
      try {
        const { data } = await axios.post('/login/user', payload);
        const {
          id, name, email, admin, user_photos
        } = data.user;
        dispatch('loginSetToken', data.token);
        dispatch('loginSetUser', {
          id, name, email, admin, user_photos
        });
        storage.setLocalStorage({ token: data.token, id });
        commit('SET_LOADING', false);
        return router.push({ name: 'Home' });
      } catch (e) {
        commit('SET_LOADING', false);
        const { data } = e.response;
        if (data.error) return dispatch('errorLogin', data.error);
        return dispatch('errorLogin', 'Dados inválidos.');
      }
    },
    checkToken(context) {
      const { token , id } = storage.getLocalStorage();
      if (!token) {
        return Promise.reject();
      }
      context.dispatch('loginSetToken', token);
      return context.dispatch('checkSession', id);
    },
    async checkSession({ dispatch }, payload) {
      try {
        const { data } = await axios.get(`/user/${payload}`);
        const {
          id, name, email, admin, user_photos
        } = data;
        dispatch('loginSetUser', {
          id, name, email, admin,user_photos
        });
        return Promise.resolve();
      } catch (err) {
        dispatch('signOut');
        return Promise.reject(err);
      }
    },
    loginSetToken({ commit }, payload) {
      storage.setHeaderToken(payload);
      commit('SET_TOKEN', payload);
    },
    loginSetUser({ commit }, payload) {
      commit('SET_USER', payload);
    },
    errorLogin({ commit }, payload) {
      commit('SET_ERROR_LOGIN', payload);
    },

    signOut(context) {
      storage.deleteHeaderToken();
      storage.deleteLocalStorage();
      context.commit('SET_USER', '');
      context.commit('SET_TOKEN', '');
    },
    async registerRequest(context, payload) {
      context.commit('SET_LOADING', true);
      try {
        const { data } = await axios.post('/user', payload);
        return context.dispatch('loginRequest', { email: data.email, password: payload.password });
      } catch (e) {
        context.commit('SET_LOADING', false);
        const { data } = e.response;
        if (data.error) return context.commit('SET_ERROR_REGISTER', data.error);
        return context.commit('SET_ERROR_REGISTER', 'Dados inválidos.');
      }
    },
  },
};
