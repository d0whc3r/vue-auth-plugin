<template>
  <div class="demo">
    <h1>Plugin Demo</h1>
    <form @submit.prevent="submit">
      <p>
        <input placeholder="Login" type="text" v-model="username">
      </p>
      <p>
        <input placeholder="Password" type="password" v-model="password">
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
    public username = 'demo';
    public password = 'demo';

    public mounted() {
      if (this.$auth.check()) {
        this.$router.push({ name: 'user' });
      }
    }

    public submit() {
      this.$auth.login({
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          console.warn('SUCCESS login', response);
        })
        .catch((err) => {
          console.error('ERROR! in login', err);
        });
    }
  }
</script>

<style>

</style>
