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
    foundShownBooks: [],
    foundBooksPage: 0,
    nextFound: false
};

export default {
    state: {...initialState},
    getters: {
        searchValue: state => state.searchValue,
        foundBooks: state => state.foundBooks,
        foundShownBooks: state => state.foundShownBooks,
        foundBooksPage: state => state.foundBooksPage,
        nextFound: state => state.nextFound
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
                state.foundShownBooks = [];
                return;
            }

            const numberOfBooksToShow = (state.foundBooksPage + 1) * SHOW_AT_ONCE;

            state.foundBooks = state.foundBooks.concat(getHighlightedBooks(searchValue, books));
            state.foundShownBooks = state.foundBooks.slice(0, numberOfBooksToShow);

            const areThereMoreBooks = state.foundBooks.length > state.foundShownBooks.length || this.getters.next;
            this.commit('updateNextFound', areThereMoreBooks);

            if (state.foundShownBooks.length < numberOfBooksToShow) {
                this.dispatch('showMoreFoundBooks');
                return;
            }

            this.commit('incrementFoundBooksPage');
        },
        updateFoundShownBooks(state, books) {
            state.foundShownBooks = books;
        },
        incrementFoundBooksPage(state) {
            state.foundBooksPage++;
        },
        updateNextFound(state, next) {
            state.nextFound = next;
        },
        discardFoundBooks(state) {
            state.foundBooks = [];
            state.foundShownBooks = [];
            state.foundBooksPage = 0;
            state.nextFound = false;
        }
    },
    actions: {
        showMoreFoundBooks(ctx) {
            const shownBooks = ctx.getters.foundShownBooks;
            const foundBooks = ctx.getters.foundBooks;
            const remainingBooks = foundBooks.slice(shownBooks.length, shownBooks.length + SHOW_AT_ONCE);
            const moreBooksToLoad = this.getters.next;

            if (remainingBooks.length >= SHOW_AT_ONCE) {
                ctx.commit('updateFoundShownBooks', shownBooks.concat(remainingBooks.slice(0, SHOW_AT_ONCE)));
                ctx.commit('updateNextFound', moreBooksToLoad);
                ctx.commit('incrementFoundBooksPage');
                return;
            }

            if (remainingBooks.length < SHOW_AT_ONCE && moreBooksToLoad) {
                const oldBooksLength = ctx.getters.books.length;
                ctx.dispatch('fetchBooks', () => {
                    const newBooks = ctx.getters.books.slice(oldBooksLength);
                    ctx.commit('updateFoundBooks', newBooks);
                });
                return;
            }

            ctx.commit('updateFoundShownBooks', foundBooks);
            ctx.commit('updateNextFound', false);
        }
    }
};