<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const email = ref('')
const password = ref('')
const { loading } = storeToRefs(useAuthStore())
const { signUp } = useAuthStore()
</script>

<template>
  <div class="container">
    <ElCard class="card">
      <h1>Sign Up</h1>
      <ElForm>
        <ElFormItem>
          <ElInput v-model="email" placeholder="Email" size="large" />
        </ElFormItem>
        <ElFormItem>
          <ElInput v-model="password" type="password" placeholder="Password" size="large" />
        </ElFormItem>
        <ElButton
          type="primary"
          size="large"
          @click="signUp({ email: email, password: password })"
          :disabled="loading"
        >
          Sign up
        </ElButton>
        <ElDivider />
        <div>
          Are you already registered?
          <RouterLink to="/signin">Sign in</RouterLink>
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
