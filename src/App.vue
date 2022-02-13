<template>
  <div id="app">
    <h1 class="title">
      Очень красивое приложение про книжки
    </h1>
    <CategoryTags
      :categories="categories"
      :active-categories="activeCategories"
    />
    <SearchBar :value="searchValue" />
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
    />
    <PageOverlay
      v-show="activeBook"
    />
  </div>
</template>

<script>
import CategoryTags from './components/CategoryTags.vue';
import SearchBar from './components/SearchBar.vue';
import BookCard from './components/BookCard.vue';
import BookPopup from './components/BookPopup.vue';
import PageOverlay from './components/PageOverlay.vue';

export default {
  name: 'App',
  components: {
    CategoryTags,
    SearchBar,
    BookCard,
    BookPopup,
    PageOverlay
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
      const  routeQuery = this.$route.query;
      return Object.keys(routeQuery).length && routeQuery.categories ?
        routeQuery.categories.split(',').map(category => +category) :
        [];
    }
  },
  watch: {
    $route: {
      async handler() {
        this.$store.commit('discardSearch');
        this.$store.commit('updateActiveCategories', this.routeCategories);

        this.$store.commit('discardPage');
        if (!this.activeCategories.length) {
          this.$store.commit('discardBooksData');
          return;
        }

        await this.$store.dispatch('fetchBooks');
      },
      immediate: true
    },
    searchValue() {
      this.$store.commit('discardFoundBooks');
      this.$store.commit('updateFoundBooks', this.books);
    }
  },
  async mounted() {
    await this.$store.dispatch('fetchCategories');
  },
  methods: {
    handleDiscardClick() {
      if (this.activeCategories.length) this.$router.push({name: 'Home'});
      this.$store.commit('discardSearch');
    },
    async handleLoadMoreClick() {
      if (!this.searchValue) {
        await this.$store.dispatch('fetchBooks');
        return;
      }
      this.$store.dispatch('showMoreFoundBooks');
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
</style>
