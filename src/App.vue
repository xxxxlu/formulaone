<script setup lang="ts">
import Header from './layout/header.vue';
import Footer from './layout/footer.vue';

</script>

<template>
  <Header />
  <router-view></router-view>
  <Footer />
</template>
s
<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
