import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Dashboard from "../components/Dashboard";
import QuoteList from "../components/QuoteList";
import QuoteForm from "../components/QuoteForm";
import QuoteDetail from "../components/QuoteDetail";
import ClientList from "../components/ClientList";
import Login from "../components/Login";
import AuthCallback from "../components/AuthCallback";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/quotes", label: "Quotes" },
  { to: "/clients", label: "Clients" },
];

export default function App() {
  const { user, token, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/*" element={
          token ? <AppShell user={user} logout={logout} /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function AppShell({ user, logout }) {
  return (
    <div className="app-layout">
      <nav className="app-nav">
        <div className="app-logo">AnnQuote</div>

        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) =>
              "app-nav-link" + (isActive ? " app-nav-link--active" : "")
            }
          >
            {n.label}
          </NavLink>
        ))}

        <div className="app-nav-spacer" />

        <div className="app-user">
          {user?.picture && (
            <img className="app-user-avatar" src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
          )}
          <span className="app-user-name">{user?.name || user?.email}</span>
        </div>

        <button className="app-logout-btn" onClick={logout}>Sign out</button>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quotes" element={<QuoteList />} />
          <Route path="/quotes/new" element={<QuoteForm />} />
          <Route path="/quotes/:id" element={<QuoteDetail />} />
          <Route path="/quotes/:id/edit" element={<QuoteForm />} />
          <Route path="/clients" element={<ClientList />} />
        </Routes>
      </main>
    </div>
  );
}
