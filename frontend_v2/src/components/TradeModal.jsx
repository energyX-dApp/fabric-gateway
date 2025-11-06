export default function TradeModal({ open, onClose, onSubmit }) {
  if (!open) return null
  let targetOrg = 'Org2', allowanceId = '', amountKg = ''
  return (
    <div className="card" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="card" style={{ width:420 }}>
        <h3>Initiate Trade</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <select defaultValue={targetOrg} className="input" onChange={e=> targetOrg = e.target.value}>
            <option value="Org1">Org1</option>
            <option value="Org2">Org2</option>
          </select>
          <input placeholder="Allowance ID" className="input" onChange={e=> allowanceId = e.target.value} />
          <input placeholder="Amount (kg)" type="number" className="input" onChange={e=> amountKg = e.target.value} />
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button className="btn" onClick={()=> onSubmit?.({ targetOrg, allowanceId, amountKg: Number(amountKg) })}>Confirm</button>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}


