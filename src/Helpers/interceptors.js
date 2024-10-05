import axios from 'axios'
import store from '@/stores/index'
import EventBus from './event-bus'
import router from '../router'
import Cookies from 'js-cookie'
import i18n from '../Locale/i18n.js'

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL

const t = (str) => i18n.global.t(str)
const CancelToken = axios.CancelToken
const source = CancelToken.source()
source.cancel('Operation canceled by the user.')

axios.interceptors.request.use(
  (request) => {
    const token = Cookies.get('token' + import.meta.env.VITE_APP_PORT)
    const cookieMinutes = store.getters.cookieMinutes
    const expires = new Date(new Date().getTime() + cookieMinutes * 60 * 1000)
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
      request['headers']['common'] /*['Accept']*/ = 'application/json; charset=utf-8'
      Cookies.set('token' + import.meta.env.VITE_APP_PORT, token, { expires: expires })
    }
    CancelToken.source.token
    return request
  },
  function (err) {
    store.dispatch('logout')
    //  Request error
    return Promise.reject(err)
  }
)

//  Add response interceptors
axios.interceptors.response.use(
  function (response) {
    if (response.status && response.data) {
      const status = response.status
      const data = response.data
      statusCode(status, data)
    }
    return response
  },
  function (error) {
    if (error.response && error.response) {
      const status = error.response.status
      const data = error.response.data
      statusCode(status, data)
    }
    return Promise.reject(error)
  }
)

function event(type, title = null, text, color) {
  EventBus.$emit(type, {
    title: title,
    text: text,
    color: color,
    model: true
  })
}
function statusCode(status, data) {
  if (status === 200) {
    if (data.success) {
      var color
      if (data.color) {
        color = data.color
      } else {
        color = 'success'
      }
      event('snackBar', '', data.success, color)
    }
  } else if (status === 401) {
    event('snackBar', '', t('error401'), 'warning')
    router.push('/').catch(() => {})
  } else if (status === 403) {
    if (data.message) {
      event('snackBar', '', data.message, 'error')
    } else {
      //router.push('/device-blocked').catch(()=>{}); //don't touch
    }
  } else if (status === 404) {
    event('snackBar', '', t('error404'), 'error')
  } else if (status === 422) {
    if (data.errors) {
      composerMessage(data.errors)
    } else if (data.error) {
      event('snackBar', '', data.error, 'warning')
    }
  } else if (status === 429) {
    event('snackBar', '', t('error429'), 'warning')
  } else if (status === 500) {
    event('snackBar', '', t('error500'), 'error')
  } else {
    event('snackBar', '', t('errorElse'), 'info')
  }
}

function composerMessage(params) {
  for (let [key, value] of Object.entries(params)) {
    event('notificationM', t('errorValidation'), `${text(key)}: ${value}`, 'error')
  }
}
function text(params) {
  return params.replaceAll('_', ' ').toUpperCase()
}
