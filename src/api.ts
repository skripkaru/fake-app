import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

const axiosApiInstance = axios.create({
  baseURL: ''
})

axiosApiInstance.interceptors.request.use((config: any) => {
  const url = config.url
  if (!url.includes('signInWithPassword') && !url.includes('signUp')) {
    const { userInfo } = useAuthStore()
    const params = new URLSearchParams()
    params.append('auth', userInfo.token)
    config.params = params
  }
  return config
})

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const { userInfo } = useAuthStore()
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newTokens = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
          {
            grant_type: 'refresh_token',
            refresh_token: JSON.parse(localStorage.getItem('userTokens') as string).refreshToken
          }
        )
        console.log('newTokens.data', newTokens.data)
        userInfo.token = newTokens.data.access_token
        userInfo.refreshToken = newTokens.data.refresh_token
        localStorage.setItem(
          'userTokens',
          JSON.stringify({
            token: newTokens.data.access_token,
            refreshToken: newTokens.data.refresh_token
          })
        )
      } catch (e) {
        localStorage.removeItem('userTokens')
        router.push('/signin')
        userInfo.token = ''
        userInfo.refreshToken = ''
      }
    }
  }
)

export default axiosApiInstance
