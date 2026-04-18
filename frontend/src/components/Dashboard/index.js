import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { quotes as quotesApi } from "../../services/api";
import StatusBadge from "../StatusBadge";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    quotesApi.stats().then((r) => setStats(r.data));
    quotesApi.list({ limit: 5 }).then((r) => setRecent(r.data));
  }, []);

  if (!stats) return <p className="dashboard-loading">Loading...</p>;

  const cards = [
    { label: "Total Quotes", value: stats.total_quotes, mod: "total" },
    { label: "Draft",        value: stats.draft,         mod: "draft" },
    { label: "Sent",         value: stats.sent,          mod: "sent" },
    { label: "Accepted",     value: stats.accepted,      mod: "accepted" },
    { label: "Rejected",     value: stats.rejected,      mod: "rejected" },
    {
      label: "Total Value",
      value: `$${stats.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      mod: "value",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/quotes/new" className="dashboard-new-btn">+ New Quote</Link>
      </div>

      <div className="dashboard-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className={`dashboard-stat-card dashboard-stat-card--${c.mod}`}>
            <div className="dashboard-stat-label">{c.label}</div>
            <div className="dashboard-stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      <h2 className="dashboard-section-title">Recent Quotes</h2>
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr className="dashboard-table-head-row">
              {["#", "Title", "Client", "Status", "Total", ""].map((h) => (
                <th key={h} className="dashboard-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((q) => (
              <tr key={q.id} className="dashboard-tr">
                <td className="dashboard-td">{q.quote_number}</td>
                <td className="dashboard-td">{q.title}</td>
                <td className="dashboard-td">{q.client.name}</td>
                <td className="dashboard-td"><StatusBadge status={q.status} /></td>
                <td className="dashboard-td">${q.total.toFixed(2)}</td>
                <td className="dashboard-td">
                  <Link to={`/quotes/${q.id}`} className="dashboard-view-link">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
