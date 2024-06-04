<template>
  <view class="my">
    <view>会员信息：{{ memberStore.profile }}</view>
    <button
      @tap="
        memberStore.setProfile({
          nickname: '黄先生',
          token: '12312312',
        })
      "
      size="mini"
      plain
      type="primary"
    >
      保存用户信息
    </button>
    <button @tap="memberStore.clearProfile()" size="mini" plain type="warn">清理用户信息</button>
    <button @tap="getData" size="mini" plain type="primary">测试请求</button>
  </view>
</template>

<script lang="ts" setup>
import { useMemberStore } from '@/stores'
import { http } from '@/utils/http'
const memberStore = useMemberStore()

async function getData() {
  const res = await http({
    method: 'GET',
    url: '/member/profile',
  })
  console.log(res)
}
</script>

<style scoped></style>
