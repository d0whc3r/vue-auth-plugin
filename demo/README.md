# Vue Auth plugin DEMO

This is a demo of vue-auth-plugin working

# Components

In this demo a mock server in [mockserver.ts](./mockserver.ts), it is configured with express and express-jwt to run with demo code.

This demo also have a [Login page](./Login.vue), [Logout page](./Logout.vue) and [User page](./User.vue)

## Login page

Only have a form with user/password and call mockserver to get a valid jwt token

## Logout page

Page to inform vue-auth-plugin to logout (clean credentials)

## User page

Sample usage of different methods to get cached information (token, and user)

# Configuration file

The configuration file example for the plugin is [vue-auth.ts](./plugins/vue-auth.ts)

# Other plugins

There are other plugins configured in this demo project located in [plugins folder](./plugins)

## Required plugins

[vue-axios](./plugins/vue-axios.ts) is a required plugin for vue-auth-plugin

[vue-router](./plugins/vue-router.ts) is a required plugin for vue-auth-plugin

[vuex](./plugins/vuex.ts) is an optional dependency for vue-auth-plugin  
