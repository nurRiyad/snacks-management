import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import HomeView from '@/views/HomeView.vue'
import SigninView from '@/views/SigninView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      meta: { requiresAuth: true },
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      meta: { requiresAuth: false },
      path: '/signin',
      name: 'signin',
      component: SigninView,
    },
    {
      meta: { requiresAuth: true },
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        path: '/signin',
      }
    }
  }
})

export default router
