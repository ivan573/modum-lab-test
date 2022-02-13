<template>
  <div
    class="page-overlay"
    @click="handleOverlayClick"
  />
</template>

<script>
export default {
  methods: {
    handleOverlayClick() {
      this.$store.commit('discardActiveBook');
    }
  }
};
</script>

<style>
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