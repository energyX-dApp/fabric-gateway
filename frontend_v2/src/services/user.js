import { api } from './api'

export async function signup({ username, email, unhashedPassword, orgKey }) {
  const res = await api.post('/signup', { username, email, unhashedPassword, orgKey })
  return res.data
}

export async function signin({ email, unhashedPassword }) {
  const res = await api.post('/signin', { email, unhashedPassword })
  return res.data
}

export async function myProfile() {
  const res = await api.get('/myProfile')
  return res.data
}


