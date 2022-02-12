import api from '../../api.js';

export default {
    state: {
        allCategories: [],
        activeCategories: []
    },
    getters: {
        allCategories: state => state.allCategories,
        activeCategories: state => state.activeCategories
    },
    mutations: {
        updateCategories(state, categories) {
            state.allCategories = categories;
        },
        updateActiveCategories(state, categories) {
            state.activeCategories = categories;
        }
    },
    actions: {
        async fetchCategories(ctx) {
            const categories = await api('categories');
            ctx.commit('updateCategories', categories.data.list);
        }
    }
};