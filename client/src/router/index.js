import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkflowView from '../views/WorkflowView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    // 'new' must come before ':id' so it is not matched as an id
    { path: '/workflows/new', component: WorkflowView },
    { path: '/workflows/:id', component: WorkflowView },
  ],
})
