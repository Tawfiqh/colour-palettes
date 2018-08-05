<template>

  <div >
    <h3>This is the 👋 page.</h3>
    <helloworld msg="Welcome to Your HI PAGE Vue.js App"/>

  </div>

</template>

<script>

import helloworld from '../components/helloworld.vue';

export default {
  name: 'Hello',
  components: {
    helloworld
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
