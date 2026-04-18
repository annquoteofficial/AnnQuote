import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { quotes as quotesApi, clients as clientsApi } from "../../services/api";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

const emptyItem = { description: "", quantity: 1, unit_price: "" };

export default function QuoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ title: "", client_id: "", notes: "", valid_until: "" });
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    clientsApi.list().then((r) => setClients(r.data));
    if (isEdit) {
      quotesApi.get(id).then((r) => {
        const q = r.data;
        setForm({
          title: q.title,
          client_id: q.client_id,
          notes: q.notes || "",
          valid_until: q.valid_until ? q.valid_until.slice(0, 10) : "",
        });
        setItems(q.items.map((i) => ({ description: i.description, quantity: i.quantity, unit_price: i.unit_price })));
      });
    }
  }, [id, isEdit]);

  const setItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const total = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        client_id: Number(form.client_id),
        valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
        items: items.map((i) => ({ ...i, quantity: Number(i.quantity), unit_price: Number(i.unit_price) })),
      };
      if (isEdit) {
        await quotesApi.update(id, payload);
        navigate(`/quotes/${id}`);
      } else {
        const res = await quotesApi.create(payload);
        navigate(`/quotes/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="quoteform-page">
      <h1 className="quoteform-heading">{isEdit ? "Edit Quote" : "New Quote"}</h1>
      {error && <div className="quoteform-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="quoteform-section">
          <h3 className="quoteform-section-title">Quote Details</h3>

          <div className="quoteform-field">
            <label className="quoteform-label">Title *</label>
            <input className="quoteform-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="quoteform-field">
            <label className="quoteform-label">Client *</label>
            <select className="quoteform-select" required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
              <option value="">Select client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.company || c.email})</option>
              ))}
            </select>
          </div>

          <div className="quoteform-field">
            <label className="quoteform-label">Valid Until</label>
            <input type="date" className="quoteform-input" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
          </div>

          <div className="quoteform-field">
            <label className="quoteform-label">Notes</label>
            <textarea className="quoteform-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        <div className="quoteform-section">
          <h3 className="quoteform-section-title">Line Items</h3>

          {items.map((item, i) => (
            <div key={i} className="quoteform-item-row">
              <input className="quoteform-input" placeholder="Description" required value={item.description} onChange={(e) => setItem(i, "description", e.target.value)} />
              <input className="quoteform-input quoteform-input--qty" type="number" placeholder="Qty" min="0.01" step="0.01" required value={item.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} />
              <input className="quoteform-input quoteform-input--price" type="number" placeholder="Unit Price" min="0" step="0.01" required value={item.unit_price} onChange={(e) => setItem(i, "unit_price", e.target.value)} />
              <button type="button" className="quoteform-remove-btn" onClick={() => setItems(items.filter((_, idx) => idx !== i))} disabled={items.length === 1}>✕</button>
            </div>
          ))}

          <button type="button" className="quoteform-add-item-btn" onClick={() => setItems([...items, { ...emptyItem }])}>+ Add Item</button>
          <div className="quoteform-total">
            Total: <span className="quoteform-total-value">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="quoteform-actions">
          <button type="submit" className="quoteform-submit-btn" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Quote"}
          </button>
          <button type="button" className="quoteform-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
