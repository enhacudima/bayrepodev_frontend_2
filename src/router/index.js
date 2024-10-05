import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/loginView.vue'
import NProgress from 'nprogress'
import Cookies from 'js-cookie'
import { ability } from '../Helpers/ability.js'
import store from '@/stores/index.js'
import localForage from 'localforage'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Login
    },
    {
      name: 'login-nat',
      path: '/login-nat',
      component: () => import('../views/Auth/NatView.vue'),
      meta: {
        layout: 'LayoutDefault'
      }
    },

    {
      name: 'forgot-password',
      path: '/forgot-password',
      component: () => import('../views/Auth/ForgetPassword.vue'),
      meta: {
        layout: 'LayoutDefault'
      }
    },

    {
      name: 'reset-password',
      path: '/reset-password',
      component: () => import('../views/Auth/ResetPassword.vue'),
      meta: {
        layout: 'LayoutDefault'
      }
    },

    {
      name: 'reset-password-result',
      path: '/reset-password-result',
      component: () => import('@/views/Auth/ForgetPasswordResult.vue'),
      meta: {
        layout: 'LayoutDefault'
      }
    },

    {
      path: '/:catchAll(.*)', // Unrecognized path automatically matches 404
      name: '404',
      component: () => import('../components/Helpers/Errors/NotFound.vue')
    },
    {
      name: '403',
      path: '/403',
      component: () => import('../components/Helpers/Errors/NoPermission.vue')
    },
    {
      name: 'device-blocked',
      path: '/device-blocked',
      component: () => import('../components/Helpers/Errors/IpBlocked.vue')
    },
    {
      name: 'home',
      path: '/home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/Client/FavoriteList.vue'),
      meta: {
        resource: 'home',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '1',
        menu: '3',
        breadcrumb: ['home', 'favorite']
      }
    },
    {
      name: 'applications',
      path: '/applications',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '@/views/Client/ApplicationsList.vue'),
      meta: {
        resource: 'home',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '1',
        menu: '2',
        breadcrumb: ['home', 'applications']
      }
    },
    {
      name: 'favorites',
      path: '/favorites',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/Client/FavoriteList.vue'),
      meta: {
        resource: 'home',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '1',
        menu: '3',
        breadcrumb: ['home', 'favorites']
      }
    },
    {
      path: '/shared-files',
      name: 'shared-files',
      component: () => import('../views/Services/ShareFiles/BoxView.vue'),
      meta: {
        layout: 'Public'
      }
    },
    {
      path: '/wh-pending-approval',
      name: 'wh-pending-approval',
      component: () => import('../views/DigiBay/whPendingApproval/PendingView.vue'),
      meta: {
        resource: 'wh_pending_approval',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'digibay', 'pending']
      }
    },

    {
      path: '/baylend-xml',
      name: 'baylend-xml',
      component: () => import('../views/Baylend/ConsdisList.vue'),
      meta: {
        resource: 'baylend_xml',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'baylend', 'xml']
      }
    },

    {
      path: '/pep-form',
      name: 'pep-form',
      component: () => import('../views/Screening/Pep/Form/pepForm.vue'),
      meta: {
        resource: 'blacklists-peps-create-form',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'screening', 'pepform']
      }
    },
    {
      path: '/pep-form-view',
      name: 'pep-form-view',
      component: () => import('../views/Screening/Pep/Form/pepFormList.vue'),
      meta: {
        resource: 'blacklists-peps-create',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'screening', 'pepformview']
      }
    },

    {
      path: '/screening-center-notifications',
      name: 'screening-center-notifications',
      component: () =>
        import('../views/Screening/CenterNotification/Notifications/PendingView.vue'),
      meta: {
        resource: 'screening-center-notifications',
        layout: 'LayoutMaster',
        nav: '1',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'screening', 'centerNotification']
      }
    },

    {
      path: '/services-outbound',
      name: 'services-outbound',
      component: () => import('../views/Services/Outbound/OuntBound/CampaingView.vue'),
      meta: {
        resource: 'telesales',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'service', 'outbound']
      }
    },

    {
      path: '/box-search',
      name: 'box-search',
      component: () => import('../views/Services/Box/tabBoxView.vue'),
      meta: {
        resource: 'box-search',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'service', 'boxview']
      }
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/Services/IndexView.vue'),
      meta: {
        resource: 'services', //to be update
        layout: 'LayoutMaster',
        nav: '2',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'service']
      }
    },

    {
      path: '/services-sms-bound-dashboard',
      name: 'services-sms-bound-dashboard',
      component: () => import('../views/Services/Outbound/Sms/Dashboard/DashboardView.vue'),
      meta: {
        resource: 'sms_bound',
        title: 'SMS Bound | Dashboard',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '2',
        menu: '4',
        breadcrumb: ['home', 'service', 'smsBound', 'dashboard']
      }
    },

    {
      path: '/services-sms-bound-queue',
      name: 'services-sms-bound-queue',
      component: () => import('../views/Services/Outbound/Sms/Dashboard/QueueView.vue'),
      meta: {
        resource: 'sms_bound',
        title: 'SMS Bound | Queue',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '2',
        menu: '5',
        breadcrumb: ['home', 'service', 'smsBound', 'queue']
      }
    },

    {
      path: '/services-sms-bound',
      name: 'services-sms-bound',
      component: () => import('../views/Services/Outbound/Sms/Bound/BoundList.vue'),
      meta: {
        resource: 'sms_bound',
        title: 'SMS Bound | Bound',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '2',
        menu: '1',
        breadcrumb: ['home', 'service', 'smsBound', 'list']
      }
    },
    {
      path: '/services-sms-bound-code/:uuid',
      name: 'services-sms-bound-code',
      component: () => import('../views/Services/Outbound/Sms/Bound/BoundView.vue'),
      meta: {
        resource: 'sms_bound',
        title: 'SMS Bound | Bound',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '2',
        menu: '1',
        breadcrumb: ['home', 'service', 'smsBound', 'list']
      }
    },
    {
      path: '/services-sms-bound-template',
      name: 'services-sms-bound-template',
      component: () => import('../views/Services/Outbound/Sms/Template/TemplateList.vue'),
      meta: {
        resource: 'sms_bound_template', //to be update
        title: 'SMS Bound | Template',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '2',
        menu: '2',
        breadcrumb: ['home', 'service', 'smsBound', 'template', 'list']
      }
    },

    //SMS bound upload

    {
      path: '/services-sms-bound-upload',
      name: 'services-sms-bound-upload',
      component: () => import('../views/Services/Outbound/Sms/Upload/UploadList.vue'),
      meta: {
        resource: 'sms_bound_import', //to be update
        title: 'SMS Bound | Upload',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '2',
        menu: '3',
        breadcrumb: ['home', 'service', 'smsBound', 'upload', 'list']
      }
    },

    {
      path: '/services-bigfiles',
      name: 'services-bigfiles',
      component: () => import('../views/Services/BigFile/BigFileIndex.vue'),
      meta: {
        resource: 'bigfile', //to be update
        title: 'Big Files',
        layout: 'LayoutMaster',
        nav: '2',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'service', 'bigfiles']
      }
    },

    {
      path: '/others',
      name: 'others',
      component: () => import('../views/Others/IndexView.vue'),
      meta: {
        resource: 'others',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'other']
      }
    },
    {
      path: '/others-access-user-new',
      name: 'others-access-user-new',
      component: () => import('../views/Others/Access/UserNew.vue'),
      meta: {
        resource: 'access_user_new',
        title: 'User Creation',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '3',
        menu: '2',
        breadcrumb: ['home', 'other', 'user', 'access']
      }
    },
    {
      path: '/others-access-user-list',
      name: 'others-access-user-list',
      component: () => import('../views/Others/Access/UserList.vue'),
      meta: {
        resource: 'access_user_list',
        title: 'User List',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '3',
        menu: '1',
        breadcrumb: ['home', 'other', 'user', 'access', 'list']
      }
    },
    {
      path: '/others-access-devices',
      name: 'others-access-devices',
      component: () => import('../views/Others/Access/Devices/DevicesList.vue'),
      meta: {
        resource: 'access_user_list',
        title: 'User List',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '3',
        menu: '3',
        breadcrumb: ['home', 'other', 'user', 'devices', 'list']
      }
    },
    {
      path: '/others-access-user-password-change',
      name: 'others-access-user-password-change',
      component: () => import('../views/Others/Access/UserPassword.vue'),
      meta: {
        resource: 'access_user_password_change',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'other', 'profile', 'change_password']
      }
    },
    {
      path: '/others-access-roles',
      name: 'others-access-roles',
      component: () => import('./../views/Others/Access/Roles/RolesAd.vue'),
      meta: {
        resource: 'access_roles',
        title: 'Roles',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '3',
        menu: '2',
        breadcrumb: ['home', 'other', 'access', 'roles']
      }
    },
    //end services
    {
      path: '/others-apps-approvals',
      name: 'others-apps-approvals',
      component: () => import('../views/Others/AppAprovals/ApproversView.vue'),
      meta: {
        resource: 'apps_approvals',
        title: 'App Approvals',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '0',
        menu: '3',
        breadcrumb: ['home', 'other', 'apps_approvals']
      }
    },
    {
      path: '/others-products',
      name: 'others-products',
      component: () => import('../views/Others/Settings/Product/ProductView.vue'),
      meta: {
        resource: 'products',
        title: 'App Product',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '0',
        menu: '0',
        breadcrumb: ['home', 'other', 'products']
      }
    },
    {
      path: '/others-settings-sms',
      name: 'others-settings-sms',
      component: () => import('../views/Services/Outbound/Sms/Dashboard/DashboardView.vue'),
      meta: {
        resource: 'access_roles',
        title: 'SMS API Dashboard',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '5',
        menu: '2',
        breadcrumb: ['home', 'other', 'settings', 'sms', 'dashboard']
      }
    },

    {
      path: '/others-settings-sms-feature',
      name: 'others-settings-sms-feature',
      component: () => import('../views/Others/Settings/SMS/SMSView.vue'),
      meta: {
        resource: 'access_roles',
        title: 'SMS Feature',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '5',
        menu: '2',
        breadcrumb: ['home', 'other', 'settings', 'sms', 'feature']
      }
    },

    {
      path: '/loan-simulator-payment-plan',
      name: 'loan-simulator-payment-plan',
      component: () => import('../views/Loan/Simulator/AmountPaymentPlan/IndexView.vue'),
      meta: {
        resource: 'loan_simulator_payment_plan',
        title: 'Loan Simulator - Payment Plan',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '0',
        menu: '3',
        breadcrumb: ['home', 'loan', 'simulator', 'payment_plan']
      }
    },
    {
      path: '/loan-simulator-amount',
      name: 'loan-simulator-amount',
      component: () => import('../views/Loan/Simulator/Amount/IndexView.vue'),
      meta: {
        resource: 'loan_simulator_amount',
        title: 'Loan Simulator - Loan Amount',
        layout: 'LayoutMaster',
        nav: '4',
        sider: '0',
        menu: '3',
        breadcrumb: ['home', 'loan', 'simulator', 'loan_amount']
      }
    }
  ]
})

const DEFAULT_TITLE = 'MZ Portal'

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})
router.beforeEach(async (to) => {
  await store.restored
  const cache = await localForage.getItem('vuex')
  var permissions = ''
  try {
    permissions = cache.permissions
  } catch (error) {
    permissions
  }
  const token = Cookies.get('token' + import.meta.env.VITE_APP_PORT)
  const cookieMinutes = Cookies.get('cookieMinutes' + import.meta.env.VITE_APP_PORT)
  const expires = new Date(new Date().getTime() + cookieMinutes * 60 * 1000)
  const passwordDate = Cookies.get('passwordDate' + import.meta.env.VITE_APP_PORT)

  ;(async () => {})()
  const canNavigate = to.matched.some((route) => {
    if (route.meta.resource) {
      return ability.can(route.meta.resource)
    }
    return true
  })

  if (token) {
    Cookies.set('token' + import.meta.env.VITE_APP_PORT, token, { expires: expires })
  }
  document.title = to.meta.title || DEFAULT_TITLE
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = [
    '/',
    '/login-nat',
    '/forgot-password',
    '/403',
    '/:catchAll(.*)',
    '/device-blocked'
  ]
  const authRequired = !publicPages.includes(to.path)
  if (to.path != '/' && authRequired && (!token || !permissions)) {
    return '/'
  } else if (!canNavigate && authRequired) {
    return '/403'
  }

  if (to.path == '/' && token && permissions) {
    return '/home'
  }

  if (
    to.path != '/others-access-user-password-change' &&
    authRequired &&
    !passwordDate | (passwordDate.length == 0)
  ) {
    return '/others-access-user-password-change'
  }
})

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
