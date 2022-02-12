<template>
  <div id="app">
    <h1 class="title">
      Очень красивое приложение про книжки
    </h1>
    <CategoryTags
      :categories="categories"
      :active-categories="activeCategories"
    />
    <button
      class="discard-button"
      @click="_handleDiscardClick"
    >
      Сбросить
    </button>
    <div class="books">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
    </div>
    <button
      v-show="areThereMoreBooks"
      class="load-more-button"
      @click="_handleLoadMoreClick"
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
import BookCard from './components/BookCard.vue';
import BookPopup from './components/BookPopup.vue';
import PageOverlay from './components/PageOverlay.vue';

export default {
  name: 'App',
  components: {
    CategoryTags,
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
    activeBook() {
      return this.$store.getters.activeBook;
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
      this.$store.commit('updateActiveCategories', this.routeCategories);

      this.$store.commit('discardPage');
      if (!this.activeCategories.length) {
        this.$store.commit('discardBooksData');
        return;
      }
      await this.$store.dispatch('fetchBooks');
    },
    immediate: true
  }},
  async mounted() {
    await this.$store.dispatch('fetchCategories');
  },
  methods: {
    _handleDiscardClick() {
      if (this.activeCategories.length) this.$router.push({name: 'Home'});
    },
    async _handleLoadMoreClick() {
      await this.$store.dispatch('fetchBooks');
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
