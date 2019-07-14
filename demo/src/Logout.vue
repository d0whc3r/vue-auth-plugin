<template>
  <div>Logging out...</div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Logout extends Vue {
    public mounted() {
      this.$auth.logout();
    }
  }
</script>

<style>

</style>
