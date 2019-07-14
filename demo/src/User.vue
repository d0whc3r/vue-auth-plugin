<template>
    <div>
        <h1>USER SECTION</h1>
        <router-view></router-view>
    </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class User extends Vue {
  }
</script>
