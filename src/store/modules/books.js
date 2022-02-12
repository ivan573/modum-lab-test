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
            discardPage(state) {
                state.page = 0;
            },
            setActiveBook(state, book) {
                state.activeBook = book;
            },
            discardActiveBook(state) {
                state.activeBook = null;
            }
        },
        actions: {
            fetchBooks(ctx) {
                ctx.commit('clearLocalTimeout');
                ctx.commit('setLocalTimeout', async () => {
                    const categories = ctx.getters.activeCategories;
                    const currentPage = ctx.getters.page;
                    if (categories.length) {
                        const booksData = await api('list', categories, currentPage + 1);
                        if (currentPage) {
                            ctx.commit('addNextPageData', booksData.data);
                            return;
                        }
                        ctx.commit('updateBooksData', booksData.data);
                    }
                });
            }
        }
};