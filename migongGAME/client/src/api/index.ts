import axios from 'axios'

export const api = axios.create({
  baseURL: '',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth')
  if (auth) {
    const { token } = JSON.parse(auth)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth')
    }
    return Promise.reject(err)
  },
)
