import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import PostsView from '@/views/PostsView.vue'
import PostView from '@/views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView,
      meta: {
        auth: true
      }
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostView,
      meta: {
        auth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { userInfo } = storeToRefs(useAuthStore())

  if (to.meta.auth && !userInfo.token) {
    next('signin')
  } else {
    next()
  }
})

export default router
