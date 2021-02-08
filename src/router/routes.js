
const routes = [
  {
    path: '',
    component: () => import('pages/Login.vue')
    // children: [
    //   { path: '/main', component: () => import('layouts/MainLayout.vue') }
    //   // { path: '', component: () => import('pages/Index.vue') }
    // ]
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
      // { path: '/beneficiaries', component: () => import('pages/Beneficiary.vue') },
      // { path: '/school-grantees', component: () => import('pages/SchoolGrantee.vue') },
      // { path: '/health-grantees', component: () => import('pages/HealthGrantee.vue') },
      // { path: '/dismissed', component: () => import('pages/Dismissed.vue') }
    ]
  },
  {
    path: '/register',
    component: () => import('pages/Register.vue')
    // children: [
    //   // { path: '', component: () => import('pages/Login.vue') },
    //   { path: '/beneficiaries', component: () => import('pages/Beneficiary.vue') },
    //   { path: '/school-grantees', component: () => import('pages/SchoolGrantee.vue') },
    //   { path: '/health-grantees', component: () => import('pages/HealthGrantee.vue') },
    //   { path: '/dismissed', component: () => import('pages/Dismissed.vue') }
    // ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
