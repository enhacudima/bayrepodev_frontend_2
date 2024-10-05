<template>
  <div class="global-search-wrapper" :style="{ marginBottom: '24px', width: '100%' }">
    <a-card :title="$t('search')" style="width: 100%">
      <a-input-search v-model:value="value" :placeholder="$t('searchHere')" :loading="state.fetching" enter-button />
    </a-card>
  </div>
  <a-skeleton active :loading="loading">
    <template v-if="dataSource.data != undefined && dataSource.data.length">
      <a-row :gutter="16">
        <a-col :span="8" v-for="(item, index) in dataSource.data" :key="index">
          <a-card hoverable small :style="{ marginBottom: '24px' }">
            <a-card-meta :title="item.name">
              <template #description>
                <p>{{ item.description }}</p>
                  <a-list size="small" bordered >
                    <a-list-item>
                      {{ item.name }}
                      <template #actions>
                        <a key="list-loadmore-edit" @click="onUnlink(item.name, item.link)" ><api-outlined :style="{ color: 'hotpink' }" /></a>
                        <router-link :to="item.link">
                          <CompassOutlined />
                        </router-link>
                      </template>
                    </a-list-item>
                  <template #header>
                    <div>Links</div>
                  </template>
                </a-list>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
      <br />
      <a-row justify="end">
        <a-pagination v-model:current="pagination.current" v-model:page-size="pagination.perPage"
          :total="pagination.total" :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
          @change="onChangePageNumber" />
      </a-row>
    </template>
    <a-empty v-else />
  </a-skeleton>
</template>
<script>
import { CompassOutlined, ApiOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, onMounted, reactive, watch, } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash-es'


export default defineComponent({
  components: {
     ApiOutlined, CompassOutlined, 
  },
  setup() {
    const pagination = ref({
      current: 1,
      perPage: 15,
    });
    const dataSource = ref();
    const loading = ref(true);
    const fetch = () => {
      loading.value = true
      let u = (`page=${pagination.value.current}&perPage=${pagination.value.perPage}`).toString();
      axios.get('/v1/favorites?' + u)
        .then(response => {
          dataSource.value = response.data
          loading.value = false
          pagination.value = {
            perPage: parseInt(dataSource.value.per_page),
            current: parseInt(dataSource.value.current_page),
            total: parseInt(dataSource.value.total),
          };
        })
    };
    onMounted(() => {
      fetch()
    });

    const onChangePageNumber = pageNumber => {
      //console.log(pageNumber)
      pagination.value.current = pageNumber
      fetch()
    };

    const state = reactive({
      data: [],
      fetching: false,

    });
    const value = ref();
    const fetchDevice = debounce(value => {
      //console.log('fetching user', value);
      dataSource.value = '';
      state.fetching = true;
      if (value)
        axios.get('v1/find/favorites/' + value)
          .then(response => {
            dataSource.value = response.data;
            state.fetching = false;
            loading.value = false
          });
      else
        state.fetching = false;
      loading.value = false
    }, 500);



    watch(value, () => {
      dataSource.value = '';
      fetchDevice(value.value)
      state.fetching = false;
      loading.value = true
    });
    const dataTimeFormat = (d) => {
      var date = format(new Date(d), 'yyyy-MM-dd hh:mm:ss')
      if (date == "NaN-aN-aN") {
        date = "1900-01-01 00:00:00"
      }
      return date;
    };
    const onUnlink = (name, url) =>{
      axios.post('/v1/favorite/remove/link',
        {
          'name': name,
          'url': url
        }
      )
      .then(response => {
          response
          fetch()
        })
    }
    function format(x, y) {
      var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
      };
      y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
      });

      return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
      });
    }

    return {
      dataSource,
      dataTimeFormat,
      loading,
      state,
      value,
      pagination,
      onChangePageNumber,
      onUnlink
    }

  }
});
</script>