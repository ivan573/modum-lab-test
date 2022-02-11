<template>
  <div
    class="category-tag"
    :class="category.isActive ? 'category-tag_active' : null"
    @click="handleClick"
  >
    {{ category.name }}
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleClick() {
      this.$store.commit('toggleCategoryActiveness', this.category);
    }
  }
};
</script>

<style>
.category-tag {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--btn-bg-color);
  cursor: pointer;
  user-select: none;
}

.category-tag_active {
  border-color: var(--main-text-color);
  color: var(--main-text-color);
}

.category-tag:hover {
  background-color: var(--btn-hover-bg-color);;
}
</style>
