<template>
    <div>
        <h1>ADMIN SECTION</h1>
        <router-view></router-view>
    </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Admin extends Vue {
  }
</script>
