import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { quotes as quotesApi } from "../../services/api";
import StatusBadge from "../StatusBadge";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

const STATUSES = ["draft", "sent", "accepted", "rejected", "expired"];

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    quotesApi.get(id).then((r) => setQuote(r.data));
  }, [id]);

  const handleStatusChange = async (e) => {
    setChangingStatus(true);
    const updated = await quotesApi.update(id, { status: e.target.value });
    setQuote(updated.data);
    setChangingStatus(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this quote?")) return;
    await quotesApi.delete(id);
    navigate("/quotes");
  };

  if (!quote) return <p className="quotedetail-loading">Loading...</p>;

  return (
    <div className="quotedetail-page">
      <div className="quotedetail-header">
        <div className="quotedetail-title-block">
          <div className="quotedetail-quote-num">{quote.quote_number}</div>
          <h1 className="quotedetail-title">{quote.title}</h1>
        </div>
        <div className="quotedetail-actions">
          <select className="quotedetail-status-select" value={quote.status} onChange={handleStatusChange} disabled={changingStatus}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <Link to={`/quotes/${id}/edit`} className="quotedetail-btn quotedetail-btn--edit">Edit</Link>
          <button onClick={handleDelete} className="quotedetail-btn quotedetail-btn--delete">Delete</button>
        </div>
      </div>

      <div className="quotedetail-cards-grid">
        <div className="quotedetail-card">
          <h3 className="quotedetail-card-title">Client</h3>
          <p className="quotedetail-info-row"><b>Name:</b> {quote.client.name}</p>
          <p className="quotedetail-info-row"><b>Email:</b> {quote.client.email}</p>
          {quote.client.company && <p className="quotedetail-info-row"><b>Company:</b> {quote.client.company}</p>}
          {quote.client.phone && <p className="quotedetail-info-row"><b>Phone:</b> {quote.client.phone}</p>}
        </div>

        <div className="quotedetail-card">
          <h3 className="quotedetail-card-title">Details</h3>
          <p className="quotedetail-info-row"><b>Status:</b> <StatusBadge status={quote.status} /></p>
          <p className="quotedetail-info-row"><b>Created:</b> {new Date(quote.created_at).toLocaleString()}</p>
          {quote.valid_until && <p className="quotedetail-info-row"><b>Valid until:</b> {new Date(quote.valid_until).toLocaleDateString()}</p>}
          {quote.notes && <p className="quotedetail-info-row"><b>Notes:</b> {quote.notes}</p>}
        </div>
      </div>

      <div className="quotedetail-card quotedetail-card--items">
        <h3 className="quotedetail-card-title">Line Items</h3>
        <table className="quotedetail-items-table">
          <thead>
            <tr className="quotedetail-thead-row">
              <th className="quotedetail-th">Description</th>
              <th className="quotedetail-th">Qty</th>
              <th className="quotedetail-th">Unit Price</th>
              <th className="quotedetail-th">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id} className="quotedetail-tr">
                <td className="quotedetail-td">{item.description}</td>
                <td className="quotedetail-td">{item.quantity}</td>
                <td className="quotedetail-td">${item.unit_price.toFixed(2)}</td>
                <td className="quotedetail-td">${(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="quotedetail-total-row">
              <td className="quotedetail-td" colSpan={3}>Total</td>
              <td className="quotedetail-td quotedetail-td--total">${quote.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
