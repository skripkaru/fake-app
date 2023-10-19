import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axiosApiInstance from '../api'
import router from '@/router'

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

export const useAuthStore = defineStore('auth', () => {
  const loading = ref<boolean>(false)
  const error = ref<string>('')
  const userInfo = ref({
    token: '',
    email: '',
    userId: '',
    refreshToken: ''
  })

  const auth = async (payload: any, type: string) => {
    const stringUrl = type === 'signup' ? 'signUp' : 'signInWithPassword'
    loading.value = true
    error.value = ''
    try {
      const response = await axiosApiInstance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true
        }
      )
      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken
      }
      localStorage.setItem(
        'userTokens',
        JSON.stringify({
          token: userInfo.value.token,
          refreshToken: userInfo.value.refreshToken
        })
      )
    } catch (e: any) {
      switch (e.response.data.error.message) {
        case 'EMAIL_EXISTS':
          error.value = 'Email exists'
          break
        case 'OPERATION_NOT_ALLOWED':
          error.value = 'Operation not allowed'
          break
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          error.value = 'Too many attempts try later not allowed'
          break
        case 'EMAIL_NOT_FOUND':
          error.value = 'Email not found'
          break
        case 'INVALID_PASSWORD':
          error.value = 'Invalid password'
          break
        case 'USER_DISABLED':
          error.value = 'User disabled'
          break
        default:
          error.value = 'Error'
      }

      ElMessage({
        message: error.value,
        type: 'error'
      })

      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('userTokens')
    userInfo.value = {
      token: '',
      email: '',
      userId: '',
      refreshToken: ''
    }
    router.push('/signin')
  }

  return {
    loading,
    userInfo,
    auth,
    logout
  }
})
