const SEARCHABLE_BOOK_PROPERTIES = ['name', 'description', 'author', 'year'];
const SHOW_AT_ONCE = 10;

const getHighlightedBooks = (searchValue, allBooks) => {
    const regExp = new RegExp(searchValue, 'i');
    const highlightedBooks = [];

    allBooks.forEach(book => {
        for (let i = 0, found = false; i < SEARCHABLE_BOOK_PROPERTIES.length && !found; i++) {
            const prop = SEARCHABLE_BOOK_PROPERTIES[i];
            const index = book[prop].search(regExp);
            if (index !== -1) {
                const newBook = Object.assign({}, book);
                const newValue = `<strong>${searchValue.toUpperCase()}</strong>`;
                newBook[prop] = newBook[prop].replace(regExp, newValue);
                highlightedBooks.push(newBook);
                found = true;
            }
        }
    });

    return highlightedBooks;
};

const initialState = {
    searchValue: '',
    foundBooks: [],
    foundBooksPage: 0,
    isLoading: false
};

export default {
    state: {...initialState},
    getters: {
        searchValue: state => state.searchValue,
        foundBooks: state => state.foundBooks,
        foundShownBooks: state => state.foundBooks.slice(0, state.foundBooksPage * SHOW_AT_ONCE),
        foundBooksPage: state => state.foundBooksPage,
        nextFound: (state, getters, rootState, rootGetters) => rootGetters.next ||
            (!rootGetters.next && getters.foundShownBooks.length < getters.foundBooks.length),
        isLoading: state => state.isLoading
    },
    mutations: {
        updateSearchValue(state, value) {
            state.searchValue = value;
        },
        discardSearch(state) {
            Object.assign(state, initialState);
        },
        updateFoundBooks(state, books) {
            const searchValue = state.searchValue;

            if (!searchValue) {
                state.foundBooks = [];
                return;
            }

            this.commit('updateLoadingState', false);

            state.foundBooksPage = Math.floor(state.foundBooks.length / SHOW_AT_ONCE);
            state.foundBooks = state.foundBooks.concat(getHighlightedBooks(searchValue, books));

            const numberOfBooksToShow = (state.foundBooksPage + 1) * SHOW_AT_ONCE;
            if (this.getters.foundShownBooks.length < numberOfBooksToShow) this.dispatch('showMoreFoundBooks');
        },
        incrementFoundBooksPage(state) {
            state.foundBooksPage++;
        },
        discardFoundBooks(state) {
            state.foundBooks = [];
            state.foundBooksPage = 0;
        },
        updateLoadingState(state, loadingState) {
            state.isLoading = loadingState;
        }
    },
    actions: {
        showMoreFoundBooks(ctx) {
            if (ctx.getters.isLoading) return;

            const numberOfBooksToShow = ctx.getters.foundBooksPage * SHOW_AT_ONCE;
            const foundBooks = ctx.getters.foundBooks;
            const numberOfUnshownBooks = foundBooks.slice(numberOfBooksToShow, numberOfBooksToShow + SHOW_AT_ONCE).length;
            const areThereMoreBooksToLoad = ctx.getters.next;

            if (numberOfUnshownBooks < SHOW_AT_ONCE && areThereMoreBooksToLoad) {
                const numberOfDownloadedBooks = ctx.getters.books.length;
                ctx.commit('updateLoadingState', true);
                ctx.dispatch('fetchBooks', () => {
                    const newDownloadedBooks = ctx.getters.books.slice(numberOfDownloadedBooks);
                    ctx.commit('updateFoundBooks', newDownloadedBooks);
                });
                return;
            }

            ctx.commit('incrementFoundBooksPage');
        }
    }
};