import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routes = [
  { path: '/',
    component: () =>{ return import ('./pages/Upload');}
  },
  { path: '/hi',
    component: () =>{ return import ('./pages/Hello.vue');}
  },
  { path: '*',
    redirect: '/'
  },

];

const router = new VueRouter({
  routes
});


export default router;
