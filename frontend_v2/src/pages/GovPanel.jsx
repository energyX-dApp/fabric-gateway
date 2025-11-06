import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createAllowance, revokeAllowance } from '../services/gov'
import { listAllowances } from '../services/allowance'

export default function GovPanel() {
  const { orgKey } = useAuth()
  const [createForm, setCreateForm] = useState({ id:'', owner:'Org1MSP', totalKg:'', note:'' })
  const [revokeId, setRevokeId] = useState('')
  const [reason, setReason] = useState('')
  const [items, setItems] = useState([])

  useEffect(()=>{ listAllowances().then(setItems) }, [])

  const submitCreate = async (e) => { e.preventDefault(); await createAllowance({ ...createForm, totalKg: Number(createForm.totalKg) }); alert('Created'); }
  const submitRevoke = async (e) => { e.preventDefault(); if (!revokeId) return; await revokeAllowance(revokeId, reason); alert('Revoked') }

  if (orgKey !== 'Gov') return <div className="page"><div className="card">Forbidden: Gov only</div></div>
  return (
    <div className="page">
      <div className="row">
        <div className="card" style={{ minWidth:320 }}>
          <h3>Mint New Allowance</h3>
          <form onSubmit={submitCreate} style={{ display:'grid', gap:10 }}>
            <input className="input" placeholder="ID" value={createForm.id} onChange={e=> setCreateForm(f=> ({...f, id:e.target.value}))} />
            <select className="input" value={createForm.owner} onChange={e=> setCreateForm(f=> ({...f, owner:e.target.value}))}>
              <option>Org1MSP</option><option>Org2MSP</option>
            </select>
            <input className="input" type="number" placeholder="Total Kg" value={createForm.totalKg} onChange={e=> setCreateForm(f=> ({...f, totalKg:e.target.value}))} />
            <input className="input" placeholder="Note" value={createForm.note} onChange={e=> setCreateForm(f=> ({...f, note:e.target.value}))} />
            <button className="btn" type="submit">Create</button>
          </form>
        </div>
        <div className="card" style={{ minWidth:320 }}>
          <h3>Revoke Allowance</h3>
          <form onSubmit={submitRevoke} style={{ display:'grid', gap:10 }}>
            <select className="input" value={revokeId} onChange={e=> setRevokeId(e.target.value)}>
              <option value="">Select Allowance</option>
              {items.map(a=> <option key={a.id} value={a.id}>{a.id} · {a.owner}</option>)}
            </select>
            <input className="input" placeholder="Reason (optional)" value={reason} onChange={e=> setReason(e.target.value)} />
            <button className="btn" type="submit">Revoke</button>
          </form>
        </div>
      </div>
    </div>
  )
}


