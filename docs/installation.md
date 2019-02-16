# Installation

## Direct Download / CDN

https://unpkg.com/vue-cli-plugin-auth-jwt/dist/vue-cli-plugin-auth-jwt 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue-cli-plugin-auth-jwt@{{ $version }}/dist/vue-cli-plugin-auth-jwt.js
 
Include vue-cli-plugin-auth-jwt after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-cli-plugin-auth-jwt/dist/vue-cli-plugin-auth-jwt.js"></script>
```

## NPM

```sh
$ npm install vue-cli-plugin-auth-jwt
```

## Yarn

```sh
$ yarn add vue-cli-plugin-auth-jwt
```

When used with a module system, you must explicitly install the `vue-cli-plugin-auth-jwt` via `Vue.use()`:

```javascript
import Vue from 'vue'
import Vueauth from 'vue-cli-plugin-auth-jwt'

Vue.use(Vueauth)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `vue-cli-plugin-auth-jwt` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com/d0whc3r/vue-cli-plugin-auth.git node_modules/vue-cli-plugin-auth-jwt
$ cd node_modules/vue-cli-plugin-auth-jwt
$ npm install
$ npm run build
```

