


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "./Quotation.css";

// const fmt = (n) =>
//   (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const rAF = () => new Promise(requestAnimationFrame);

// async function ensureImagesLoaded(rootEl) {
//   const imgs = Array.from(rootEl.querySelectorAll("img"));
//   if (!imgs.length) return;
//   await Promise.all(
//     imgs.map(
//       (img) =>
//         new Promise((resolve) => {
//           if (img.complete) return resolve();
//           try { img.crossOrigin = "anonymous"; } catch { }
//           img.onload = img.onerror = () => resolve();
//         })
//     )
//   );
// }

// /** Keep clone inside viewport but invisible: avoids blank renders */
// function makeOffscreenClone(sourceEl) {
//   const rect = sourceEl.getBoundingClientRect();
//   const wrapper = document.createElement("div");
//   Object.assign(wrapper.style, {
//     position: "fixed",
//     left: "0",
//     top: "0",
//     width: Math.ceil(rect.width) + "px",
//     visibility: "hidden",
//     pointerEvents: "none",
//     background: "#fff",
//     zIndex: "-1",
//   });

//   const clone = sourceEl.cloneNode(true);
//   clone.classList.add("print-mode"); // hide buttons only; layout stays the same
//   clone.style.maxWidth = "none";
//   clone.style.width = "100%";

//   document.body.appendChild(wrapper);
//   wrapper.appendChild(clone);
//   return { wrapper, clone };
// }

// /** Light check to see if a canvas is basically blank (white/transparent) */
// function isCanvasBlank(canvas, threshold = 250) {
//   if (!canvas || !canvas.width || !canvas.height) return true;
//   const ctx = canvas.getContext("2d");
//   const { width, height } = canvas;
//   const sx = 10, sy = 10;
//   for (let y = 0; y < sy; y++) {
//     const row = Math.floor((y / (sy - 1 || 1)) * (height - 1));
//     for (let x = 0; x < sx; x++) {
//       const col = Math.floor((x / (sx - 1 || 1)) * (width - 1));
//       const [r, g, b, a] = ctx.getImageData(col, row, 1, 1).data;
//       if (a !== 0 && (r < threshold || g < threshold || b < threshold)) return false;
//     }
//   }
//   return true;
// }

// // Convert number to words (Indian format)
// function numberToWords(num) {
//   if (num === 0) return "Zero";
//   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
//   function convertHundreds(n) {
//     let result = "";
//     if (n >= 100) { result += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
//     if (n >= 20) { result += tens[Math.floor(n / 10)] + " "; n %= 10; }
//     if (n > 0) { result += ones[n] + " "; }
//     return result;
//   }
//   const crore = Math.floor(num / 10000000); num %= 10000000;
//   const lakh = Math.floor(num / 100000); num %= 100000;
//   const thousand = Math.floor(num / 1000); num %= 1000;
//   const hundred = num;
//   let result = "";
//   if (crore) result += convertHundreds(crore) + "Crore ";
//   if (lakh) result += convertHundreds(lakh) + "Lakh ";
//   if (thousand) result += convertHundreds(thousand) + "Thousand ";
//   if (hundred) result += convertHundreds(hundred);
//   return result.trim() + " Only";
// }

// export default function TaxQuotation() {
//   const sheetRef = useRef(null);
//   const [preview, setPreview] = useState(false);
//   const makingRef = useRef(false);

//   // Company details
//   const [company, setCompany] = useState({
//     name: "VRM GROUPS",
//     address: "15th Cross, A Block No.27 . Ground Floor, Bhuvaneshwari Nagar, Magadi Main Road, Banagalore - 560091",
//     phone: "+91 9900315454",
//     email: "info@vrmgroups.com",
//     gstin: "29ATHPV3440K1Z5",
//     state: "Karnataka"
//   });

//   // Invoice details
//   const [invoice, setInvoice] = useState({
//     number: "QTN-" + new Date().getTime().toString().slice(-6),
//     date: new Date().toISOString().slice(0, 10),
//   });

//   // Bill to details
//   const [billTo, setBillTo] = useState({
//     name: "",
//     address: "",
//     contactNo: "",
//     gstin: "",
//     state: ""
//   });

//   // Site/Location details
//   const [siteLocation, setSiteLocation] = useState({
//     name: "",
//     address: "",
//     contactNo: ""
//   });

//   // Materials
//   const [materials, setMaterials] = useState([]);
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       if (raw) {
//         const quotationItems = JSON.parse(raw);
//         const loaded = quotationItems.map((item, idx) => ({
//           id: idx + 1,
//           description: item.label || item.name || "",
//           hsn: "",
//           qty: 1,
//           unit: "Nos",
//           pricePerUnit: 0,
//           discount: 0,
//           gst: 18
//         }));
//         setMaterials(loaded.length ? loaded : [{
//           id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
//         }]);
//       } else {
//         setMaterials([{
//           id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
//         }]);
//       }
//     } catch {
//       setMaterials([{
//         id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
//       }]);
//     }
//   }, []);

//   // Tax rates
//   const taxRates = { sgst: 9, cgst: 9 };
//   const [discountPercent, setDiscountPercent] = useState(0);

//   const addMaterial = () => {
//     setMaterials((m) => [...m, {
//       id: Date.now(), description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
//     }]);
//   };
//   const removeMaterial = (id) => {
//     setMaterials((m) => (m.length > 1 ? m.filter((x) => x.id !== id) : m));
//   };
//   const updateMaterial = (id, field, value) => {
//     setMaterials((m) =>
//       m.map((row) =>
//         row.id === id
//           ? { ...row, [field]: ["description", "hsn", "unit"].includes(field) ? value : Number(value || 0) }
//           : row
//       )
//     );
//   };

//   const calculations = useMemo(() => {
//     let subtotal = 0;
//     materials.forEach((material) => {
//       const amount = material.qty * material.pricePerUnit;
//       const discountAmount = (amount * material.discount) / 100;
//       const taxableAmount = amount - discountAmount;
//       subtotal += taxableAmount;
//     });
//     const overallDiscount = (subtotal * discountPercent) / 100;
//     const finalSubtotal = subtotal - overallDiscount;
//     const sgst = (finalSubtotal * taxRates.sgst) / 100;
//     const cgst = (finalSubtotal * taxRates.cgst) / 100;
//     const grandTotal = finalSubtotal + sgst + cgst;
//     return { subtotal: finalSubtotal, discount: overallDiscount, sgst, cgst, grandTotal };
//   }, [materials, discountPercent, taxRates.sgst, taxRates.cgst]);

//   // Logo (assets/vrmlogo.png with fallback to assests/vrmlogo.png)
//   const LOGO_PRIMARY = (process.env.PUBLIC_URL || "") + "/assets/vrmlogo.png";
//   const LOGO_FALLBACK = (process.env.PUBLIC_URL || "") + "/assests/vrmlogo.png";
//   const [logoSrc, setLogoSrc] = useState(LOGO_PRIMARY);

//   // -------- PDF Export (blank-page-proof) --------
//   const downloadPDF = async () => {
//     if (makingRef.current) return;
//     makingRef.current = true;

//     try {
//       const src = sheetRef.current;
//       if (!src) return;

//       // Temporary style to normalize input look in PDF
//       const tempStyle = document.createElement("style");
//       tempStyle.textContent = `
//         .pdf-mode * {
//           font-family: Arial, Helvetica, sans-serif !important;
//           -webkit-font-smoothing: antialiased !important;
//           -moz-osx-font-smoothing: grayscale !important;
//           text-rendering: optimizeLegibility !important;
//         }
//         .pdf-mode input, .pdf-mode select {
//           color: #000 !important;
//           background: transparent !important;
//           border: none !important;
//           outline: none !important;
//           font-weight: normal !important;
//         }
//       `;
//       document.head.appendChild(tempStyle);

//       const { wrapper, clone } = makeOffscreenClone(src);
//       clone.classList.add("pdf-mode");
//       try { await document.fonts?.ready; } catch { }
//       await ensureImagesLoaded(clone);
//       await rAF(); await rAF();

//       // Primary capture from clone (reliable settings)
//       let canvas = await html2canvas(clone, {
//         scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         foreignObjectRendering: false,   // important!
//         allowTaint: true,
//         imageTimeout: 0,
//         logging: false,
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scrollX: 0,
//         scrollY: 0,
//       });

//       // Fallback: capture live node if the first canvas is blank
//       if (isCanvasBlank(canvas)) {
//         canvas = await html2canvas(src, {
//           scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           foreignObjectRendering: false,
//           allowTaint: true,
//           imageTimeout: 0,
//           logging: false,
//           width: src.scrollWidth || src.offsetWidth,
//           height: src.scrollHeight || src.offsetHeight,
//           scrollX: 0,
//           scrollY: 0,
//         });
//       }

//       // Cleanup clone & style
//       document.body.removeChild(wrapper);
//       document.head.removeChild(tempStyle);

//       // Build PDF (single page fit; same structure as screen)
//       const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
//       const pageW = pdf.internal.pageSize.getWidth();
//       const pageH = pdf.internal.pageSize.getHeight();

//       const margin = 8;
//       const availableW = pageW - 2 * margin;
//       const availableH = pageH - 2 * margin;

//       const imgWpx = canvas.width;
//       const imgHpx = canvas.height;

//       // px -> mm (96 CSS px per inch, 25.4 mm per inch)
//       const pxToMm = 25.4 / 96;
//       const imgWmm = imgWpx * pxToMm;
//       const imgHmm = imgHpx * pxToMm;

//       const scale = Math.min(availableW / imgWmm, availableH / imgHmm, 1);
//       const finalW = imgWmm * scale;
//       const finalH = imgHmm * scale;

//       const x = margin + (availableW - finalW) / 2;
//       const y = margin;

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       pdf.addImage(imgData, "PNG", x, y, finalW, finalH, undefined, "FAST");
//       pdf.save(`${invoice.number}.pdf`);
//     } catch (e) {
//       console.error("PDF generation error:", e);
//       alert("Error generating PDF. Please try again.");
//     } finally {
//       makingRef.current = false;
//     }
//   };

//   // Print
//   const printInvoice = async () => {
//     const src = sheetRef.current;
//     if (!src) return;
//     src.classList.add("print-mode");
//     await rAF();
//     window.print();
//     setTimeout(() => src.classList.remove("print-mode"), 300);
//   };

//   return (
//     <div className="quotation-container">
//       <div className="toolbar no-print">
//         <button className="btn ghost" onClick={() => setPreview(!preview)}>
//           {preview ? "Exit Preview" : "Preview"}
//         </button>
//         <div className="spacer" />
//         <button className="btn ghost" onClick={downloadPDF}>Download PDF</button>
//         <button className="btn primary" onClick={printInvoice}>Print</button>
//       </div>

//       <div className={`invoice-sheet ${preview ? "preview" : ""}`} ref={sheetRef}>
//         {/* Modern Header with Logo */}
//         <div className="modern-header">
//           <div className="header-left-info">
//             <div className="construction-title">Construction</div>
//             <div className="invoice-title-text">INVOICE</div>
//             <div className="company-name-text">
//               <input
//                 type="text"
//                 value={company.name}
//                 onChange={(e) => setCompany({ ...company, name: e.target.value })}
//                 readOnly={preview}
//                 placeholder="Company Name"
//               />
//             </div>
//           </div>

//           <div className="header-center-logo">
//             <div className="logo-container">
//               <img
//                 src={logoSrc}
//                 alt="VRM Logo"
//                 className="logo-image"
//                 crossOrigin="anonymous"
//                 onError={() => { if (logoSrc !== LOGO_FALLBACK) setLogoSrc(LOGO_FALLBACK); }}
//                 style={{ maxWidth: 128, maxHeight: 121, objectFit: "contain" }}
//               />
//             </div>
//           </div>

//           <div className="header-right-info">
//             <div className="contact-info">
//               <input
//                 type="text"
//                 value={company.phone}
//                 onChange={(e) => setCompany({ ...company, phone: e.target.value })}
//                 readOnly={preview}
//                 placeholder="+1(321)456-7890"
//               />
//             </div>
//             <div className="contact-info">
//               <input
//                 type="text"
//                 value={company.email}
//                 onChange={(e) => setCompany({ ...company, email: e.target.value })}
//                 readOnly={preview}
//                 placeholder="your@email.com"
//               />
//             </div>
//             <div className="contact-info">
//               <input type="text" value="www.vrmgroups.com" onChange={() => { }} readOnly={preview} />
//             </div>
//             <div className="address-info-right">
//               <div className="street-address">
//                 <input type="text" value="15th Cross, A Block No.27" readOnly={preview} onChange={() => { }} />
//               </div>
//               <div className="city-state">
//                 <input type="text" value="Ground Floor, Bhuvaneshwari Nagar" readOnly={preview} onChange={() => { }} />
//               </div>
//               <div className="zip-code">
//                 <input type="text" value="Magadi Main Road, Banagalore - 560091" readOnly={preview} onChange={() => { }} />
//               </div>
//               <div className="zip-code">
//                 <input type="text" value="GSTIN: 29ATHPV3440K1Z5" readOnly={preview} onChange={() => { }} />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* Tax Invoice Title */}
//         <div className="invoice-title">Tax Invoice</div>

//         {/* Bill To and Site Location */}
//         <div className="bill-site-section">
//           <div className="bill-to">
//             <div className="section-title">Bill To:</div>
//             <div className="field-group">
//               <div className="field">
//                 <label>Name:</label>
//                 <input
//                   type="text"
//                   value={billTo.name}
//                   onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Address:</label>
//                 <input
//                   type="text"
//                   value={billTo.address}
//                   onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Contact No.:</label>
//                 <input
//                   type="text"
//                   value={billTo.contactNo}
//                   onChange={(e) => setBillTo({ ...billTo, contactNo: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>GSTIN No.:</label>
//                 <input
//                   type="text"
//                   value={billTo.gstin}
//                   onChange={(e) => setBillTo({ ...billTo, gstin: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>State:</label>
//                 <input
//                   type="text"
//                   value={billTo.state}
//                   onChange={(e) => setBillTo({ ...billTo, state: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="site-location">
//             <div className="section-title">Site /Location:</div>
//             <div className="field-group">
//               <div className="field">
//                 <label>Name:</label>
//                 <input
//                   type="text"
//                   value={siteLocation.name}
//                   onChange={(e) => setSiteLocation({ ...siteLocation, name: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Address:</label>
//                 <input
//                   type="text"
//                   value={siteLocation.address}
//                   onChange={(e) => setSiteLocation({ ...siteLocation, address: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Contact No.:</label>
//                 <input
//                   type="text"
//                   value={siteLocation.contactNo}
//                   onChange={(e) => setSiteLocation({ ...siteLocation, contactNo: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Invoice No.:</label>
//                 <input
//                   type="text"
//                   value={invoice.number}
//                   onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Date:</label>
//                 <input
//                   type="date"
//                   value={invoice.date}
//                   onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
//                   readOnly={preview}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Materials Table */}
//         <div className="materials-table">
//           <div className="table-header">
//             <div className="col-num">#</div>
//             <div className="col-desc">Description</div>
//             <div className="col-hsn">HSN</div>
//             <div className="col-qty">QTY</div>
//             <div className="col-unit">Unit</div>
//             <div className="col-price">Price/Unit</div>
//             <div className="col-disc">Disc</div>
//             <div className="col-gst">GST</div>
//             <div className="col-amount">Amount</div>
//             {!preview && <div className="col-action">Action</div>}
//           </div>

//           {materials.map((material, index) => (
//             <div key={material.id} className="table-row">
//               <div className="col-num">{index + 1}</div>
//               <div className="col-desc">
//                 <input
//                   type="text"
//                   value={material.description}
//                   onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
//                   placeholder="Enter description"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-hsn">
//                 <input
//                   type="text"
//                   value={material.hsn}
//                   onChange={(e) => updateMaterial(material.id, "hsn", e.target.value)}
//                   placeholder="HSN"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-qty">
//                 <input
//                   type="number"
//                   value={material.qty}
//                   onChange={(e) => updateMaterial(material.id, "qty", e.target.value)}
//                   min="0"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-unit">
//                 <select
//                   value={material.unit}
//                   onChange={(e) => updateMaterial(material.id, "unit", e.target.value)}
//                   disabled={preview}
//                 >
//                   <option value="Nos">Nos</option>
//                   <option value="Kg">Kg</option>
//                   <option value="Ltr">Ltr</option>
//                   <option value="Mtr">Mtr</option>
//                   <option value="Sq.Ft">Sq.Ft</option>
//                   <option value="Box">Box</option>
//                 </select>
//               </div>
//               <div className="col-price">
//                 <input
//                   type="number"
//                   value={material.pricePerUnit}
//                   onChange={(e) => updateMaterial(material.id, "pricePerUnit", e.target.value)}
//                   min="0"
//                   step="0.01"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-disc">
//                 <input
//                   type="number"
//                   value={material.discount}
//                   onChange={(e) => updateMaterial(material.id, "discount", e.target.value)}
//                   min="0"
//                   max="100"
//                   step="0.01"
//                   readOnly={preview}
//                 />%
//               </div>
//               <div className="col-gst">
//                 <input
//                   type="number"
//                   value={material.gst}
//                   onChange={(e) => updateMaterial(material.id, "gst", e.target.value)}
//                   min="0"
//                   step="0.01"
//                   readOnly={preview}
//                 />%
//               </div>
//               <div className="col-amount">
//                 ₹{fmt(material.qty * material.pricePerUnit * (1 - material.discount / 100))}
//               </div>
//               {!preview && (
//                 <div className="col-action">
//                   <button onClick={() => removeMaterial(material.id)} className="remove-btn">
//                     Remove
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div className="table-total-row">
//             <div className="col-qty"></div>
//             <div className="col-desc total-label">Total</div>
//             <div className="col-hsn"></div>
//             <div className="col-qty"></div>
//             <div className="col-unit"></div>
//             <div className="col-price"></div>
//             <div className="col-disc"></div>
//             <div className="col-gst"></div>
//             <div className="col-amount">₹{fmt(calculations.subtotal + calculations.discount)}</div>
//             {!preview && <div className="col-action"></div>}
//           </div>
//         </div>

//         {!preview && (
//           <div className="add-material-section no-print">
//             <button onClick={addMaterial} className="btn add-material">+ Add Material</button>
//           </div>
//         )}

//         {/* Bottom Section */}
//         <div className="bottom-section">
//           <div className="amount-words">
//             <div className="label">Amount in words:</div>
//             <div className="words-value">
//               {numberToWords(Math.floor(calculations.grandTotal))}
//             </div>
//             <div className="signature-area">
//               <div className="signature-label">Company seal and Sign</div>
//             </div>
//           </div>

//           <div className="totals-section">
//             <div className="total-row">
//               <span className="label">Sub Total:</span>
//               <span className="value">₹{fmt(calculations.subtotal + calculations.discount)}</span>
//             </div>
//             <div className="total-row">
//               <span className="label">
//                 Discount ({discountPercent}%):
//                 {!preview && (
//                   <input
//                     type="number"
//                     value={discountPercent}
//                     onChange={(e) => setDiscountPercent(Number(e.target.value || 0))}
//                     min="0" max="100" step="0.1" className="discount-input"
//                   />
//                 )}
//               </span>
//               <span className="value">₹{fmt(calculations.discount)}</span>
//             </div>
//             <div className="total-row">
//               <span className="label">SGST ({taxRates.sgst}%):</span>
//               <span className="value">₹{fmt(calculations.sgst)}</span>
//             </div>
//             <div className="total-row">
//               <span className="label">CGST ({taxRates.cgst}%):</span>
//               <span className="value">₹{fmt(calculations.cgst)}</span>
//             </div>
//             <div className="total-row grand-total">
//               <span className="label">Total:</span>
//               <span className="value">₹{fmt(calculations.grandTotal)}</span>
//             </div>
//             <div className="total-row">
//               <span className="label">Balance:</span>
//               <span className="value">₹{fmt(calculations.grandTotal)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useMemo, useRef, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "./Quotation.css";

// const fmt = (n) =>
//   (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const rAF = () => new Promise(requestAnimationFrame);

// async function ensureImagesLoaded(rootEl) {
//   const imgs = Array.from(rootEl.querySelectorAll("img"));
//   if (!imgs.length) return;
//   await Promise.all(
//     imgs.map(
//       (img) =>
//         new Promise((resolve) => {
//           if (img.complete) return resolve();
//           try { img.crossOrigin = "anonymous"; } catch {}
//           img.onload = img.onerror = () => resolve();
//         })
//     )
//   );
// }

// /** Keep clone inside viewport but invisible: avoids blank renders */
// function makeOffscreenClone(sourceEl) {
//   const rect = sourceEl.getBoundingClientRect();
//   const wrapper = document.createElement("div");
//   Object.assign(wrapper.style, {
//     position: "fixed",
//     left: "0",
//     top: "0",
//     width: Math.ceil(rect.width) + "px",
//     visibility: "hidden",
//     pointerEvents: "none",
//     background: "#fff",
//     zIndex: "-1",
//   });

//   const clone = sourceEl.cloneNode(true);
//   clone.classList.add("print-mode");
//   clone.style.maxWidth = "none";
//   clone.style.width = "100%";

//   document.body.appendChild(wrapper);
//   wrapper.appendChild(clone);
//   return { wrapper, clone };
// }

// function isCanvasBlank(canvas, threshold = 250) {
//   if (!canvas || !canvas.width || !canvas.height) return true;
//   const ctx = canvas.getContext("2d");
//   const { width, height } = canvas;
//   const sx = 10, sy = 10;
//   for (let y = 0; y < sy; y++) {
//     const row = Math.floor((y / (sy - 1 || 1)) * (height - 1));
//     for (let x = 0; x < sx; x++) {
//       const col = Math.floor((x / (sx - 1 || 1)) * (width - 1));
//       const [r, g, b, a] = ctx.getImageData(col, row, 1, 1).data;
//       if (a !== 0 && (r < threshold || g < threshold || b < threshold)) return false;
//     }
//   }
//   return true;
// }

// // Indian number to words
// function numberToWords(num) {
//   if (num === 0) return "Zero";
//   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
//   function convertHundreds(n) {
//     let r = "";
//     if (n >= 100) { r += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
//     if (n >= 20) { r += tens[Math.floor(n / 10)] + " "; n %= 10; }
//     if (n > 0) { r += ones[n] + " "; }
//     return r;
//   }
//   const crore = Math.floor(num / 10000000); num %= 10000000;
//   const lakh = Math.floor(num / 100000);    num %= 100000;
//   const thousand = Math.floor(num / 1000);  num %= 1000;
//   const hundred = num;
//   let out = "";
//   if (crore)   out += convertHundreds(crore) + "Crore ";
//   if (lakh)    out += convertHundreds(lakh) + "Lakh ";
//   if (thousand)out += convertHundreds(thousand) + "Thousand ";
//   if (hundred) out += convertHundreds(hundred);
//   return out.trim() + " Only";
// }

// export default function TaxQuotation() {
//   const sheetRef = useRef(null);
//   const [preview, setPreview] = useState(false);
//   const makingRef = useRef(false);

//   // Company
//   const [company, setCompany] = useState({
//     name: "VRM GROUPS",
//     addressLine1: "15th Cross, A Block No.27",
//     addressLine2: "Ground Floor, Bhuvaneshwari Nagar",
//     addressLine3: "Magadi Main Road, Bangalore - 560091",
//     phone: "+91 9900315454",
//     email: "info@vrmgroups.com",
//     website: "www.vrmgroups.com",
//     gstin: "29ATHPV3440K1Z5",
//   });

//   // Invoice
//   const [invoice, setInvoice] = useState({
//     number: "QTN-" + new Date().getTime().toString().slice(-6),
//     date: new Date().toISOString().slice(0, 10),
//   });

//   // Bill to
//   const [billTo, setBillTo] = useState({
//     name: "", address: "", contactNo: "", gstin: "", state: ""
//   });

//   // Site location
//   const [siteLocation, setSiteLocation] = useState({
//     name: "", address: "", contactNo: ""
//   });

//   // Materials
//   const [materials, setMaterials] = useState([]);
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       if (raw) {
//         const arr = JSON.parse(raw);
//         const rows = arr.map((it, i) => ({
//           id: i + 1, description: it.label || it.name || "",
//           hsn: "", qty: 1, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
//         }));
//         setMaterials(rows.length ? rows : [{ id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
//       } else {
//         setMaterials([{ id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
//       }
//     } catch {
//       setMaterials([{ id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);
//     }
//   }, []);

//   const taxRates = { sgst: 9, cgst: 9 };
//   const [discountPercent, setDiscountPercent] = useState(0);

//   const addMaterial = () =>
//     setMaterials((m) => [...m, { id: Date.now(), description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18 }]);

//   const removeMaterial = (id) =>
//     setMaterials((m) => (m.length > 1 ? m.filter((x) => x.id !== id) : m));

//   const updateMaterial = (id, field, value) =>
//     setMaterials((m) =>
//       m.map((row) =>
//         row.id === id
//           ? { ...row, [field]: ["description", "hsn", "unit"].includes(field) ? value : Number(value || 0) }
//           : row
//       )
//     );

//   const calculations = useMemo(() => {
//     let subtotal = 0;
//     materials.forEach((m) => {
//       const amt = m.qty * m.pricePerUnit;
//       subtotal += (amt - (amt * m.discount) / 100);
//     });
//     const overallDiscount = (subtotal * discountPercent) / 100;
//     const finalSubtotal = subtotal - overallDiscount;
//     const sgst = (finalSubtotal * taxRates.sgst) / 100;
//     const cgst = (finalSubtotal * taxRates.cgst) / 100;
//     const grandTotal = finalSubtotal + sgst + cgst;
//     return { subtotal: finalSubtotal, discount: overallDiscount, sgst, cgst, grandTotal };
//   }, [materials, discountPercent, taxRates.sgst, taxRates.cgst]);

//   // Logo
//   const LOGO_PRIMARY = (process.env.PUBLIC_URL || "") + "/assets/vrmlogo.png";
//   const LOGO_FALLBACK = (process.env.PUBLIC_URL || "") + "/assests/vrmlogo.png";
//   const [logoSrc, setLogoSrc] = useState(LOGO_PRIMARY);

//   // PDF
//   const downloadPDF = async () => {
//     if (makingRef.current) return;
//     makingRef.current = true;

//     try {
//       const src = sheetRef.current;
//       if (!src) return;

//       const tempStyle = document.createElement("style");
//       tempStyle.textContent = `
//         .pdf-mode * {
//           font-family: Arial, Helvetica, sans-serif !important;
//           -webkit-font-smoothing: antialiased !important;
//           -moz-osx-font-smoothing: grayscale !important;
//           text-rendering: optimizeLegibility !important;
//         }
//         .pdf-mode input, .pdf-mode select {
//           color: #000 !important;
//           background: transparent !important;
//           border: none !important;
//           outline: none !important;
//           font-weight: normal !important;
//         }
//         .pdf-mode .col-action { display: none !important; }
//       `;
//       document.head.appendChild(tempStyle);

//       const { wrapper, clone } = makeOffscreenClone(src);
//       clone.classList.add("pdf-mode");
//       try { await document.fonts?.ready; } catch {}
//       await ensureImagesLoaded(clone);
//       await rAF(); await rAF();

//       let canvas = await html2canvas(clone, {
//         scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         foreignObjectRendering: false,
//         allowTaint: true,
//         imageTimeout: 0,
//         logging: false,
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scrollX: 0,
//         scrollY: 0,
//       });

//       if (isCanvasBlank(canvas)) {
//         canvas = await html2canvas(src, {
//           scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           foreignObjectRendering: false,
//           allowTaint: true,
//           imageTimeout: 0,
//           logging: false,
//           width: src.scrollWidth || src.offsetWidth,
//           height: src.scrollHeight || src.offsetHeight,
//           scrollX: 0,
//           scrollY: 0,
//         });
//       }

//       document.body.removeChild(wrapper);
//       document.head.removeChild(tempStyle);

//       const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
//       const pageW = pdf.internal.pageSize.getWidth();
//       const pageH = pdf.internal.pageSize.getHeight();

//       const margin = 8;
//       const availableW = pageW - 2 * margin;
//       const availableH = pageH - 2 * margin;

//       const pxToMm = 25.4 / 96;
//       const imgWmm = canvas.width * pxToMm;
//       const imgHmm = canvas.height * pxToMm;

//       const scale = Math.min(availableW / imgWmm, availableH / imgHmm, 1);
//       const finalW = imgWmm * scale;
//       const finalH = imgHmm * scale;

//       const x = margin + (availableW - finalW) / 2;
//       const y = margin;

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       pdf.addImage(imgData, "PNG", x, y, finalW, finalH, undefined, "FAST");
//       pdf.save(`${invoice.number}.pdf`);
//     } catch (e) {
//       console.error("PDF generation error:", e);
//       alert("Error generating PDF. Please try again.");
//     } finally {
//       makingRef.current = false;
//     }
//   };

//   const printInvoice = async () => {
//     const src = sheetRef.current;
//     if (!src) return;
//     src.classList.add("print-mode");
//     await rAF();
//     window.print();
//     setTimeout(() => src.classList.remove("print-mode"), 300);
//   };

//   return (
//     <div className="quotation-container">
//       <div className="toolbar no-print">
//         <button className="btn ghost" onClick={() => setPreview(!preview)}>
//           {preview ? "Exit Preview" : "Preview"}
//         </button>
//         <div className="spacer" />
//         <button className="btn ghost" onClick={downloadPDF}>Download PDF</button>
//         <button className="btn primary" onClick={printInvoice}>Print</button>
//       </div>

//       <div className={`invoice-sheet ${preview ? "preview" : ""}`} ref={sheetRef}>

//         {/* HEADER */}
//         <header className="modern-header header-grid">
//           {/* Left: Construction + contact */}
//           <div className="header-left-stack">
//             <h2 className="construction-heading">
//               <span>Construction</span><br /> <strong>INVOICE</strong>
//             </h2>

//             <div className="chip">
//               <span className="ic">{/* phone */}<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.05 15.05 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2c1.2.5 2.5.8 3.9.8a1 1 0 011 1V21a1 1 0 01-1 1C11.4 22 2 12.6 2 1a1 1 0 011-1h3.8a1 1 0 011 1c0 1.4.3 2.7.8 3.9a1 1 0 01-.2 1.1l-2.2 2.2z" /></svg></span>
//               <input value={company.phone} onChange={(e)=>setCompany({...company, phone:e.target.value})} readOnly={preview}/>
//             </div>
//             <div className="chip">
//               <span className="ic">{/* mail */}<svg viewBox="0 0 24 24"><path d="M2 4h20v16H2z" fill="none"/><path d="M22 6l-10 7L2 6V4l10 7L22 4z"/></svg></span>
//               <input value={company.email} onChange={(e)=>setCompany({...company, email:e.target.value})} readOnly={preview}/>
//             </div>
//             <div className="chip">
//               <span className="ic">{/* globe */}<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c2.5 0 4.7 1 6.3 2.6A8 8 0 014.7 6.6 7.96 7.96 0 0112 4zm0 16a8 8 0 01-7.3-5h14.6A8 8 0 0112 20z"/></svg></span>
//               <input value={company.website} onChange={(e)=>setCompany({...company, website:e.target.value})} readOnly={preview}/>
//             </div>
//           </div>

//           {/* Center: Logo and brand */}
//           <div className="header-center">
//             <img
//               src={logoSrc}
//               alt="VRM Logo"
//               className="logo-image"
//               crossOrigin="anonymous"
//               onError={() => { if (logoSrc !== LOGO_FALLBACK) setLogoSrc(LOGO_FALLBACK); }}
//             />
//             <div className="brand-badge">
//               <span className="brand-accent">VRM</span>
//               <span className="brand-rest">GROUPS</span>
//             </div>
//           </div>

//           {/* Right: Address and GST */}
//           <div className="header-right-stack">
//             <div className="chip">
//               <span className="ic">{/* map pin */}<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg></span>
//               <input value={company.addressLine1} onChange={(e)=>setCompany({...company, addressLine1:e.target.value})} readOnly={preview}/>
//             </div>
//             <div className="chip">
//               <span className="ic">{/* map pin */}<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg></span>
//               <input value={company.addressLine2} onChange={(e)=>setCompany({...company, addressLine2:e.target.value})} readOnly={preview}/>
//             </div>
//             <div className="chip">
//               <span className="ic">{/* map pin */}<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg></span>
//               <input value={company.addressLine3} onChange={(e)=>setCompany({...company, addressLine3:e.target.value})} readOnly={preview}/>
//             </div>
//             <div className="chip">
//               <span className="ic">{/* id-card */}<svg viewBox="0 0 24 24"><path d="M3 4h18v16H3z" fill="none"/><path d="M5 6h14v2H5zm0 4h8v2H5zm0 4h6v2H5z"/></svg></span>
//               <input value={`GSTIN: ${company.gstin}`} onChange={()=>{}} readOnly />
//             </div>
//           </div>
//         </header>

//         <div className="invoice-title">Tax Invoice</div>

//         {/* Bill To & Site/Location */}
//         <div className="bill-site-section">
//           <div className="bill-to">
//             <div className="section-title">Bill To:</div>
//             <div className="field-group">
//               <div className="field"><label>Name:</label><input value={billTo.name} onChange={(e)=>setBillTo({...billTo, name:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>Address:</label><input value={billTo.address} onChange={(e)=>setBillTo({...billTo, address:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>Contact No.:</label><input value={billTo.contactNo} onChange={(e)=>setBillTo({...billTo, contactNo:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>GSTIN No.:</label><input value={billTo.gstin} onChange={(e)=>setBillTo({...billTo, gstin:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>State:</label><input value={billTo.state} onChange={(e)=>setBillTo({...billTo, state:e.target.value})} readOnly={preview}/></div>
//             </div>
//           </div>

//           <div className="site-location">
//             <div className="section-title">Site /Location:</div>
//             <div className="field-group">
//               <div className="field"><label>Name:</label><input value={siteLocation.name} onChange={(e)=>setSiteLocation({...siteLocation, name:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>Address:</label><input value={siteLocation.address} onChange={(e)=>setSiteLocation({...siteLocation, address:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>Contact No.:</label><input value={siteLocation.contactNo} onChange={(e)=>setSiteLocation({...siteLocation, contactNo:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>Invoice No.:</label><input value={invoice.number} onChange={(e)=>setInvoice({...invoice, number:e.target.value})} readOnly={preview}/></div>
//               <div className="field"><label>Date:</label><input type="date" value={invoice.date} onChange={(e)=>setInvoice({...invoice, date:e.target.value})} readOnly={preview}/></div>
//             </div>
//           </div>
//         </div>

//         {/* Materials */}
//         <div className="materials-table">
//           <div className="table-header">
//             <div className="col-num">#</div>
//             <div className="col-desc">Description</div>
//             <div className="col-hsn">HSN</div>
//             <div className="col-qty">QTY</div>
//             <div className="col-unit">Unit</div>
//             <div className="col-price">Price/Unit</div>
//             <div className="col-disc">Disc</div>
//             <div className="col-gst">GST</div>
//             <div className="col-amount">Amount</div>
//             {!preview && <div className="col-action">Action</div>}
//           </div>

//           {materials.map((row, i) => (
//             <div key={row.id} className="table-row">
//               <div className="col-num">{i + 1}</div>
//               <div className="col-desc"><input value={row.description} onChange={(e)=>updateMaterial(row.id,"description",e.target.value)} placeholder="Enter description" readOnly={preview}/></div>
//               <div className="col-hsn"><input value={row.hsn} onChange={(e)=>updateMaterial(row.id,"hsn",e.target.value)} placeholder="HSN" readOnly={preview}/></div>
//               <div className="col-qty"><input type="number" value={row.qty} onChange={(e)=>updateMaterial(row.id,"qty",e.target.value)} min="0" readOnly={preview}/></div>
//               <div className="col-unit">
//                 <select value={row.unit} onChange={(e)=>updateMaterial(row.id,"unit",e.target.value)} disabled={preview}>
//                   <option>Nos</option><option>Kg</option><option>Ltr</option><option>Mtr</option><option>Sq.Ft</option><option>Box</option>
//                 </select>
//               </div>
//               <div className="col-price"><input type="number" value={row.pricePerUnit} onChange={(e)=>updateMaterial(row.id,"pricePerUnit",e.target.value)} min="0" step="0.01" readOnly={preview}/></div>
//               <div className="col-disc"><input type="number" value={row.discount} onChange={(e)=>updateMaterial(row.id,"discount",e.target.value)} min="0" max="100" step="0.01" readOnly={preview}/>%</div>
//               <div className="col-gst"><input type="number" value={row.gst} onChange={(e)=>updateMaterial(row.id,"gst",e.target.value)} min="0" step="0.01" readOnly={preview}/>%</div>
//               <div className="col-amount">₹{fmt(row.qty * row.pricePerUnit * (1 - row.discount/100))}</div>
//               {!preview && (
//                 <div className="col-action">
//                   <button className="remove-btn" onClick={()=>removeMaterial(row.id)}>Remove</button>
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* compact total row */}
//           <div className="table-total-row">
//             <div className="col-desc total-label">Total</div>
//             <div className="col-amount">₹{fmt(calculations.subtotal + calculations.discount)}</div>
//           </div>
//         </div>

//         {!preview && (
//           <div className="add-material-section no-print">
//             <button onClick={addMaterial} className="btn add-material">+ Add Material</button>
//           </div>
//         )}

//         {/* Bottom */}
//         <div className="bottom-section">
//           <div className="amount-words">
//             <div className="label">Amount in words:</div>
//             <div className="words-value">{numberToWords(Math.floor(calculations.grandTotal))}</div>
//             <div className="signature-area"><div className="signature-label">Company seal and Sign</div></div>
//           </div>

//           <div className="totals-section">
//             <div className="total-row">
//               <span className="label">Sub Total:</span>
//               <span className="value">₹{fmt(calculations.subtotal + calculations.discount)}</span>
//             </div>
//             <div className="total-row">
//               <span className="label">
//                 Discount ({discountPercent}%):
//                 {!preview && (
//                   <input className="discount-input" type="number" value={discountPercent}
//                     onChange={(e)=>setDiscountPercent(Number(e.target.value || 0))}
//                     min="0" max="100" step="0.1"/>
//                 )}
//               </span>
//               <span className="value">₹{fmt(calculations.discount)}</span>
//             </div>
//             <div className="total-row"><span className="label">SGST ({taxRates.sgst}%):</span><span className="value">₹{fmt(calculations.sgst)}</span></div>
//             <div className="total-row"><span className="label">CGST ({taxRates.cgst}%):</span><span className="value">₹{fmt(calculations.cgst)}</span></div>
//             <div className="total-row grand-total"><span className="label">Total:</span><span className="value">₹{fmt(calculations.grandTotal)}</span></div>
//             <div className="total-row"><span className="label">Balance:</span><span className="value">₹{fmt(calculations.grandTotal)}</span></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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

  // Simplified PDF generation
  const downloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const sourceElement = sheetRef.current;
      if (!sourceElement) {
        throw new Error("Source element not found");
      }

      // Create a clone
      const clone = sourceElement.cloneNode(true);
      
      // Create wrapper for the clone
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: absolute;
        top: -9999px;
        left: 0;
        width: 794px;
        background: white;
        font-family: Arial, sans-serif;
      `;
      
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

      const tableRows = clone.querySelectorAll('.table-row, .table-total-row');
      tableRows.forEach(row => {
        row.style.gridTemplateColumns = '35px 1fr 65px 50px 55px 85px 50px 50px 85px';
      });

      document.body.appendChild(wrapper);
      wrapper.appendChild(clone);

      // Wait for fonts and layout
      await rAF();
      await rAF();

      // Replace inputs with text
      replaceInputsWithText(clone);

      // Wait a bit more for the changes to take effect
      await rAF();
      await rAF();

      console.log('Generating canvas from element with dimensions:', clone.offsetWidth, 'x', clone.offsetHeight);

      // Generate canvas
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: false,
        allowTaint: false,
        imageTimeout: 0,
        removeContainer: true,
        width: clone.offsetWidth,
        height: clone.offsetHeight
      });

      // Clean up
      document.body.removeChild(wrapper);

      console.log('Canvas generated with dimensions:', canvas.width, 'x', canvas.height);

      // Check if canvas has content
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some((pixel, index) => {
        // Check alpha channel (every 4th value) and color channels
        if (index % 4 === 3) return pixel > 0; // Alpha > 0
        return pixel < 255; // RGB < 255 (not pure white)
      });

      if (!hasContent) {
        throw new Error("Generated canvas appears to be blank - no content detected");
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pdfWidth - (margin * 2);
      const maxHeight = pdfHeight - (margin * 2);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(maxWidth / (imgWidth * 0.264583), maxHeight / (imgHeight * 0.264583));

      const finalWidth = (imgWidth * 0.264583) * ratio;
      const finalHeight = (imgHeight * 0.264583) * ratio;

      const x = margin + (maxWidth - finalWidth) / 2;
      const y = margin;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`${invoice.number}.pdf`);

    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
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
              <span>Construction</span><br/><strong>INVOICE</strong>
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

        <div className="invoice-title">Tax Invoice</div>

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