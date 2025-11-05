import { useEffect, useState } from "react";
import { api, authHeaders } from "./api";

export default function Dashboard({ user }) {
  const [allowances, setAllowances] = useState([]);
  const [allowanceId, setAllowanceId] = useState("");
  const [allowanceView, setAllowanceView] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [consumeAmount, setConsumeAmount] = useState("");
  const [govCreate, setGovCreate] = useState({ id: "", owner: "Org1MSP", totalKg: "", note: "" });
  const [govRevokeId, setGovRevokeId] = useState("");
  const [govRevokeReason, setGovRevokeReason] = useState("");
  const [balanceKg, setBalanceKg] = useState(0);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState({ profile: true, balance: true });
  const [error, setError] = useState({ profile: null, balance: null });
  const [profile, setProfile] = useState({ userObject: { username: user.username, carbonCreditsBalance: 0 } });
  const orgKey = localStorage.getItem("orgKey");
  const ownerMsp = orgKey ? `${orgKey}MSP` : "Org1MSP";

  useEffect(() => {
    api.get("/myProfile", { headers: authHeaders() })
      .then(res => setProfile(res.data))
      .catch(() => setError(prev => ({ ...prev, profile: "Failed to load profile" })))
      .finally(() => setLoading(prev => ({ ...prev, profile: false })));

    api.get(`/allowances/owner/${ownerMsp}/balance`, { headers: authHeaders() })
      .then(res => setBalanceKg(Number(res.data.balanceKg || 0)))
      .catch(() => setError(prev => ({ ...prev, balance: "Failed to load balance" })))
      .finally(() => setLoading(prev => ({ ...prev, balance: false })));

    api.get("/health").then(res => setHealth(res.data)).catch(() => setHealth(null));

    // Also load allowances to compute balance sum reliably and keep UI in sync
    loadAllowances();

    // Periodically refresh current allowance
    const interval = setInterval(() => {
      loadAllowances();
    }, 15000);
    return () => clearInterval(interval);
  }, [ownerMsp]);

  const loadAllowances = async () => {
    try {
      const res = await api.get("/allowances", { headers: authHeaders() });
      const list = Array.isArray(res.data) ? res.data : [];
      setAllowances(list);
      // If API balance endpoint is inconsistent, compute from list for the current owner
      const sum = list
        .filter((a) => a?.owner === ownerMsp && typeof a?.remaining !== "undefined")
        .reduce((acc, a) => acc + Number(a.remaining || 0), 0);
      if (!Number.isNaN(sum) && sum >= 0) setBalanceKg(sum);
    } catch (e) {
      setAllowances([]);
    }
  };

  const readAllowance = async () => {
    if (!allowanceId) return;
    try {
      const res = await api.get(`/allowances/${allowanceId}`, { headers: authHeaders() });
      setAllowanceView(res.data);
    } catch (e) {
      setAllowanceView({ error: e.response?.data || "Failed" });
    }
  };

  const transferAllowance = async () => {
    if (!allowanceId || !newOwner) return;
    try {
      await api.post(`/allowances/${allowanceId}/transfer`, { newOwner }, { headers: authHeaders() });
      await readAllowance();
      // refresh balance after transfer
      const res = await api.get(`/allowances/owner/${ownerMsp}/balance`, { headers: authHeaders() });
      setBalanceKg(Number(res.data.balanceKg || 0));
    } catch (e) {
      alert("Transfer failed");
    }
  };

  const consumeAllowance = async () => {
    if (!allowanceId || !consumeAmount) return;
    try {
      await api.post(`/allowances/${allowanceId}/consume`, { amountKg: Number(consumeAmount) }, { headers: authHeaders() });
      await readAllowance();
      // refresh balance
      const res = await api.get(`/allowances/owner/${ownerMsp}/balance`, { headers: authHeaders() });
      setBalanceKg(Number(res.data.balanceKg || 0));
    } catch (e) {
      alert("Consume failed");
    }
  };

  const govCreateAllowance = async () => {
    if (!govCreate.id || !govCreate.owner || !govCreate.totalKg) return;
    try {
      await api.post(`/gov/allowances`, {
        id: govCreate.id,
        owner: govCreate.owner,
        totalKg: Number(govCreate.totalKg),
        note: govCreate.note || "",
      }, { headers: authHeaders() });
      alert("Created");
    } catch (e) {
      alert("Create failed");
    }
  };

  const govRevokeAllowance = async () => {
    if (!govRevokeId) return;
    try {
      await api.post(`/gov/allowances/${govRevokeId}/revoke`, { reason: govRevokeReason || "" }, { headers: authHeaders() });
      alert("Revoked");
    } catch (e) {
      alert("Revoke failed");
    }
  };

  const marketValueInr = balanceKg * 25; // 1 allowance = Rs 25

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>⚡ EnergyX Dashboard</h1>
        <div style={styles.userMenu}>
          {profile.userObject?.username} · Org: {orgKey}
          <span style={styles.caret}>▼</span>
          <div style={styles.dropdown}>
            <button style={styles.dropdownItem} onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("orgKey"); window.location.reload(); }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.balanceCard}>
          <h2 style={styles.cardTitle}>Current Allowance</h2>
          {loading.balance ? <p>Loading...</p> : (
            <>
              <p style={styles.balanceValue}>{balanceKg} kg</p>
              <p style={{ opacity: 0.8 }}>≈ ₹ {marketValueInr.toLocaleString()}</p>
            </>
          )}
          {error.balance && <p style={styles.error}>{error.balance}</p>}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Blockchain Status</h2>
          {health ? (
            <pre style={styles.pre}>{JSON.stringify(health, null, 2)}</pre>
          ) : (
            <p>Health unavailable</p>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Consume Allowance</h2>
          <div style={styles.formRow}>
            <input placeholder="Allowance ID" value={allowanceId} onChange={(e) => setAllowanceId(e.target.value)} />
            <input placeholder="Amount (kg)" type="number" value={consumeAmount} onChange={(e) => setConsumeAmount(e.target.value)} />
            <button style={styles.button} onClick={consumeAllowance}>Consume</button>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Transfer/Trade Allowance</h2>
          <div style={styles.formRow}>
            <input placeholder="Allowance ID" value={allowanceId} onChange={(e) => setAllowanceId(e.target.value)} />
            <input placeholder="New Owner MSP (e.g., Org2MSP)" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
            <button style={styles.button} onClick={transferAllowance}>Transfer</button>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Query Allowances</h2>
          <div style={styles.formRow}>
            <button style={styles.button} onClick={loadAllowances}>List All</button>
            <input placeholder="Allowance ID" value={allowanceId} onChange={(e) => setAllowanceId(e.target.value)} />
            <button style={styles.button} onClick={readAllowance}>Read</button>
          </div>
          {Array.isArray(allowances) && allowances.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Owner</th>
                  <th style={styles.th}>Issuer</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Remaining</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Note</th>
                  <th style={styles.th}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {allowances.map((a) => (
                  <tr key={a.id}>
                    <td style={styles.td}>{a.id}</td>
                    <td style={styles.td}>{a.owner}</td>
                    <td style={styles.td}>{a.issuer}</td>
                    <td style={styles.td}>{a.total}</td>
                    <td style={styles.td}>{a.remaining}</td>
                    <td style={styles.td}>{a.status}</td>
                    <td style={styles.td}>{a.note}</td>
                    <td style={styles.td}>{a.updatedAt ? new Date(a.updatedAt * 1000).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allowanceView && (
            <div style={styles.kvWrap}>
              <div><b>ID:</b> {allowanceView.id}</div>
              <div><b>Owner:</b> {allowanceView.owner}</div>
              <div><b>Issuer:</b> {allowanceView.issuer}</div>
              <div><b>Total:</b> {allowanceView.total}</div>
              <div><b>Remaining:</b> {allowanceView.remaining}</div>
              <div><b>Status:</b> {allowanceView.status}</div>
              <div><b>Note:</b> {allowanceView.note}</div>
              <div><b>Updated:</b> {allowanceView.updatedAt ? new Date(allowanceView.updatedAt * 1000).toLocaleString() : '-'}</div>
            </div>
          )}
        </div>

        {orgKey === "Gov" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Gov: Create / Revoke Allowance</h2>
            <div style={styles.formCol}>
              <h4>Create</h4>
              <input placeholder="ID" value={govCreate.id} onChange={(e) => setGovCreate({ ...govCreate, id: e.target.value })} />
              <input placeholder="Owner MSP (e.g., Org1MSP)" value={govCreate.owner} onChange={(e) => setGovCreate({ ...govCreate, owner: e.target.value })} />
              <input type="number" placeholder="Total Kg" value={govCreate.totalKg} onChange={(e) => setGovCreate({ ...govCreate, totalKg: e.target.value })} />
              <input placeholder="Note" value={govCreate.note} onChange={(e) => setGovCreate({ ...govCreate, note: e.target.value })} />
              <button style={styles.button} onClick={govCreateAllowance}>Create</button>
            </div>
            <div style={styles.formCol}>
              <h4>Revoke</h4>
              <input placeholder="ID" value={govRevokeId} onChange={(e) => setGovRevokeId(e.target.value)} />
              <input placeholder="Reason (optional)" value={govRevokeReason} onChange={(e) => setGovRevokeReason(e.target.value)} />
              <button style={styles.button} onClick={govRevokeAllowance}>Revoke</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#1e1e2f",
    minHeight: "100vh",
    padding: "20px",
    color: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    color: "#1e90ff",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  card: {
    background: "#2c2c3e",
    padding: "20px",
    borderRadius: "8px",
    flex: "1",
    minWidth: "250px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
    color: "#f5f5f5",
  },
  balanceCard: {
    background: "#2c2c3e",
    padding: "30px",
    borderRadius: "12px",
    flex: "1",
    minWidth: "250px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
    color: "#f5f5f5",
    textAlign: "center",
  },
  balanceValue: {
    fontSize: "36px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#fff",
  },
  cardTitle: {
    marginBottom: "10px",
    color: "#1e90ff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  kvWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "8px 16px",
    background: "#111",
    padding: "10px",
    borderRadius: "6px",
  },
  th: {
    borderBottom: "2px solid #444",
    padding: "8px",
    textAlign: "left",
    background: "#1e1e2f",
    color: "#1e90ff",
  },
  td: {
    borderBottom: "1px solid #444",
    padding: "8px",
  },
  button: {
    padding: "10px 16px",
    background: "#1e90ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  formRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  formCol: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
  },
  error: {
    color: "#ff4c4c",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    position: "relative",
  },
  userMenu: {
    position: "relative",
    cursor: "pointer",
    background: "#2c2c3e",
    padding: "8px 12px",
    borderRadius: "6px",
    userSelect: "none",
    color: "#f5f5f5",
  },
  caret: {
    marginLeft: "6px",
    fontSize: "12px",
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    background: "#2c2c3e",
    border: "1px solid #444",
    borderRadius: "6px",
    minWidth: "140px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
  },
  dropdownItem: {
    padding: "10px",
    background: "none",
    border: "none",
    color: "#f5f5f5",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  tradeForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    padding: "10px",
    background: "#1f1f35",
    borderRadius: "6px",
  },
};
