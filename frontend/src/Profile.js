import { useEffect, useState } from "react";
import { api, authHeaders } from "./api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/myProfile", { headers: authHeaders() })
    .then((res) => setProfile(res.data.userObject))
    .catch((err) => setError("Failed to load profile"))
    .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p style={{ padding: "20px" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 My Profile</h1>
      <div style={styles.card}>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>User ID:</strong> {profile.id}</p>
        <p><strong>Carbon Credits:</strong> {profile.carbonCreditsBalance}</p>
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
  card: {
    background: "#2c2c3e",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    margin: "0 auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
    color: "#f5f5f5",
    lineHeight: "1.8",
  },
};
