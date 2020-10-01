# Methods

These are the available methods, inside vue file you could use:

## Login
Login method is used to login to server using information in [loginData](./#logindata) option

```vue{18-21}
<template>
  <div>
      <h1>Login demo</h1>
      <form @submit.prevent="submit">
          <input placeholder="Login" type="text" v-model="username">
          <input placeholder="Password" type="password" v-model="password">
          <button type="submit">Login</button>
      </form>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () { return { username: null, password: null } },
  methods: {
    submit() {
      this.$auth.login({
        username: this.username,
        password: this.password,
      });
    }
  }
}
</script>
```

Object passed to `$auth.login` method will be the `data` request

## Register
Register method is used to register to server using information in [registerData](./#registerdata) option

```vue{18-21}
<template>
  <div>
      <h1>Register demo</h1>
      <form @submit.prevent="submit">
          <input placeholder="Register" type="text" v-model="username">
          <input placeholder="Password" type="password" v-model="password">
          <button type="submit">Register</button>
      </form>
    </div>
</template>

<script>
export default {
  name: 'register',
  data () { return { username: null, password: null } },
  methods: {
    submit() {
      this.$auth.register({
        username: this.username,
        password: this.password,
      });
    }
  }
}
</script>
```

Object passed to `$auth.register` method will be the `data` request

## Logout
Logout method is used to clean token and user information, it uses information in [logoutData](./#logoutdata) option

```vue{8}
<template>
  <div>Logging out...</div>
</template>
<script>
export default {
  name: 'logout',
  mounted() {
    this.$auth.logout();
  },
}
</script>
```

## Check
Check method is used to check if user is authenticated or check if user have certain role

```vue{3-5}
<template>
  <div>
    <p v-if="$auth.check()">User is logged in</p>
    <p v-if="$auth.check('ROLE_ADMIN')">User is Admin</p>
    <p v-if="$auth.check(['ROLE_ADMIN', 'ROLE_USER'])">User is Admin or user</p>
  </div>
</template>
<script>
export default {
  name: 'user-check',
}
</script>
```

## User
User method is used to get user information retrieved using information in [fetchData](./#fetchdata) option

```vue{4}
<template>
  <div>
    <p>User information:</p>
    <p>{{ $auth.user() }}</p>
  </div>
</template>
<script>
export default {
  name: 'user-info',
}
</script>
```

## Roles
Roles method is used to get user roles information it uses [rolesVar](./#rolesvar) option to get roles from user object

```vue{4}
<template>
  <div>
    <p>User roles:</p>
    <p v-for="(role, index) in $auth.roles()">{{ index }}.- {{ role }}</p>
  </div>
</template>
<script>
export default {
  name: 'user-roles',
}
</script>
```

## Token
Token method is used to get auth token received from login

```vue{4}
<template>
  <div>
    <p>Auth token:</p>
    <p>{{ $auth.token() }}</p>
  </div>
</template>
<script>
export default {
  name: 'auth-token',
}
</script>
```

## FetchUser
FetchUser method is used to force vue-auth-plugin to receive information from user using information in [fetchData](./#fetchdata) option

```vue{3}
<template>
  <div>
    <button @click="$auth.fetchUser()">Get user information</button>
  </div>
</template>
<script>
export default {
  name: 'user-fetch',
}
</script>
```

## Refresh Token
Refresh method is used to force vue-auth-plugin to update token using information in [refreshData](./#refreshdata) option

```vue{3}
<template>
  <div>
    <button @click="$auth.refresh()">Refresh token</button>
  </div>
</template>
<script>
export default {
  name: 'token-refresh',
}
</script>
```
