<style scoped>
  div.links a {
    margin-left: 1rem;
  }
</style>
<template>
  <div>
    This is only visible for logged users
    <br>
    <button @click="checkApi">Check example {{dataResponse}}</button>
    <br>
    <router-link to="/logout">Logout</router-link>
    <br>
    <br>
    <div class="links">
      <router-link to="/">/</router-link>
      <router-link to="/user">/user</router-link>
      <router-link to="/admin">/admin</router-link>
      <router-link to="/admin/auth">/admin/auth</router-link>
    </div>
    <br>
    <h1>Token</h1>
    <h2>Using $auth</h2>
    {{ $auth.token() }}
    <h2>Using Vuex</h2>
    {{ token }}
    <h2>Using localStorage</h2>
    {{ localStorage.getItem('default_auth_token') }}
    <h2>Using Cookie</h2>
    {{ cookieToken[2] }}
    <br>
    <h1>User</h1>
    <h2>Using $auth</h2>
    {{ $auth.user() }}
    <h2>Using Vuex</h2>
    {{ user }}
    <h2>Using localStorage</h2>
    {{ localStorage.getItem('default_auth_user') }}
    <h2>Using Cookie</h2>
    {{ cookieUser[2] }}
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { namespace } from 'vuex-class';

  const NAuth = namespace('vue-auth');
  @Component
  export default class User extends Vue {
    @NAuth.Getter('getToken') token: string[];
    @NAuth.Getter('getUser') user: string[];
    localStorage = window.localStorage;
    cookieToken = document.cookie.match(new RegExp('(^| )default_auth_token=([^;]+)')) || [];
    cookieUser = document.cookie.match(new RegExp('(^| )default_auth_user=([^;]+)')) || [];

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
