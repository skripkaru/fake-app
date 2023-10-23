<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const { getToken } = storeToRefs(useAuthStore())
const { logout, checkUser } = useAuthStore()

onMounted(() => {
  checkUser()
})
</script>

<template>
  <ElContainer class="layout">
    <ElHeader class="header">
      <RouterLink to="/" class="logo">Fake App</RouterLink>
      <ElMenu class="menu" mode="horizontal" :ellipsis="false" :router="true">
        <ElMenuItem v-if="getToken" index="/posts" :route="{ name: 'posts' }"> Posts </ElMenuItem>
        <ElMenuItem v-if="getToken" index="/signin" :route="{ name: 'signin' }" @click="logout">
          Logout
        </ElMenuItem>
        <ElMenuItem v-if="!getToken" index="/signin" :route="{ name: 'signin' }">
          Sign In
        </ElMenuItem>
      </ElMenu>
    </ElHeader>
    <ElMain class="main">
      <RouterView></RouterView>
    </ElMain>
  </ElContainer>
</template>

<style scoped lang="scss">
.layout {
  height: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-menu-border-color);
}

.logo {
  font-weight: 500;
  font-size: 1.5rem;
  text-decoration: none;
}

.menu {
  border-bottom: none;
}

.main {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
</style>
