<template>
  <div
    class="book-card"
    @click="_handleCardClick"
  >
    <h3 class="book-card__name">
      {{ book.name }}
    </h3>
    <p class="book-card__description">
      {{ book.description }}
    </p>
    <p class="book-card__author">
      Автор: {{ book.author }}
    </p>
    <p class="book-card__year">
      Год выпуска: {{ book.year }}
    </p>
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
        _handleCardClick() {
            this.$store.commit('setActiveBook', this.book);
        }
    }
};
</script>

<style>
.book-card {
    padding: 4px;
    border-radius: 8px;
    background-color: var(--card-bg-color);
    cursor: pointer;
    user-select: none;
}

.book-card:hover {
    transform: translate(4px, -4px);
}

.book-card__name {
    color: var(--main-text-color);
}
</style>