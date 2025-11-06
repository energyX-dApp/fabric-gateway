import axios from 'axios'

export const API_BASE_URL = 'https://energyx_api.guywithxm5.in'

export const api = axios.create({ baseURL: API_BASE_URL })

export function authHeaders() {
  const token = localStorage.getItem('token')
  const orgKey = localStorage.getItem('orgKey')
  const h = {}
  if (token) h['Authorization'] = `Bearer ${token}`
  if (orgKey) h['x-org'] = orgKey
  return h
}


