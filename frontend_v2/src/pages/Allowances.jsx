import { useEffect, useState } from 'react'
import AllowanceTable from '../components/AllowanceTable.jsx'
import { listAllowances, readAllowance, transferAllowance, consumeAllowance } from '../services/allowance'

export default function Allowances() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')
  const [newOwner, setNewOwner] = useState('')
  const [amountKg, setAmountKg] = useState('')

  const load = async () => {
    const lst = await listAllowances()
    setItems(Array.isArray(lst)? lst: [])
  }
  useEffect(()=>{ load() }, [])

  const onRead = async (id) => { setSelected(await readAllowance(id)) }
  const onTransfer = async () => { if (selected?.id && newOwner) { await transferAllowance(selected.id, newOwner); await load() } }
  const onConsume = async () => { if (selected?.id && amountKg) { await consumeAllowance(selected.id, Number(amountKg)); await load() } }

  const filtered = items.filter(a=> (a.id||'').toLowerCase().includes(filter.toLowerCase()) || (a.owner||'').toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="page">
      <div className="card" style={{ marginBottom:16 }}>
        <input className="input" placeholder="Search by ID or Owner" value={filter} onChange={e=> setFilter(e.target.value)} />
      </div>
      <div className="card">
        <AllowanceTable items={filtered} onRead={onRead} />
      </div>
      {selected && (
        <div className="card" style={{ marginTop:16, display:'grid', gap:10 }}>
          <div><b>ID:</b> {selected.id}</div>
          <div><b>Owner:</b> {selected.owner}</div>
          <div><b>Total:</b> {selected.total}</div>
          <div><b>Remaining:</b> {selected.remaining}</div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input className="input" placeholder="Transfer to MSP" value={newOwner} onChange={e=> setNewOwner(e.target.value)} />
            <button className="btn" onClick={onTransfer}>Transfer</button>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input className="input" placeholder="Consume amount (kg)" type="number" value={amountKg} onChange={e=> setAmountKg(e.target.value)} />
            <button className="btn" onClick={onConsume}>Consume</button>
          </div>
        </div>
      )}
    </div>
  )
}


