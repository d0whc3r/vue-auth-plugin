# Installation

## Direct Download / CDN

https://unpkg.com/vue-auth-plugin/dist/vue-auth-plugin 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue-auth-plugin@{{ $version }}/dist/vue-auth-plugin.js
 
Include vue-auth-plugin after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-auth-plugin/dist/vue-auth-plugin.js"></script>
```

## NPM

```sh
$ npm install vue-auth-plugin
```

## Yarn

```sh
$ yarn add vue-auth-plugin
```

When used with a module system, you must explicitly install the `vue-auth-plugin` via `Vue.use()`:

```javascript
import Vue from 'vue'
import Vueauth from 'vue-auth-plugin'

Vue.use(Vueauth)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `vue-auth-plugin` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com/d0whc3r/vue-auth-plugin.git node_modules/vue-auth-plugin
$ cd node_modules/vue-auth-plugin
$ npm install
$ npm run build
```

