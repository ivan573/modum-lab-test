import api from '../../api.js';

const initialState = {
    page: 0,
    next: false,
    count: null,
    books: []
};

export default {
        state: {...initialState, activeBook: null},
        getters: {
            page: state => state.page,
            next: state => state.next,
            count: state => state.next,
            books: state => state.books,
            activeBook: state => state.activeBook
        },
        mutations: {
            updateBooksData(state, booksData) {
                state.page = booksData.page;
                state.next = booksData.next;
                state.count = booksData.count;
                state.books = booksData.list;
            },
            addNextPageData(state, booksData) {
                state.page = booksData.page;
                state.next = booksData.next;
                state.count = booksData.count;
                state.books = state.books.concat(booksData.list);
            },
            discardBooksData(state) {
                Object.assign(state, initialState);
            },
            updateActiveBook(state, book) {
                state.activeBook = book;
            },
            discardActiveBook(state) {
                state.activeBook = null;
            }
        },
        actions: {
            fetchBooks(ctx, callback) {
                const categories = ctx.getters.activeCategories;
                if (!categories.length) return;
                ctx.commit('clearLocalTimeout');
                ctx.commit('setLocalTimeout', async () => {
                    const currentPage = ctx.getters.page;
                    const booksData = await api('list', categories, currentPage + 1);
                    if (currentPage) {
                        ctx.commit('addNextPageData', booksData.data);
                        if (callback) callback();
                        return;
                    }
                    ctx.commit('updateBooksData', booksData.data);
                    if (callback) callback();
                });   
            }
        }
};