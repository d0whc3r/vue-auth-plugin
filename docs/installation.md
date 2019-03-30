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

## Dev Build

You will have to clone directly from GitHub and build `vue-auth-plugin` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com/d0whc3r/vue-auth-plugin.git node_modules/vue-auth-plugin
$ cd node_modules/vue-auth-plugin
$ npm install
$ npm run build
```

