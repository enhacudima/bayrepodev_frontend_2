import { createStore } from 'vuex'
import axios from 'axios'
import { AbilityBuilder, Ability } from '@casl/ability'
import { ability } from '../Helpers/ability'
import Cookies from 'js-cookie'
import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'
import '@/Helpers/interceptors'

const vuexLocal = new VuexPersistence({
  storage: localForage,
  asyncStorage: true,
  reducer: (stateData) => ({
    token: stateData.token,
    userName: stateData.userName,
    userCategory: stateData.userCategory,
    id: stateData.id,
    uuid: stateData.uuid,
    status: stateData.status,
    cookieMinutes: stateData.cookieMinutes,
    permissions: stateData.permissions,
    locale: stateData.locale
  })
})

export default createStore({
  state: {
    token: Cookies.get('token' + import.meta.env.VITE_APP_PORT),
    userName: Cookies.get('userName' + import.meta.env.VITE_APP_PORT),
    userCategory: Cookies.get('userCategory' + import.meta.env.VITE_APP_PORT),
    id: Cookies.get('id' + import.meta.env.VITE_APP_PORT),
    uuid: Cookies.get('uuid' + import.meta.env.VITE_APP_PORT),
    status: Cookies.get('status' + import.meta.env.VITE_APP_PORT),
    cookieMinutes: Cookies.get('cookieMinutes' + import.meta.env.VITE_APP_PORT),
    passwordDate: Cookies.get('passwordDate' + import.meta.env.VITE_APP_PORT),
    userAvatar: Cookies.get('userAvatar' + import.meta.env.VITE_APP_PORT),
    permissions: null,
    locale: Cookies.get('locale' + import.meta.env.VITE_APP_PORT)
  },
  getters: {
    isLogged: (state) => !!state.token,
    token: (state) => state.token,
    userName: (state) => state.userName,
    userCategory: (state) => state.userCategory,
    id: (state) => state.id,
    uuid: (state) => state.uuid,
    status: (state) => state.status,
    cookieMinutes: (state) => state.cookieMinutes,
    passwordDate: (state) => state.passwordDate,
    permissions: (state) => state.permissions,
    userAvatar: (state) => state.userAvatar,
    locale: (state) => state.locale
  },

  mutations: {
    resetStateData(state) {
      let newState = {}
      Object.assign(state, newState)
    },
    setUserData(state, userData) {
      if (userData) {
        state.permissions = userData.permissions
        axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`
        const expires = new Date(new Date().getTime() + userData.cookieMinutes * 60 * 1000)
        Cookies.set(
          'cookieMinutes' + import.meta.env.VITE_APP_PORT,
          userData.cookieMinutes /*, { expires: expires }*/
        )
        Cookies.set('token' + import.meta.env.VITE_APP_PORT, userData.token, { expires: expires })
        Cookies.set(
          'userName' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.name +
            ' ' +
            userData.logged_in_user.lname /*, { expires: expires }*/
        )
        Cookies.set(
          'userCategory' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.title /*, { expires: expires }*/
        )
        Cookies.set(
          'id' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.id /*, { expires: expires }*/
        )
        Cookies.set(
          'uuid' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.uuid /*, { expires: expires }*/
        )
        Cookies.set(
          'status' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.status /*, { expires: expires }*/
        )
        Cookies.set(
          'passwordDate' + import.meta.env.VITE_APP_PORT,
          userData.passwordDate /*, { expires: expires }*/
        )
        Cookies.set(
          'status' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.status /*, { expires: expires }*/
        )
        Cookies.set(
          'userAvatar' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.avatar /*, { expires: expires }*/
        )
        Cookies.set(
          'locale' + import.meta.env.VITE_APP_PORT,
          userData.logged_in_user.locale /*, { expires: expires }*/
        )
      }
    },
    setUserPermission(state) {
      const { can, rules } = new AbilityBuilder(Ability)
      can(JSON.parse(state.permissions), 'all')
      ability.update(rules)
    },

    clearUserData() {
      Cookies.remove('permissions' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('token' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('userName' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('userCategory' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('id' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('uuid' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('status' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('cookieMinutes' + import.meta.env.VITE_APP_PORT)
      Cookies.remove('passwordDate' + import.meta.env.VITE_APP_PORT)
      localForage.removeItem('vuex')
    }
  },
  //commit('setUserData', response.data)
  actions: {
    login({ commit }, credentials) {
      const links = {
        nat: '/v1/login',
        windows: '/v1/login-windows'
      }
      return axios.post(links[credentials.type], credentials).then((response) => {
        commit('setUserData', response.data)
        commit('setUserPermission', response.data)
      })
    },

    logout({ commit }) {
      return axios
        .post('/v1/logout-device')
        .then(() => {
          commit('clearUserData')
          commit('resetStateData')
          location.href = '/'
        })
        .catch(() => {
          commit('clearUserData')
          commit('resetStateData')
          location.href = '/'
        })
    },

    clearCookies({ commit }) {
      commit('clearUserData')
      commit('resetStateData')
    },

    logoutAll({ commit }) {
      return axios
        .post('/v1/logout-all-devices')
        .then(() => {
          commit('clearUserData')
          commit('resetStateData')
          location.href = '/'
        })
        .catch(() => {
          commit('clearUserData')
          commit('resetStateData')
          location.href = '/'
        })
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin]
})
