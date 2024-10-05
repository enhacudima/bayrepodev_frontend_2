<template>
  <a-sub-menu key="subLocale">
    <template #title><span :class="'fi fi-' + locale.flag"></span> {{ locale.title }} </template>
    <a-menu-item-group>
      <a-menu-item
        v-for="(locale, key) in localesList"
        :key="key"
        @click="onChangeLocale(locale.lang)"
      >
        <span :class="'fi fi-' + locale.flag"></span> {{ locale.title }}
      </a-menu-item>
    </a-menu-item-group>
  </a-sub-menu>
</template>
<script>
import '/node_modules/flag-icons/css/flag-icons.min.css'
import i18n from '../../Locale/i18n'
import eventBus from '@/Helpers/event-bus'
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import localesList from '../../Locale/localesList.json'
import axios from 'axios'
export default {
  components: {},
  setup() {
    const locale = ref([])
    const localeStore = Cookies.get('locale' + import.meta.env.VITE_APP_PORT)
    onMounted(() => {
      onChangeLocale(localeStore)
      eventBus.$on('Locale-Update', (locale) => {
        onChangeLocale(locale)
      })
    })
    const onChangeLocale = (lang) => {
      i18n.global.locale = lang
      locale.value = localesList[lang]
      if (localeStore !== lang)
        axios
          .get('v1/me/locale-refresh/' + lang)
          .then(Cookies.set('locale' + import.meta.env.VITE_APP_PORT, lang))
    }

    return {
      locale,
      onChangeLocale,
      localesList
    }
  }
}
</script>
