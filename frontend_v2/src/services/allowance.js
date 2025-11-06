import { api, authHeaders } from './api'

export async function listAllowances() {
  const res = await api.get('/allowances', { headers: authHeaders() })
  return res.data
}

export async function readAllowance(id) {
  const res = await api.get(`/allowances/${id}`, { headers: authHeaders() })
  return res.data
}

export async function transferAllowance(id, newOwner) {
  const res = await api.post(`/allowances/${id}/transfer`, { newOwner }, { headers: authHeaders() })
  return res.data
}

export async function consumeAllowance(id, amountKg) {
  const res = await api.post(`/allowances/${id}/consume`, { amountKg }, { headers: authHeaders() })
  return res.data
}

export async function ownerBalance(ownerMsp) {
  const res = await api.get(`/allowances/owner/${ownerMsp}/balance`, { headers: authHeaders() })
  return res.data
}


