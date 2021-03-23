import get from 'lodash.get';
import store from '../store';

export default async (to, from, next) => {
  document.title = `Dashboard | ${to.name}`;
  if (to.name !== 'Auth' && !store.getters['auth/hasToken']) {
    try {
      await store.dispatch('auth/checkToken');
      next();
    } catch (err) {
      store.dispatch('auth/errorLogin', 'Faça seu o login.');
      next({ name: 'Auth' });
    }
  } 
  next();
};
