import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("login"); // "login" | "register" | "dashboard" | "profile"

  if (!user) {
    if (currentPage === "login") {
      return (
        <Login
          onLogin={(u) => { setUser(u); setCurrentPage("dashboard"); }}
          onNavigateRegister={() => setCurrentPage("register")}
        />
      );
    } else if (currentPage === "register") {
      return (
        <Register
          onRegister={(u) => { setUser(u); setCurrentPage("dashboard"); }}
          onNavigateLogin={() => setCurrentPage("login")}
        />
      );
    }
  }

  // User is logged in
  if (currentPage === "dashboard") {
    return (
      <Dashboard
        user={user}
        onNavigateProfile={() => setCurrentPage("profile")}
        onLogout={() => { setUser(null); setCurrentPage("login"); }}
      />
    );
  }

  if (currentPage === "profile") {
    return (
      <Profile
        user={user}
        onBack={() => setCurrentPage("dashboard")}
        onLogout={() => { setUser(null); setCurrentPage("login"); }}
      />
    );
  }

  return null;
}
