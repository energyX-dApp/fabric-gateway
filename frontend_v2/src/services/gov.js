import { api, authHeaders } from './api'

export async function createAllowance(payload) {
  const res = await api.post('/gov/allowances', payload, { headers: authHeaders() })
  return res.data
}

export async function revokeAllowance(id, reason = '') {
  const res = await api.post(`/gov/allowances/${id}/revoke`, { reason }, { headers: authHeaders() })
  return res.data
}


