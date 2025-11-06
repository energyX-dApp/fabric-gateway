import { useState } from 'react'
import { api, authHeaders } from '../services/api'

export default function Trade() {
  const [targetOrg, setTargetOrg] = useState('Org2')
  const [allowanceId, setAllowanceId] = useState('')
  const [amountKg, setAmountKg] = useState('')
  const [desc, setDesc] = useState('')
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault(); setResult(null)
    try {
      const res = await api.post('/executeTrade', {
        tradeReceiver: targetOrg,
        tradeAmount: Number(amountKg),
        description: desc,
        allowanceId,
      }, { headers: authHeaders() })
      setResult({ ok:true, data: res.data })
    } catch (e2) {
      setResult({ ok:false, error: e2?.response?.data || 'Trade failed' })
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth:560 }}>
        <h2>Initiate Trade</h2>
        <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
          <select className="input" value={targetOrg} onChange={e=> setTargetOrg(e.target.value)}>
            <option>Org1</option><option>Org2</option>
          </select>
          <input className="input" placeholder="Allowance ID" value={allowanceId} onChange={e=> setAllowanceId(e.target.value)} />
          <input className="input" placeholder="Amount (kg)" type="number" value={amountKg} onChange={e=> setAmountKg(e.target.value)} />
          <input className="input" placeholder="Description" value={desc} onChange={e=> setDesc(e.target.value)} />
          <button className="btn" type="submit">Submit</button>
        </form>
        {result && <div className="muted" style={{ marginTop:10 }}>{result.ok? 'Success' : 'Error'}: {JSON.stringify(result, null, 2)}</div>}
      </div>
    </div>
  )
}


