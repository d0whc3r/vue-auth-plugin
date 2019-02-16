<template>
  <div class="demo">
    <h1>Plugin Demo</h1>
    <form @submit="submit">
      <p>
        <input v-model="username" type="text" placeholder="Login">
      </p>
      <p>
        <input v-model="password" type="password" placeholder="Password">
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
    <router-link :to="{ name: 'user' }">Go to private section</router-link>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Login extends Vue {
    username = 'demo';
    password = 'demo';

    mounted() {
      if (this.$auth.check()) {
        this.$router.push({ name: 'user' });
      }
    }

    submit() {
      this.$auth.login({
        username: this.username,
        password: this.password,
      });
    }
  }
</script>

<style>

</style>
