import Vue from 'vue';
import Vuex from 'vuex';
import categories from './modules/categories.js';
import books from './modules/books.js';
import search from './modules/search.js';
import timeout from './modules/timeout.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    categories,
    books,
    search,
    timeout
  }
});
