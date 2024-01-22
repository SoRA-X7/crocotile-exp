import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ExperimentView from '@/views/ExperimentView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/exp',
      name: 'experiment',
      component: ExperimentView
    }
  ]
});

export default router;
