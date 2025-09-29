import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Quotation.css";

const fmt = (n) =>
  (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const rAF = () => new Promise(requestAnimationFrame);

// Simplified approach to replace form inputs with text
function replaceInputsWithText(element) {
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const span = document.createElement('span');
    span.style.cssText = `
      display: inline-block;
      width: 100%;
      padding: ${getComputedStyle(input).padding};
      font-size: ${getComputedStyle(input).fontSize};
      font-family: Arial, sans-serif;
      color: #000;
      text-align: ${getComputedStyle(input).textAlign || 'left'};
      line-height: 1.2;
      vertical-align: middle;
      min-height: 16px;
      box-sizing: border-box;
    `;
    
    let text = '';
    if (input.tagName === 'SELECT') {
      const selected = input.selectedOptions[0];
      text = selected ? selected.text : input.value;
    } else {
      text = input.value;
    }
    
    span.textContent = text || ' '; // Space for empty values
    input.parentNode.replaceChild(span, input);
  });
}

// Indian number to words
function numberToWords(num) {
  if (num === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  
  function convertHundreds(n) {
    let r = "";
    if (n >= 100) { r += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
    if (n >= 20) { r += tens[Math.floor(n / 10)] + " "; n %= 10; }
    if (n > 0) { r += ones[n] + " "; }
    return r;
  }
  
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000);    num %= 100000;
  const thousand = Math.floor(num / 1000);  num %= 1000;
  const hundred = num;
  
  let out = "";
  if (crore)   out += convertHundreds(crore) + "Crore ";
  if (lakh)    out += convertHundreds(lakh) + "Lakh ";
  if (thousand)out += convertHundreds(thousand) + "Thousand ";
  if (hundred) out += convertHundreds(hundred);
  
  return out.trim() + " Only";
}

export default function TaxQuotation() {
  const sheetRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  useEffect(() => {
    console.log('[Quotation] mounted');
  }, []);

  // Company
  const [company, setCompany] = useState({
    name: "VRM GROUPS",
    phone: "+91 9900315454",
    email: "info@vrmgroups.com",
    website: "www.vrmgroups.com",
    address1: "15th Cross, A Block No.27",
    address2: "Ground Floor, Bhuvaneshwari Nagar",
    address3: "Magadi Main Road, Bangalore - 560091",
    gstin: "29ATHPV3440K1Z5",
  });

  // Invoice
  const [invoice, setInvoice] = useState({
    number: "QTN-" + new Date().getTime().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
  });

  // Bill to
  const [billTo, setBillTo] = useState({
    name: "", address: "", contactNo: "", gstin: "", state: ""
  });

  // Site location
  const [siteLocation, setSiteLocation] = useState({
    name: "", address: "", contactNo: ""
  });

  // Materials
  const [materials, setMaterials] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("quotationItems");
      if (raw) {
        const arr = JSON.parse(raw);
        const rows = arr.map((it, i) => ({
          id: i + 1, 
          description: it.label || it.name || "",
          hsn: "", 
          qty: 1, 
          unit: "Nos", 
          pricePerUnit: 0, 
          discount: 0, 
          gst: 18
        }));
        setMaterials(rows.length ? rows : [{ id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
      } else {
        setMaterials([{ id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
      }
    } catch {
      setMaterials([{ id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
    }
  }, []);

  const taxRates = { sgst: 9, cgst: 9 };
  const [discountPercent, setDiscountPercent] = useState(0);

  const addMaterial = () =>
    setMaterials((m) => [...m, { id: Date.now(), description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);

  const removeMaterial = (id) =>
    setMaterials((m) => (m.length > 1 ? m.filter((x) => x.id !== id) : m));

  const updateMaterial = (id, field, value) =>
    setMaterials((m) =>
      m.map((row) =>
        row.id === id
          ? { ...row, [field]: ["description", "hsn", "unit"].includes(field) ? value : Number(value || 0) }
          : row
      )
    );

  const calculations = useMemo(() => {
    let subtotal = 0;
    materials.forEach((m) => {
      const amt = m.qty * m.pricePerUnit;
      subtotal += (amt - (amt * m.discount) / 100);
    });
    const overallDiscount = (subtotal * discountPercent) / 100;
    const finalSubtotal = subtotal - overallDiscount;
    const sgst = (finalSubtotal * taxRates.sgst) / 100;
    const cgst = (finalSubtotal * taxRates.cgst) / 100;
    const grandTotal = finalSubtotal + sgst + cgst;
    return { subtotal: finalSubtotal, discount: overallDiscount, sgst, cgst, grandTotal };
  }, [materials, discountPercent, taxRates.sgst, taxRates.cgst]);

  // Logo
  const LOGO_PRIMARY = (process.env.PUBLIC_URL || "") + "/assets/vrmlogo.png";
  const LOGO_FALLBACK = (process.env.PUBLIC_URL || "") + "/assests/vrmlogo.png";
  const [logoSrc, setLogoSrc] = useState(LOGO_PRIMARY);

  // Multi-page PDF generation
  const downloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const sourceElement = sheetRef.current;
      if (!sourceElement) {
        throw new Error("Source element not found");
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // Calculate items per page (approximate)
      const headerHeight = 100; // Estimated height for header + bill-to section in mm
      const footerHeight = 60;  // Estimated height for totals section in mm
      const rowHeight = 8;      // Estimated height per material row in mm
      const availableHeight = contentHeight - headerHeight - footerHeight;
      const maxItemsPerPage = Math.floor(availableHeight / rowHeight);

      // Split materials into chunks for each page
      const materialChunks = [];
      for (let i = 0; i < materials.length; i += maxItemsPerPage) {
        materialChunks.push(materials.slice(i, i + maxItemsPerPage));
      }

      // If no materials, create at least one chunk
      if (materialChunks.length === 0) {
        materialChunks.push([]);
      }

      // Generate each page
      for (let pageIndex = 0; pageIndex < materialChunks.length; pageIndex++) {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === materialChunks.length - 1;
        const currentChunk = materialChunks[pageIndex];

        // Create page content
        const pageElement = await createPageElement(
          sourceElement, 
          currentChunk, 
          pageIndex + 1, 
          materialChunks.length,
          isFirstPage, 
          isLastPage
        );

        // Create wrapper for the page
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
          position: absolute;
          top: -9999px;
          left: 0;
          width: 794px;
          background: white;
          font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(wrapper);
        wrapper.appendChild(pageElement);

        // Wait for fonts and layout
        await rAF();
        await rAF();

        // Replace inputs with text
        replaceInputsWithText(pageElement);

        // Wait for changes to take effect
        await rAF();
        await rAF();

        // Generate canvas for this page
        const canvas = await html2canvas(pageElement, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          foreignObjectRendering: false,
          allowTaint: false,
          imageTimeout: 0,
          removeContainer: true,
          width: pageElement.offsetWidth,
          height: pageElement.offsetHeight
        });

        // Clean up
        document.body.removeChild(wrapper);

        // Add page to PDF
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Calculate dimensions to fit A4
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(contentWidth / (imgWidth * 0.264583), contentHeight / (imgHeight * 0.264583));

        const finalWidth = (imgWidth * 0.264583) * ratio;
        const finalHeight = (imgHeight * 0.264583) * ratio;

        const x = margin + (contentWidth - finalWidth) / 2;
        const y = margin;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      }

      pdf.save(`${invoice.number}.pdf`);

    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to create page element
  const createPageElement = async (sourceElement, materialsForPage, pageNum, totalPages, isFirstPage, isLastPage) => {
    const clone = sourceElement.cloneNode(true);
    
    // Style the clone
    clone.style.cssText = `
      width: 794px;
      transform: none;
      font-family: Arial, sans-serif;
      background: white;
    `;

    // Remove elements that shouldn't appear in PDF
    const elementsToHide = clone.querySelectorAll('.col-action, .remove-btn, .add-material-section, .no-print');
    elementsToHide.forEach(el => el.style.display = 'none');

    // Update table headers to remove action column
    const tableHeaders = clone.querySelectorAll('.table-header');
    tableHeaders.forEach(header => {
      header.style.gridTemplateColumns = '35px 1fr 65px 50px 55px 85px 50px 50px 85px';
    });

    // Handle materials table
    const materialsTable = clone.querySelector('.materials-table');
    if (materialsTable) {
      // Remove existing rows except header
      const existingRows = materialsTable.querySelectorAll('.table-row, .table-total-row');
      existingRows.forEach(row => row.remove());

      // Add rows for this page
      materialsForPage.forEach((material, index) => {
        const globalIndex = materials.findIndex(m => m.id === material.id);
        const row = document.createElement('div');
        row.className = 'table-row';
        row.style.gridTemplateColumns = '35px 1fr 65px 50px 55px 85px 50px 50px 85px';
        
        row.innerHTML = `
          <div class="col-num">${globalIndex + 1}</div>
          <div class="col-desc"><span>${material.description}</span></div>
          <div class="col-hsn"><span>${material.hsn}</span></div>
          <div class="col-qty"><span>${material.qty}</span></div>
          <div class="col-unit"><span>${material.unit}</span></div>
          <div class="col-price"><span>${material.pricePerUnit}</span></div>
          <div class="col-disc"><span>${material.discount}%</span></div>
          <div class="col-gst"><span>${material.gst}%</span></div>
          <div class="col-amount">₹${fmt(material.qty * material.pricePerUnit * (1 - material.discount/100))}</div>
        `;
        
        materialsTable.appendChild(row);
      });

      // Add total row only on last page
      if (isLastPage) {
        const totalRow = document.createElement('div');
        totalRow.className = 'table-total-row';
        totalRow.style.gridTemplateColumns = '35px 1fr 65px 50px 55px 85px 50px 50px 85px';
        totalRow.innerHTML = `
          <div class="col-desc total-label">Total</div>
          <div class="col-amount">₹${fmt(calculations.subtotal + calculations.discount)}</div>
        `;
        materialsTable.appendChild(totalRow);
      }
    }

    // Hide bill-to section on non-first pages
    if (!isFirstPage) {
      const billSiteSection = clone.querySelector('.bill-site-section');
      if (billSiteSection) {
        billSiteSection.style.display = 'none';
      }
      
      const invoiceTitle = clone.querySelector('.invoice-title');
      if (invoiceTitle) {
        invoiceTitle.innerHTML = `Tax Quotation (Page ${pageNum} of ${totalPages})`;
      }
    }

    // Hide bottom section on non-last pages
    if (!isLastPage) {
      const bottomSection = clone.querySelector('.bottom-section');
      if (bottomSection) {
        bottomSection.style.display = 'none';
      }
    }

    return clone;
  };

  const printInvoice = async () => {
    const src = sheetRef.current;
    if (!src) return;
    src.classList.add("print-mode");
    await rAF();
    window.print();
    setTimeout(() => src.classList.remove("print-mode"), 300);
  };

  return (
    <div className="quotation-container">
      <div className="toolbar no-print">
        <button className="btn ghost" onClick={() => setPreview(!preview)}>
          {preview ? "Exit Preview" : "Preview"}
        </button>
        <div className="spacer" />
        <button 
          className="btn ghost" 
          onClick={downloadPDF} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>
        <button className="btn primary" onClick={printInvoice}>Print</button>
      </div>

      <div className={`invoice-sheet ${preview ? "preview" : ""}`} ref={sheetRef}>
        {/* ===== HEADER ===== */}
        <header className="modern-header header-grid-3">
          {/* Left: title + contact with icons */}
          <div className="header-left">
            <div className="construction-heading">
              <span>Construction</span><br/><strong>QUOTATION</strong>
            </div>

            <div className="contact-line">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2c1.2.5 2.5.8 3.9.8a1 1 0 011 1V21a1 1 0 01-1 1C11.4 22 2 12.6 2 1a1 1 0 011-1h3.8a1 1 0 011 1c0 1.4.3 2.7.8 3.9a1 1 0 01-.2 1.1L6.6 10.8z"/></svg>
              </span>
              <input value={company.phone} onChange={(e)=>setCompany({...company, phone:e.target.value})} readOnly={preview}/>
            </div>
            <div className="contact-line">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M2 6l10 7L22 6v12H2z"/><path d="M2 6l10 7L22 6V4H2z"/></svg>
              </span>
              <input value={company.email} onChange={(e)=>setCompany({...company, email:e.target.value})} readOnly={preview}/>
            </div>
            <div className="contact-line">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2c2.5 0 4.7 1 6.3 2.6A8 8 0 714.7 6.6 8 8 0 0112 4zm0 16a8 8 0 01-7.3-5h14.6A8 8 0 0112 20z"/></svg>
              </span>
              <input value={company.website} onChange={(e)=>setCompany({...company, website:e.target.value})} readOnly={preview}/>
            </div>
          </div>

          {/* Center: logo + brand (VRM yellow, GROUPS dark blue) */}
          <div className="header-center">
            <img
              src={logoSrc}
              alt="VRM Logo"
              className="logo-image"
              crossOrigin="anonymous"
              onError={() => { if (logoSrc !== LOGO_FALLBACK) setLogoSrc(LOGO_FALLBACK); }}
            />
            <div className="brand-badge">
              <span className="brand-vrm">VRM</span>
              <span className="brand-groups">GROUPS</span>
            </div>
          </div>

          {/* Right: address (icon on line-1) + GSTIN (with icon) */}
          <div className="header-right">
            <div className="addr-row">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
              </span>
              <input value={company.address1} onChange={(e)=>setCompany({...company, address1:e.target.value})} readOnly={preview}/>
            </div>
            <div className="addr-row no-icon">
              <span className="ic" aria-hidden="true"></span>
              <input value={company.address2} onChange={(e)=>setCompany({...company, address2:e.target.value})} readOnly={preview}/>
            </div>
            <div className="addr-row no-icon">
              <span className="ic" aria-hidden="true"></span>
              <input value={company.address3} onChange={(e)=>setCompany({...company, address3:e.target.value})} readOnly={preview}/>
            </div>
            <div className="addr-row gst-row">
              <span className="ic">
                <svg viewBox="0 0 24 24"><path d="M3 5h18v14H3z" fill="none"/><path d="M5 7h14v2H5zm0 4h8v2H5zm0 4h6v2H5z"/></svg>
              </span>
              <input value={`GSTIN: ${company.gstin}`} readOnly />
            </div>
          </div>
        </header>

        <div className="invoice-title">Tax Quotation</div>

        {/* Bill To & Site/Location */}
        <div className="bill-site-section">
          <div className="bill-to">
            <div className="section-title">Bill To:</div>
            <div className="field-group">
              <div className="field"><label>Name:</label><input value={billTo.name} onChange={(e)=>setBillTo({...billTo, name:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Address:</label><input value={billTo.address} onChange={(e)=>setBillTo({...billTo, address:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Contact No.:</label><input value={billTo.contactNo} onChange={(e)=>setBillTo({...billTo, contactNo:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>GSTIN No.:</label><input value={billTo.gstin} onChange={(e)=>setBillTo({...billTo, gstin:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>State:</label><input value={billTo.state} onChange={(e)=>setBillTo({...billTo, state:e.target.value})} readOnly={preview}/></div>
            </div>
          </div>

          <div className="site-location">
            <div className="section-title">Site /Location:</div>
            <div className="field-group">
              <div className="field"><label>Name:</label><input value={siteLocation.name} onChange={(e)=>setSiteLocation({...siteLocation, name:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Address:</label><input value={siteLocation.address} onChange={(e)=>setSiteLocation({...siteLocation, address:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Contact No.:</label><input value={siteLocation.contactNo} onChange={(e)=>setSiteLocation({...siteLocation, contactNo:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Invoice No.:</label><input value={invoice.number} onChange={(e)=>setInvoice({...invoice, number:e.target.value})} readOnly={preview}/></div>
              <div className="field"><label>Date:</label><input type="date" value={invoice.date} onChange={(e)=>setInvoice({...invoice, date:e.target.value})} readOnly={preview}/></div>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="materials-table">
          <div className="table-header">
            <div className="col-num">#</div>
            <div className="col-desc">Description</div>
            <div className="col-hsn">HSN</div>
            <div className="col-qty">QTY</div>
            <div className="col-unit">Unit</div>
            <div className="col-price">Price/Unit</div>
            <div className="col-disc">Disc</div>
            <div className="col-gst">GST</div>
            <div className="col-amount">Amount</div>
            {!preview && <div className="col-action">Action</div>}
          </div>

          {materials.map((row, i) => (
            <div key={row.id} className="table-row">
              <div className="col-num">{i + 1}</div>
              <div className="col-desc"><input value={row.description} onChange={(e)=>updateMaterial(row.id,"description",e.target.value)} placeholder="Enter description" readOnly={preview}/></div>
              <div className="col-hsn"><input value={row.hsn} onChange={(e)=>updateMaterial(row.id,"hsn",e.target.value)} placeholder="HSN" readOnly={preview}/></div>
              <div className="col-qty"><input type="number" value={row.qty} onChange={(e)=>updateMaterial(row.id,"qty",e.target.value)} min="0" readOnly={preview}/></div>
              <div className="col-unit">
                <select value={row.unit} onChange={(e)=>updateMaterial(row.id,"unit",e.target.value)} disabled={preview}>
                  <option>Nos</option><option>Kg</option><option>Ltr</option><option>Mtr</option><option>Sq.Ft</option><option>Box</option>
                </select>
              </div>
              <div className="col-price"><input type="number" value={row.pricePerUnit} onChange={(e)=>updateMaterial(row.id,"pricePerUnit",e.target.value)} min="0" step="0.01" readOnly={preview}/></div>
              <div className="col-disc"><input type="number" value={row.discount} onChange={(e)=>updateMaterial(row.id,"discount",e.target.value)} min="0" max="100" step="0.01" readOnly={preview}/>%</div>
              <div className="col-gst"><input type="number" value={row.gst} onChange={(e)=>updateMaterial(row.id,"gst",e.target.value)} min="0" step="0.01" readOnly={preview}/>%</div>
              <div className="col-amount">₹{fmt(row.qty * row.pricePerUnit * (1 - row.discount/100))}</div>
              {!preview && (
                <div className="col-action">
                  <button className="remove-btn" onClick={()=>removeMaterial(row.id)}>Remove</button>
                </div>
              )}
            </div>
          ))}

          {/* compact total row */}
          <div className="table-total-row">
            <div className="col-desc total-label">Total</div>
            <div className="col-amount">₹{fmt(calculations.subtotal + calculations.discount)}</div>
          </div>
        </div>

        {!preview && (
          <div className="add-material-section no-print">
            <button onClick={addMaterial} className="btn add-material">+ Add Material</button>
          </div>
        )}

        {/* Bottom */}
        <div className="bottom-section">
          <div className="amount-words">
            <div className="label">Amount in words:</div>
            <div className="words-value">{numberToWords(Math.floor(calculations.grandTotal))}</div>
            <div className="signature-area"><div className="signature-label">Company seal and Sign</div></div>
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span className="label">Sub Total:</span>
              <span className="value">₹{fmt(calculations.subtotal + calculations.discount)}</span>
            </div>
            <div className="total-row">
              <span className="label">
                Discount ({discountPercent}%):
                {!preview && (
                  <input className="discount-input" type="number" value={discountPercent}
                    onChange={(e)=>setDiscountPercent(Number(e.target.value || 0))}
                    min="0" max="100" step="0.1"/>
                )}
              </span>
              <span className="value">₹{fmt(calculations.discount)}</span>
            </div>
            <div className="total-row"><span className="label">SGST ({taxRates.sgst}%):</span><span className="value">₹{fmt(calculations.sgst)}</span></div>
            <div className="total-row"><span className="label">CGST ({taxRates.cgst}%):</span><span className="value">₹{fmt(calculations.cgst)}</span></div>
            <div className="total-row grand-total"><span className="label">Total:</span><span className="value">₹{fmt(calculations.grandTotal)}</span></div>
            <div className="total-row"><span className="label">Balance:</span><span className="value">₹{fmt(calculations.grandTotal)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}