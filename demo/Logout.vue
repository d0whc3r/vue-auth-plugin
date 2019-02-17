<template>
  <div>Logging out...</div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Logout extends Vue {
    mounted() {
      this.$auth.logout({ redirect: '/' });
    }
  }
</script>

<style>

</style>
