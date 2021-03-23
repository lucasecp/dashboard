export default {
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_LOADING(state, payload) {
      state.isLoading = payload;
    },
    SET_ERROR_LOGIN(state, payload) {
      state.errorLogin = payload;
    },
    SET_ERROR_REGISTER(state, payload) {
      state.errorRegister = payload;
    },
  },
};
