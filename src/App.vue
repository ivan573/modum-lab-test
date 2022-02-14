<template>
  <div id="app">
    <h1 class="title">
      Очень красивое приложение про книжки
    </h1>
    <CategoryTags
      class="tags"
      :categories="categories"
      :active-categories="activeCategories"
      @categoryCheck="handleCategoryCheck"
    />
    <SearchBar
      class="search"
      :value="searchValue"
      @searchSubmit="handleSearchSubmit"
    />
    <button
      class="discard-button"
      @click="handleDiscardClick"
    >
      Сбросить
    </button>
    <div class="books">
      <BookCard
        v-for="book in searchValue ? foundShownBooks : books"
        :key="book.id"
        :book="book"
        @click.native="handleBookCardClick(book)"
      />
    </div>
    <button
      v-show="searchValue ? areThereMoreFoundBooks : areThereMoreBooks"
      class="load-more-button"
      @click="handleLoadMoreClick"
    >
      Загрузить еще
    </button>
    <BookPopup 
      v-if="activeBook"
      :book="activeBook"
      @click.native="handlePopupClick"
    />
    <div
      v-if="activeBook"
      class="page-overlay"
      @click="handlePopupClick"
    />
  </div>
</template>

<script>
import CategoryTags from './components/CategoryTags.vue';
import SearchBar from './components/SearchBar.vue';
import BookCard from './components/BookCard.vue';
import BookPopup from './components/BookPopup.vue';
import {getArraysEquality, getStringsEquality} from './utils.js';

export default {
  name: 'App',
  components: {
    CategoryTags,
    SearchBar,
    BookCard,
    BookPopup
  },
  computed: {
    categories() {
      return this.$store.getters.allCategories; 
    },
    activeCategories() {
      return this.$store.getters.activeCategories;
    },
    books() {
      return this.$store.getters.books;
    },
    areThereMoreBooks() {
      return this.$store.getters.next;
    },
    areThereMoreFoundBooks() {
      return this.$store.getters.nextFound;
    },
    activeBook() {
      return this.$store.getters.activeBook;
    },
    searchValue() {
      return this.$store.getters.searchValue;
    },
    foundShownBooks() {
      return this.$store.getters.foundShownBooks;
    },
    routeCategories() {
      const routeQuery = this.$route.query;
      return Object.keys(routeQuery).length && routeQuery.categories ?
        routeQuery.categories.split(',').map(category => +category) :
        [];
    },
    routeSearch() {
      const routeQuery = this.$route.query;
      return Object.keys(routeQuery).length && routeQuery.search ? routeQuery.search : '';
    }
  },
  watch: {
    $route: {
      handler() {
        const areCategoriesUpdated = !getArraysEquality(this.activeCategories, this.routeCategories);
        const isSearchUpdated = !getStringsEquality(this.searchValue, this.routeSearch);

        if (areCategoriesUpdated) {
          this.$store.commit('updateActiveCategories', this.routeCategories);
          this.$store.commit('discardBooksData');
        }

        if (isSearchUpdated) {
          this.$store.commit('updateSearchValue', this.routeSearch);
          this.$store.commit('discardFoundBooks');
        }

        if (areCategoriesUpdated && !isSearchUpdated) {
          this.$store.dispatch('fetchBooks');
          return;
        }

        if (!areCategoriesUpdated && isSearchUpdated) {
          this.$store.commit('updateFoundBooks', this.books);
          return;
        }

        this.$store.dispatch('fetchBooks', () => {
            this.$store.commit('updateFoundBooks', this.books);
        }); 
      },
      immediate: true
    }
  },
  mounted() {
    this.$store.dispatch('fetchCategories');
  },
  methods: {
    handleCategoryCheck(checkedCategories) {
      if (checkedCategories.length) {
        const categories = checkedCategories.join(',');
        this.$router.push({
          name: 'Home',
          query: {categories}
        });
        return;
      }
      this.$router.push({name: 'Home'});
    },
    handleSearchSubmit(searchQuery) {
      const search = searchQuery;
      const currentSearch = this.$route.query.search;
      if (search === currentSearch) return;

      const categories = this.$store.getters.activeCategories.join(',');

      if (search && categories) {
        this.$router.push({
          name: 'Home',
          query: {
            search,
            categories
          }
        });
      }
    },
    handleDiscardClick() {
      if (this.activeCategories.length) this.$router.push({name: 'Home'});
      this.$store.commit('discardSearch');
    },
    handleBookCardClick(book) {
      this.$store.commit('updateActiveBook', book);
    },
    handleLoadMoreClick() {
      if (!this.searchValue) {
        this.$store.dispatch('fetchBooks');
        return;
      }
      this.$store.dispatch('showMoreFoundBooks');
    },
    handlePopupClick() {
      this.$store.commit('discardActiveBook');
    }
  }
};
</script>

<style>
:root {
  --main-bg-color: white;
  --card-bg-color: honeydew;
  --main-text-color: black;
  --secondary-text-color: lightslategray;
  --btn-bg-color: mintcream;
  --btn-hover-bg-color: paleturquoise;
  --border-color: lightslategray;
  --shadow-color: grey;
  --highlight-color: lightseagreen;
}

strong {
  color: var(--highlight-color);
}

#app {
  margin: 32px;
  background: var(--main-bg-color);
  font-family: Arial, sans-serif;
  color: lightslategray;
}

.title {
  margin: 0 auto 16px;
  width: fit-content;
  color: var(--main-text-color);
}

.tags {
  margin-bottom: 16px;
}

.search {
  margin-bottom: 16px;
}

.discard-button,
.load-more-button {
  margin: 0 auto;
  padding: 8px;
  display: block;
  border: 1px solid var(--main-text-color);
  border-radius: 8px;
  background-color: var(--btn-bg-color);
  color: var(--main-text-color);
  cursor: pointer;
}

.discard-button:hover,
.load-more-button:hover {
  background-color: var(--btn-hover-bg-color);
}


.discard-button {
  margin-bottom: 32px;
}

.books {
  margin-bottom: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.page-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.3;
  z-index: 2;
}
</style>
