<template>
  <div class="search-bar">
    <input
      ref="search"
      class="search-bar__value"
      type="text"
      placeholder="Поиск по книгам"
      :value="value"
    >
    <button
      class="search-bar__button"
      @click="handleSearchButtonClick"
    >
      Найти
    </button>
  </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: () => ''
        }
    },
    methods: {
        handleSearchButtonClick() {
          const currentSearch = this.$route.query.search;
          const search = this.$refs.search.value.trim();

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
        }
    }
};
</script>

<style>
  .search-bar {
    margin: 0 auto 16px;
    width: fit-content;
    display: flex;
    gap: 8px;
  }

  .search-bar__value {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }

  .search-bar__button {
    padding: 8px;
    border: 1px solid var(--main-text-color);
    border-radius: 8px;
    background-color: var(--btn-bg-color);
    color: var(--main-text-color);
    cursor: pointer;
    user-select: none;
}

  .search-bar__button:hover {
    background-color: var(--btn-hover-bg-color);
  }
</style>