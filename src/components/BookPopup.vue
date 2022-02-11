<template>
  <div
    class="book-popup"
    @click="_handlePopupClick"
  >
    <h3 class="book-popup__name">
      {{ book.name }}
    </h3>
    <p class="book-popup__author">
      {{ book.author }}
    </p>
    <p class="book-popup__year">
      {{ book.year }}
    </p>
    <img
      class="book-popup__cover"
      :src="book.image"
      :alt="book.name"
    >
    <p class="book-popup__description">
      {{ book.description }}
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
        _handlePopupClick() {
            this.$store.commit('discardActiveBook');
        }
    }
};
</script>

<style>
.book-popup {
    padding: 16px;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
    width: 30vw;
    z-index: 3;
    background-color: var(--main-bg-color);
    box-shadow: 4px 4px 8px 0px var(--shadow-color);
    overflow-y: auto;
}

.book-popup__cover {
    max-height: 160px;
}

.book-popup__name,
.book-popup__author,
.book-popup__year {
    color: var(--main-text-color);
}
</style>