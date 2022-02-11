import api from '../../api.js';

export default {
    state: {
        allCategories: []
    },
    getters: {
        allCategories: state => state.allCategories,
        activeCategories: state => state.allCategories.filter(el => el.isActive)
    },
    mutations: {
        updateCategories(state, categories) {
            state.allCategories = categories;
        },
        toggleCategoryActiveness(state, category) {
            state.allCategories.forEach(el => {
                if (el.id === category.id) {
                    el.isActive = !el.isActive;
                }
            });
        },
        discardActiveness(state) {
            state.allCategories.forEach(el => el.isActive = false);
        }
    },
    actions: {
        async fetchCategories(ctx) {
            const categories = await api('categories');
            categories.data.list.forEach(el => el.isActive = false);
            ctx.commit('updateCategories', categories.data.list);
        }
    }
};