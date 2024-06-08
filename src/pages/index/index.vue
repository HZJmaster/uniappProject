<script setup lang="ts">
import { ref } from 'vue'
import { getHomeBannerAPI, getHomeCategoryAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import { onLoad } from '@dcloudio/uni-app'
import type { BannerItem, CategoryItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])

const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
})
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 自定义轮播图 -->
  <XtxSwiper :list="bannerList" />
  <CategoryPanel :list="categoryList" />
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
</style>
