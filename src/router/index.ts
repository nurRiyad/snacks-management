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
      path: '/last-orders',
      name: 'last-orders',
      component: () => import('@/views/LastOrders.vue'),
    },
    {
      meta: { requiresAuth: true },
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      meta: { requiresAuth: true },
      path: '/admin/balance',
      name: 'balance',
      component: MoneyTable,
    },
    {
      meta: { requiresAuth: true },
      path: '/admin/edit',
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
      meta: { requiresAuth: true },
      path: '/about-me',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      meta: { requiresAuth: false },
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
