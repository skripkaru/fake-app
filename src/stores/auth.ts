import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axiosApiInstance from '../api'
import router from '@/router'
import type { User } from '@/interfaces/user'

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

export const useAuthStore = defineStore('auth', () => {
  const loading = ref<boolean>(false)
  const error = ref<string>('')
  const userInfo = ref({
    token: '',
    email: '',
    userId: '',
    refreshToken: ''
  } as User)

  const getToken = computed(() => userInfo.value.token)

  const signUp = async (payload: { email: string; password: string }) => {
    loading.value = true
    error.value = ''
    try {
      const response = await axiosApiInstance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true
        }
      )
      console.log('response', response.data)
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
      console.log('e', e)
      switch (e?.response?.data.error.message) {
        case 'EMAIL_EXISTS':
          error.value = 'Email exists'
          break
        case 'OPERATION_NOT_ALLOWED':
          error.value = 'Operation not allowed'
          break
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          error.value = 'Too many attempts try later not allowed'
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

  const signIn = async (payload: { email: string; password: string }) => {
    loading.value = true
    error.value = ''
    try {
      const response = await axiosApiInstance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true
        }
      )
      console.log('response.data', response.data)
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
      router.push('/')
    } catch (e: any) {
      console.log('e', e)
      switch (e?.response?.data.error.message) {
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

  const checkUser = () => {
    const tokens = JSON.parse(localStorage.getItem('userTokens') as string)

    if (tokens) {
      userInfo.value.token = tokens.token
      userInfo.value.refreshToken = tokens.refreshToken
    }
  }

  return {
    loading,
    userInfo,
    getToken,
    signUp,
    signIn,
    logout,
    checkUser
  }
})
