<template>
  <div id="app">
    <router-view/>
    <button @click="wxApi.getLocation()">get location</button>
  </div>
</template>

<script>
import wxApi from './assets/js/wxApi'
export default {
  name: 'App',
  watch: {
    '$route.path' (v) {
      console.log('route:', v)
      wxApi.wxStart()
    }
  },
  data () {
    return {
      wxApi
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
