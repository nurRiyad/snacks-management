import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import HomeView from '@/views/HomeView.vue'
import SigninView from '@/views/SigninView.vue'
import SnacksView from '@/views/SnacksView.vue'
import AdminView from '@/views/AdminView.vue'
import NotFound from '@/views/NotFound.vue'
import MoneyTable from '@/views/MoneyTable.vue'
import EditView from '@/views/EditView.vue'

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
      path: '/snacks',
      name: 'snacks',
      component: SnacksView,
    },
    {
      meta: { requiresAuth: true },
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/balance',
      name: 'balance',
      component: MoneyTable,
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditView,
    },
    {
      meta: { requiresAuth: false },
      path: '/signin',
      name: 'signin',
      component: SigninView,
    },
    {
      path: '/aboutme',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
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
