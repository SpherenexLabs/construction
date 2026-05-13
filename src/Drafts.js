import React, { useState, useEffect } from 'react';
import { getAllDrafts, deleteDraftFromFirebase } from './firebase';
import './Drafts.css';

const Drafts = ({ onLoadDraft, onReuseDraft, onBack }) => {
  const [drafts, setDrafts] = useState([]);
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  useEffect(() => {
    filterAndSort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts, searchTerm, sortBy]);

  const loadDrafts = async () => {
    setIsLoading(true);
    try {
      let loaded = [];
      try {
        loaded = await getAllDrafts();
      } catch {
        // Firebase unavailable — fall through to localStorage
      }

      if (loaded.length === 0) {
        const raw = localStorage.getItem('quotationDrafts');
        loaded = raw ? JSON.parse(raw) : [];
      }

      setDrafts(loaded);
    } catch {
      setDrafts([]);
    }
    setIsLoading(false);
  };

  const filterAndSort = () => {
    let list = [...drafts];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(d =>
        (d.quotationNumber || '').toLowerCase().includes(lower) ||
        (d.customerName || '').toLowerCase().includes(lower) ||
        (d.siteLocationName || '').toLowerCase().includes(lower)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
        case 'customer':
          return (a.customerName || '').localeCompare(b.customerName || '');
        default:
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      }
    });
    setFilteredDrafts(list);
  };

  const handleDelete = async (draft) => {
    if (!window.confirm('Delete this draft permanently?')) return;
    try {
      // Try Firebase
      try {
        await deleteDraftFromFirebase(draft.id);
      } catch {
        // Fallback: remove from localStorage
        const raw = localStorage.getItem('quotationDrafts');
        if (raw) {
          const arr = JSON.parse(raw).filter(d => d.id !== draft.id);
          localStorage.setItem('quotationDrafts', JSON.stringify(arr));
        }
      }
      await loadDrafts();
    } catch (err) {
      alert('Error deleting draft: ' + err.message);
    }
  };

  const formatDate = (d) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Unknown date';
    }
  };

  const materialCount = (draft) =>
    (draft.items || []).filter(i => i.type === 'material' && i.category).length;

  return (
    <div className="drafts-container">
      <div className="drafts-header">
        <button className="drafts-back-btn" onClick={onBack}>← Back</button>
        <h2>Saved Drafts</h2>
        <button className="drafts-refresh-btn" onClick={loadDrafts}>🔄 Refresh</button>
      </div>

      <div className="drafts-controls">
        <input
          type="text"
          className="drafts-search"
          placeholder="Search by quote number, customer, or site..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="drafts-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="customer">Customer Name</option>
        </select>
      </div>

      <div className="drafts-stats">
        <div className="drafts-stat-card">
          <span className="drafts-stat-label">Total Drafts</span>
          <span className="drafts-stat-value">{filteredDrafts.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="drafts-loading">Loading drafts...</div>
      ) : filteredDrafts.length === 0 ? (
        <div className="drafts-empty">
          <div className="drafts-empty-icon">📋</div>
          <h3>No saved drafts</h3>
          <p>Click <strong>Save Draft</strong> while filling a quotation to save your work in progress here.</p>
        </div>
      ) : (
        <div className="drafts-list">
          {filteredDrafts.map(draft => (
            <div key={draft.id} className="draft-card">
              <div className="draft-card-header">
                <div className="draft-card-left">
                  <span className="draft-badge">Draft</span>
                  <h3 className="draft-number">{draft.quotationNumber || 'Untitled'}</h3>
                  <span className="draft-updated">Last saved: {formatDate(draft.updatedAt)}</span>
                </div>
                <div className="draft-amount">
                  ₹{(draft.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="draft-card-details">
                <div className="draft-detail-row">
                  <strong>Customer:</strong>
                  <span>{draft.customerName || 'Not specified'}</span>
                </div>
                {draft.siteLocationName && (
                  <div className="draft-detail-row">
                    <strong>Site:</strong>
                    <span>{draft.siteLocationName}</span>
                  </div>
                )}
                <div className="draft-detail-row">
                  <strong>Materials:</strong>
                  <span>{materialCount(draft)} item{materialCount(draft) !== 1 ? 's' : ''}</span>
                </div>
                {(draft.items || []).filter(i => i.type === 'material' && i.category).length > 0 && (
                  <div className="draft-materials-preview">
                    {(draft.items || [])
                      .filter(i => i.type === 'material' && i.category)
                      .slice(0, 4)
                      .map((item, idx) => (
                        <span key={idx} className="draft-material-tag">
                          {item.category}{item.subcategory ? ` › ${item.subcategory}` : ''}
                        </span>
                      ))}
                    {materialCount(draft) > 4 && (
                      <span className="draft-material-tag draft-material-more">
                        +{materialCount(draft) - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="draft-card-actions">
                <button
                  className="draft-btn draft-btn-primary"
                  onClick={() => onLoadDraft(draft)}
                  title="Continue editing this draft"
                >
                  ✏️ Continue Editing
                </button>
                <button
                  className="draft-btn draft-btn-secondary"
                  onClick={() => onReuseDraft(draft)}
                  title="Create a new quotation based on this draft"
                >
                  📋 Reuse as New Quotation
                </button>
                <button
                  className="draft-btn draft-btn-danger"
                  onClick={() => handleDelete(draft)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
