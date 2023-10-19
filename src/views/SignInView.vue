<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const { auth } = useAuthStore()
const { loading } = storeToRefs(useAuthStore())
const router = useRouter()

const signIn = async () => {
  await auth({ email: email.value, password: password.value }, 'signin')
  router.push('/')
}
</script>

<template>
  <div class="container">
    <ElCard class="card">
      <h1>Sign In</h1>
      <ElForm>
        <ElFormItem>
          <ElInput v-model="email" placeholder="Email" size="large" />
        </ElFormItem>
        <ElFormItem>
          <ElInput v-model="password" type="password" placeholder="Password" size="large" />
        </ElFormItem>
        <ElButton type="primary" size="large" @click="signIn" :disabled="loading">Sign in</ElButton>
        <ElDivider />
        <div>
          Are you not registered yet?
          <RouterLink to="/signup">Sign up</RouterLink>
        </div>
      </ElForm>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
}

.card {
  width: 100%;
  max-width: 400px;
  margin: auto;
}
</style>
