import React, { useEffect, useState } from "react";
import { clients as clientsApi } from "../../services/api";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

const emptyForm = { name: "", email: "", phone: "", company: "" };

export default function ClientList() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => clientsApi.list().then((r) => setData(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setError(""); setShowForm(true); };
  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone || "", company: c.company || "" });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await clientsApi.update(editing, form);
      } else {
        await clientsApi.create(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Error saving client");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client and all their quotes?")) return;
    await clientsApi.delete(id);
    load();
  };

  return (
    <div className="clientlist-page">
      <div className="clientlist-header">
        <h1 className="clientlist-title">Clients</h1>
        <button onClick={openNew} className="clientlist-new-btn">+ New Client</button>
      </div>

      {showForm && (
        <div className="clientlist-form-section">
          <h3 className="clientlist-form-title">{editing ? "Edit Client" : "New Client"}</h3>
          {error && <div className="clientlist-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="clientlist-form-grid">
              {[["name", "Name *", true], ["email", "Email *", true], ["company", "Company", false], ["phone", "Phone", false]].map(([k, label, req]) => (
                <div key={k} className="clientlist-field">
                  <label className="clientlist-field-label">{label}</label>
                  <input
                    className="clientlist-field-input"
                    required={req}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div className="clientlist-form-actions">
              <button type="submit" className="clientlist-submit-btn">{editing ? "Save" : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="clientlist-cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="clientlist-table-wrap">
        {data.length === 0 ? (
          <p className="clientlist-empty">No clients yet.</p>
        ) : (
          <table className="clientlist-table">
            <thead>
              <tr className="clientlist-thead-row">
                {["Name", "Email", "Company", "Phone", "Actions"].map((h) => (
                  <th key={h} className="clientlist-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="clientlist-tr">
                  <td className="clientlist-td">{c.name}</td>
                  <td className="clientlist-td">{c.email}</td>
                  <td className="clientlist-td">{c.company || "—"}</td>
                  <td className="clientlist-td">{c.phone || "—"}</td>
                  <td className="clientlist-td clientlist-actions-cell">
                    <button onClick={() => openEdit(c)} className="clientlist-action-btn clientlist-action-btn--edit">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="clientlist-action-btn clientlist-action-btn--delete">Delete</button>
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
