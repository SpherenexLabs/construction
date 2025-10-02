import React, { useState, useEffect } from 'react';
import { getAllPDFs, deletePDF, updatePDFMetadata } from './firebase';
import './History.css';

const History = ({ onLoadQuotation, onBack }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterType, setFilterType] = useState('all'); // all, quotation, invoice

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, sortBy, filterType]);

  const loadHistory = async () => {
    try {
      console.log('Loading history from Firebase...');
      
      // Try to load from Firebase first
      try {
        const firebaseHistory = await getAllPDFs();
        console.log('Loaded from Firebase:', firebaseHistory.length, 'items');
        console.log('Firebase data:', firebaseHistory);
        if (firebaseHistory.length > 0) {
          setHistory(firebaseHistory);
          return;
        }
      } catch (firebaseError) {
        console.warn('Firebase load failed, falling back to localStorage:', firebaseError);
      }

      // Fallback to localStorage
      const savedHistory = localStorage.getItem('quotationHistory');
      console.log('Loading history from localStorage:', savedHistory ? 'Found data' : 'No data');
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        console.log('Parsed localStorage history items:', parsedHistory.length);
        console.log('LocalStorage data:', parsedHistory);
        setHistory(parsedHistory);
      } else {
        console.log('No history found in localStorage');
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.quotationNumber || '').toLowerCase().includes(searchLower) ||
        (item.customerName || '').toLowerCase().includes(searchLower) ||
        (item.materials || []).some(material => 
          (material.category || '').toLowerCase().includes(searchLower) ||
          (material.subcategory || '').toLowerCase().includes(searchLower)
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        case 'date-asc':
          return new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0);
        case 'amount-desc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'amount-asc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        case 'customer':
          return (a.customerName || '').localeCompare(b.customerName || '');
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const addTestData = async () => {
    try {
      console.log('Adding test data to Firebase...');
      
      // Create a simple test PDF blob
      const testPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF';
      const testBlob = new Blob([testPdfContent], { type: 'application/pdf' });
      
      const testMetadata = {
        type: 'quotation',
        quotationNumber: 'TEST-' + Date.now(),
        customerName: 'Test Customer',
        siteLocationName: 'Test Site',
        totalAmount: 10000,
        materials: [
          { description: 'Test Material 1', quantity: 10, rate: 500 },
          { description: 'Test Material 2', quantity: 5, rate: 800 }
        ],
        billTo: { name: 'Test Customer', address: 'Test Address' },
        siteLocation: { name: 'Test Site', address: 'Test Site Address' },
        company: { name: 'Test Company' },
        invoice: { number: 'TEST-' + Date.now(), date: new Date().toISOString().slice(0, 10) },
        taxRates: { sgst: 9, cgst: 9 },
        discountPercent: 0,
        status: 'active'
      };
      
      const { uploadPDFToStorage } = await import('./firebase');
      const result = await uploadPDFToStorage(testBlob, `test_${Date.now()}.pdf`, testMetadata);
      console.log('Test data added successfully:', result);
      
      // Reload history
      await loadHistory();
      alert('Test data added successfully!');
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('Error adding test data: ' + error.message);
    }
  };

  const deleteHistoryItem = async (item) => {
    try {
      if (window.confirm(`Are you sure you want to delete this ${item.type}?`)) {
        console.log('Deleting item:', item.id);
        
        if (item.id && item.storageRef) {
          // Delete from Firebase
          await deletePDF(item.id, item.storageRef);
          console.log('Deleted from Firebase');
        } else {
          // Delete from localStorage
          const savedHistory = localStorage.getItem('quotationHistory');
          if (savedHistory) {
            const history = JSON.parse(savedHistory);
            const updatedHistory = history.filter(h => h.id !== item.id);
            localStorage.setItem('quotationHistory', JSON.stringify(updatedHistory));
            console.log('Deleted from localStorage');
          }
        }
        
        // Reload history
        await loadHistory();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item.');
    }
  };

  const downloadPDFFile = async (item) => {
    try {
      if (item.downloadURL) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = item.downloadURL;
        link.download = item.filename || `${item.type}_${item.quotationNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('PDF file not available for download.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF file.');
    }
  };

  const loadQuotationData = (item) => {
    console.log('Loading quotation data:', item);
    if (onLoadQuotation) {
      onLoadQuotation(item);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return (isNaN(amount) ? 0 : Number(amount)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (type) => {
    return (
      <span className={`status-badge ${type}`}>
        {type === 'quotation' ? 'Quote' : 'Invoice'}
      </span>
    );
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <button className="btn back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Quotation & Invoice History</h2>
        <button className="btn btn-secondary" onClick={loadHistory}>
          🔄 Refresh
        </button>
        <button className="btn btn-warning" onClick={addTestData}>
          🧪 Add Test Data
        </button>
      </div>

      <div className="history-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by quote number, customer name, or materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="quotation">Quotations</option>
            <option value="invoice">Invoices</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="customer">Customer Name</option>
          </select>
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <span className="stat-label">Total Items</span>
          <span className="stat-value">{filteredHistory.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Value</span>
          <span className="stat-value">
            {formatCurrency(filteredHistory.reduce((sum, item) => sum + item.totalAmount, 0))}
          </span>
        </div>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <h3>No history found</h3>
            <p>Generated quotations and invoices will appear here.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="item-header">
                <div className="item-info">
                  {getStatusBadge(item.type)}
                  <h3>{item.quotationNumber}</h3>
                  <span className="item-date">{formatDate(item.createdAt)}</span>
                </div>
                <div className="item-amount">{formatCurrency(item.totalAmount)}</div>
              </div>

              <div className="item-details">
                <div className="customer-info">
                  <strong>Customer:</strong> {item.customerName || 'Not specified'}
                </div>
                <div className="materials-summary">
                  <strong>Items:</strong> {(item.materials || []).length} materials
                  {(item.materials || []).length > 0 && (
                    <div className="materials-preview">
                      {(item.materials || []).slice(0, 3).map((material, idx) => (
                        <span key={idx} className="material-tag">
                          {material.category && material.subcategory 
                            ? `${material.category} > ${material.subcategory}`
                            : material.category || material.subcategory || 'Unnamed'
                          }
                        </span>
                      ))}
                      {(item.materials || []).length > 3 && (
                        <span className="material-tag more">+{(item.materials || []).length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                {item.siteLocationName && (
                  <div className="site-info">
                    <strong>Site:</strong> {item.siteLocationName}
                  </div>
                )}
              </div>

              <div className="item-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => loadQuotationData(item)}
                >
                  📝 Edit & Use
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    // Since we're not storing PDF data anymore, show a message
                    alert('PDF data is not stored to save space. Please regenerate the PDF by clicking "Edit & Use" and then "Download PDFs".');
                  }}
                  title="PDF data not stored to save space"
                >
                  � Regenerate PDF
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteHistoryItem(item.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;