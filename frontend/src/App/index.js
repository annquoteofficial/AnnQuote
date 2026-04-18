import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import QuoteList from "../components/QuoteList";
import QuoteForm from "../components/QuoteForm";
import QuoteDetail from "../components/QuoteDetail";
import ClientList from "../components/ClientList";
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
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
