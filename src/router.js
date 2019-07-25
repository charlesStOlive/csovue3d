import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
//
import store from './store/'
//
import guest from './middleware/guest'
import auth from './middleware/auth'
import isSubscribed from './middleware/isSubscribed'
import middlewarePipeline from './middlewarePipeline'

import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Movies from '@/components/Movies'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      middleware: [
        guest
      ]
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      middleware: [
        auth
      ]
    },
    children: [{
      path: '/dashboard/movies',
      name: 'dashboard.movies',
      component: Movies,
      meta: {
        middleware: [
          auth,
          isSubscribed
        ]
      }
    }],
  }
  ]
})

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware

  const context = {
    to,
    from,
    next,
    store
  }


  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })

})

export default router