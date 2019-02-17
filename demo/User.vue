<template>
  <div>
    This is only visible for logged users
    <br>
    <button @click="checkApi">Check example {{dataResponse}}</button>
    <br>
    <router-link to="/logout">Logout</router-link>
    <br>
    <h1>User</h1>
    <h2>Using $auth</h2>
    {{ $auth.user() }}
    <h2>Using Vuex</h2>
    {{ user }}
    <h2>Using localStorage</h2>
    {{ localStorage.getItem('auth_user') }}
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {namespace} from 'vuex-class';

  const NAuth = namespace('vue-auth');
  @Component
  export default class User extends Vue {
    @NAuth.Getter('getUser') user: string[];
    localStorage = window.localStorage;

    dataResponse: any = null;

    checkApi() {
      this.$http({
        url: '/api/check',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer {auth_token}',
        },
      })
        .then(({ data }) => {
          console.log('Check response:', data);
          this.dataResponse = data;
        })
        .catch((error) => {
          console.error('Check error:', error);
        });
    }
  }
</script>

<style>

</style>
