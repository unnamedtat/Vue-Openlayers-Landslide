<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
        <MapVue ref="mapInstance" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapVue from '@/components/map/map.vue'
export default {
  name: 'Dashboard',
  components: {
    MapVue
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
