// Register.jsx
import { useState } from "react";
import { api } from "./api";

export default function Register({ onRegister, onNavigateLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgKey, setOrgKey] = useState("Org1");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/signup", {
        username,
        email,
        unhashedPassword: password,
        orgKey,
        });


      const { token } = res.data;
      localStorage.setItem("token", token);

      // call parent callback with basic info
      onRegister({ username, email, orgKey });
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Registration failed. Server error.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📝 Register</h1>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <select value={orgKey} onChange={(e) => setOrgKey(e.target.value)} style={styles.input}>
            <option value="Org1">Org1</option>
            <option value="Org2">Org2</option>
            <option value="Gov">Gov</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <button
            onClick={onNavigateLogin}
            style={{
              background: "none",
              border: "none",
              color: "#1e90ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#1e1e2f",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#2c2c3e",
    padding: "30px",
    borderRadius: "8px",
    width: "320px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
    textAlign: "center",
    color: "#f5f5f5",
  },
  title: {
    marginBottom: "20px",
    color: "#1e90ff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #444",
    borderRadius: "6px",
    fontSize: "14px",
    background: "#1e1e2f",
    color: "#f5f5f5",
  },
  button: {
    padding: "10px",
    background: "#1e90ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    marginTop: "10px",
    color: "#ff6b6b",
    fontSize: "14px",
  },
};
