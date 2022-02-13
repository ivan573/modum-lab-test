<template>
  <form class="category-tags">
    <template
      v-for="category in categories"
    >
      <input
        :id="category.id"
        :key="'input' + category.id"
        class="category-tags__checkbox"
        type="checkbox"
        :name="category.id"
        :checked="checkActiveness(category.id)"
        @change="handleCategoryCheck"
      >
      <label
        :key="'label' + category.id"
        :for="category.id"
        class="category-tags__label"
      >{{ category.name }}</label>
    </template>
  </form>
</template>

<script>
export default {
    props: {
        categories: {
            type: Array,
            default: () => []
        },
        activeCategories: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleCategoryCheck() {
            const formData = new FormData(this.$el);
            const checkedCategories = [];
            for (var key of formData.keys()) {
                checkedCategories.push(+key);
            }

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
        checkActiveness(id) {
            return this.activeCategories.find(el => el === id);
        }
    }
};
</script>

<style>
.category-tags {
    margin: 0 auto 16px;
    width: fit-content;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.category-tags__checkbox {
    display: none;
}

.category-tags__label {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--btn-bg-color);
    cursor: pointer;
    user-select: none;
}

.category-tags__label:hover {
    background-color: var(--btn-hover-bg-color);
}

.category-tags__checkbox:checked + .category-tags__label {
    border-color: var(--main-text-color);
    color: var(--main-text-color);
}
</style>