# Installation

## Direct Download / CDN

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/@d0whc3r/vue-auth-plugin@{{ $version }}/dist/vue-auth-plugin.umd.min.js
 
Include vue-auth-plugin after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/@d0whc3r/vue-auth-plugin/dist/vue-auth-plugin.umd.min.js"></script>
```

## NPM

```sh
$ npm install @d0whc3r/vue-auth-plugin --save
```

## Yarn

```sh
$ yarn add @d0whc3r/vue-auth-plugin
```

## Usage

When used with a module system, you must explicitly install the plugin via `Vue.use()`:

```javascript
import Vue from 'vue';
import VueAuth from '@d0whc3r/vue-auth-plugin';

const options = { ... };

Vue.use(VueAuth, options);
```

> Options could be consulted in [Options section](./guide/)

## Use vue-router and vuex

### Configure vue-router

To make this plugin working you need to explicit declare router to Vue object, this could be done when you define your routes

Vue router config:
```vue
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({ ... });

(Vue as any).router = router;

export default router;
```

### Configure vuex

If you want to use vuex as storage you need to explicit declare vuex store in Vue object, this could be done when you define your store

Vuex config:
```vue
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({ ... });

(Vue as any).store = store;

export default store;
```

## Dev Build

You will have to clone directly from GitHub and build `vue-auth-plugin` yourself if
you want to use the latest dev build.

```sh
$ mkdir -p node_modules/@d0whc3r/vue-auth-plugin
$ git clone https://github.com/d0whc3r/vue-auth-plugin.git node_modules/@d0whc3r/vue-auth-plugin
$ cd node_modules/@d0whc3r/vue-auth-plugin
$ npm install
$ npm run build
```

