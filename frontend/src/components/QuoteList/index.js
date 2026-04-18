import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { quotes as quotesApi } from "../../services/api";
import StatusBadge from "../StatusBadge";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

const STATUSES = ["", "draft", "sent", "accepted", "rejected", "expired"];

export default function QuoteList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = () => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    quotesApi.list(params).then((r) => setData(r.data));
  };

  useEffect(() => { load(); }, [search, status]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quote?")) return;
    await quotesApi.delete(id);
    load();
  };

  return (
    <div className="quotelist-page">
      <div className="quotelist-header">
        <h1 className="quotelist-title">Quotes</h1>
        <Link to="/quotes/new" className="quotelist-new-btn">+ New Quote</Link>
      </div>

      <div className="quotelist-filters">
        <input
          className="quotelist-search"
          placeholder="Search by title or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="quotelist-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "All statuses"}</option>
          ))}
        </select>
      </div>

      <div className="quotelist-table-wrap">
        {data.length === 0 ? (
          <p className="quotelist-empty">No quotes found.</p>
        ) : (
          <table className="quotelist-table">
            <thead>
              <tr className="quotelist-thead-row">
                {["Quote #", "Title", "Client", "Status", "Total", "Date", "Actions"].map((h) => (
                  <th key={h} className="quotelist-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((q) => (
                <tr key={q.id} className="quotelist-tr">
                  <td className="quotelist-td">{q.quote_number}</td>
                  <td className="quotelist-td">{q.title}</td>
                  <td className="quotelist-td">{q.client.name}</td>
                  <td className="quotelist-td"><StatusBadge status={q.status} /></td>
                  <td className="quotelist-td">${q.total.toFixed(2)}</td>
                  <td className="quotelist-td">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="quotelist-td quotelist-actions-cell">
                    <Link to={`/quotes/${q.id}`} className="quotelist-action-btn quotelist-action-btn--view">View</Link>
                    <Link to={`/quotes/${q.id}/edit`} className="quotelist-action-btn quotelist-action-btn--edit">Edit</Link>
                    <button onClick={() => handleDelete(q.id)} className="quotelist-action-btn quotelist-action-btn--delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
