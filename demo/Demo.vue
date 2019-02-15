<template>
    <div class="demo">
        <h1>Plugin Demo</h1>
        <p>add: {{ a }} + {{ b }} = {{ $add(a, b) }}</p>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class Demo extends Vue {
    a = 1;
    b = 1;
  }
</script>

<style>

</style>
