<template>
  <div>
    This is only visible for logged users
    <br>
    <button @click="checkApi">Check example {{dataResponse}}</button>
    <br>
    <router-link to="/logout">Logout</router-link>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class User extends Vue {
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
