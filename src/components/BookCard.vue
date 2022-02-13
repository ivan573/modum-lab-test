<template>
  <div
    class="book-card"
    @click="handleCardClick"
  >
    <h3
      class="book-card__name"
      v-html="book.name"
    />
    <p
      class="book-card__description"
      v-html="book.description"
    />
    <p
      class="book-card__author"
      v-html="'Автор: ' + book.author"
    />
    <p
      class="book-card__year"
      v-html="'Год выпуска: ' + book.year"
    />
  </div>
</template>

<script>
export default {
    props: {
        book: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        handleCardClick() {
            this.$store.commit('updateActiveBook', this.book);
        }
    }
};
</script>

<style>
.book-card {
    padding: 16px;
    border-radius: 8px;
    background-color: var(--card-bg-color);
    cursor: pointer;
    user-select: none;
}

.book-card:hover {
    transform: scale(1.01);
    box-shadow: 4px 4px 8px 0px var(--shadow-color);
}

.book-card__name {
    color: var(--main-text-color);
}
</style>