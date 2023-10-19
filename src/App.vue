<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const token = computed(() => authStore.userInfo.token)

const checkUser = () => {
  const tokens = JSON.parse(localStorage.getItem('userTokens'))

  if (tokens) {
    authStore.userInfo.token = tokens.token
    authStore.userInfo.refreshToken = tokens.refreshToken
  }
}

checkUser()
</script>

<template>
  <ElContainer class="layout">
    <ElHeader class="header">
      <RouterLink to="/" class="logo">Fake App</RouterLink>
      <nav class="menu">
        <RouterLink to="/signin" v-if="token" @click.prevent="authStore.logout">Logout</RouterLink>
        <RouterLink to="/signin" v-else>Sign In</RouterLink>
      </nav>
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
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
