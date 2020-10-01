# Options

Default options
```javascript
const options = {
  authMeta: 'auth',
  rolesVar: 'roles',
  tokenDefaultName: 'default_auth_token',
  userDefaultName: 'default_auth_user',
  tokenStore: ['vuex', 'localStorage', 'cookie'],
  headerTokenReplace: '{auth_token}',
  tokenType: 'Bearer',
  vuexStoreSpace: 'vue-auth',

  authRedirect: '/login',

  loginData: {
    url: '/auth/login',
    method: 'POST',
    redirect: '/user',
    headerToken: 'Authorization',
    fetchUser: false,
    (optional) customToken: (response) => response.data['token'],
  },
  registerData: {
    url: '/auth/register',
    method: 'POST',
    redirect: '/user',
    headerToken: 'Authorization',
    fetchUser: false,
    (optional) customToken: (response) => response.data['token'],
  },
  logoutData: {
    url: '/auth/logout',
    method: 'POST',
    redirect: '/login',
    makeRequest: false,
  },
  fetchItem: '',
  fetchData: {
    url: '/auth/user',
    method: 'GET',
    interval: 30,
    enabled: false,
  },
  refreshData: {
    url: '/auth/refresh',
    method: 'GET',
    interval: 30,
    enabled: false,
  },
};
```

> The default options can be imported and merged with custom options [installation](../installation.md#usage)

## authMeta
`string`

Key to use in vue-router meta to identify a protected route, example:

```javascript{13-15,21-23,29-31}
new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        auth: true,
      },
      component: User,
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {
        auth: 'ROLE_ADMIN',
      },
      component: Admin,
    },
    {
      path: '/friends',
      name: 'friends',
      meta: {
        auth: ['ROLE_ADMIN', 'ROLE_OTHER'],
      },
      component: Friends,
    },
  ],
});
```
In this example `/user` route will be protected with authentication.
And `/admin` is only accessible by users who have role *ROLE_ADMIN* otherwise, `/friends` is only accessible by users who have role *ROLE_ADMIN* or role *ROLE_OTHER*

## rolesVar
`string`

Key in user object to identify roles, it is used in [$auth.roles](./methods.html#roles) method, example of user object:

```javascript{5}
const user = {
  username: 'demo',
  firstName: 'User',
  lastName: 'Test',
  roles: ['ROLE_ADMIN', 'ROLE_USER'],
  email: 'demo@demo',
}
```
## tokenDefaultName
`string`

Key to use when information of `auth token` is saved in localStorage, sessionStorage and cookies

## userDefaultName
`string`

Key to use when information of `user object` is saved in localStorage, sessionStorage and cookies

## tokenStore
`'localStorage' | 'sessionStorage' | 'cookie' | 'vuex'`

Location to save token and user object and only could be:
- `localStorage`: for window.localStorage
- `sessionStorage`: for window.sessionStorage
- `cookie`: for document.cookie
- `vuex`: for vuex store, it need to be installed in project en exposed in Vue object

Example of simple store file
```javascript{8}
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.store = store;

export default store;
```

`Vue.store = store;` is important for vue-auth-plugin to work with vuex

> If you use any other `tokenStore` it could be used to persist vuex information when refresh

## headerTokenReplace
`string`

Key to replace in headers for the auth token, example:

```javascript{5}
this.$http({
  url,
  method,
  headers: {
    'Authorization': 'Bearer {auth_token}',
  },
});
```

## tokenType
`'Bearer' | 'Basic' | ''`

Token type to use when need to fetch user data

## vuexStoreSpace
`string`

If `vuex` is used as **tokenStore** this will be the key of namespaced module in vuex, then you could use vuex getters called:
- \<vuexStoreSpace>/getUser
- \<vuexStoreSpace>/getToken
- \<vuexStoreSpace>/getRoles

## authRedirect
`string`

Path to redirect using vue-router when login is required

## loginData
`{ url: string, method: GET | POST, redirect?: string, headerToken: string, fetchUser?: boolean, customToken?: (response: AxiosResponse) => string, fetchData?: (response: AxiosResponse) => any }`

Configuration used when [$auth.login](./methods.html#login) function was called

- `url`: Url to call for login process (using vue-axios)
- `method`: Method to use in call for login process. Only 'GET' or 'POST' supported
- `redirect`: *Optional*, path to redirect when login was success (using vue-router). If set to `null`, the previous path is recorded in a query parameter and restored after successful login.
- `headerToken`: Name of the header with authorization code, usually *Authorization*
- `fetchUser`: *Optional*, indicates if user information will be fetched once the login process was success
- `customToken`: *Optional*, function to get token, it receives the response object from axios and must to return the string token
- `fetchData`: *Optional*, function to get user info, it receives the response object from axios and must to return the object representing user info

## registerData
`{ url: string, method: GET | POST, redirect?: string, headerToken: string, fetchUser?: boolean, customToken?: (response: AxiosResponse) => string, fetchData?: (response: AxiosResponse) => any }`

Configuration used when [$auth.register](./methods.html#register) function was called

- `url`: Url to call for register process (using vue-axios)
- `method`: Method to use in call for register process. Only 'GET' or 'POST' supported
- `redirect`: *Optional*, path to redirect when register was success (using vue-router). If set to `null`, the previous path is recorded in a query parameter and restored after successful register.
- `headerToken`: Name of the header with authorization code, usually *Authorization*
- `fetchUser`: *Optional*, indicates if user information will be fetched once the login process was success
- `customToken`: *Optional*, function to get token, it receives the response object from axios and must to return the string token
- `fetchData`: *Optional*, function to get user info, it receives the response object from axios and must to return the object representing user info

## logoutData
`{ url?: string, method?: GET | POST, redirect?: string, makeRequest?: string }`

Configuration used when [$auth.logout](./methods.html#logout) function was called

- `url`: *Optional* Url to call for logout process (using vue-axios)
- `method`: *Optional* Method to use in call for logout process. Only 'GET' or 'POST' supported
- `redirect`: *Optional*, path to redirect when logout was success (using vue-router)
- `makeRequest`: *Optional*, indicates if `url` need to be called at logout

## fetchItem
`string`

Configure key in fetch object to identify user information

## fetchData
`{ url?: string, method?: GET | POST, interval?: number, enabled?: boolean }`

Configuration to use when login process was success and/or every <`interval`> minutes, the received information could be shown in [$auth.user](./methods.html#user) method

- `url`: *Optional* Url to call for fetch process (using vue-axios)
- `method`: *Optional* Method to use in call for fetch process. Only 'GET' or 'POST' supported
- `interval`: *Optional*, minutes to repeat fetch process, if 401 is received in response petition, user will be logged out
- `enabled`: *Optional*, indicates if fetch process is enabled

## refreshData
`{ url?: string, method?: GET | POST, interval?: number, enabled?: boolean }`

Configuration to use when login process was success and/or every <`interval`> minutes to refresh token stored in application

- `url`: *Optional* Url to call for refresh token process (using vue-axios)
- `method`: *Optional* Method to use in call for refresh token process. Only 'GET' or 'POST' supported
- `interval`: *Optional*, minutes to repeat refresh token process, if 401 is received in response petition, user will be logged out
- `enabled`: *Optional*, indicates if refresh token process is enabled
