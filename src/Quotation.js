
// // Quotation.js
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "./Quotation.css";

// const fmt = (n) =>
//   (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// export default function Quotation() {
//   const printRef = useRef(null);
//   const [preview, setPreview] = useState(false);
//   const generatingRef = useRef(false);

//   // --- Letterhead (HTML) ---
//   // NOTE: images live under /public/assests (spelling as in project)
//   const logoSrc = `${process.env.PUBLIC_URL}/assests/vrm.png`;
//   const watermarkSrc = `${process.env.PUBLIC_URL}/assests/vrmlogo.png`;
//   const head = {
//     company: "VRM GROUPS",
//     tagline: "Building Construction",
//     addr1: "No 68 Hemadri, 1st Main Attached Bel,",
//     addr2: "Balaji Layout, Marappana Palya, Bengaluru North 562123",
//     site: "www.vrmgroups.com",
//     email: "info@vrmgroups.com",
//     phone: "+91 9900315454",
//   };

//   // --- Meta (Ref / Date) ---
//   const [meta, setMeta] = useState({
//     refNo: "QTN-" + new Date().getTime().toString().slice(-6),
//     date: new Date().toISOString().slice(0, 10),
//     time: new Date().toTimeString().slice(0,5), // HH:MM
//     title: "QUOTATION",
//   });

//   // --- Client fields ---
//   const [client, setClient] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   // --- Items from SubCategories selection ---
//   const [rows, setRows] = useState([]);
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       const arr = raw ? JSON.parse(raw) : [];
//       const map = new Map();
//       arr.forEach(({ catId, key, label }) =>
//         map.set(`${catId}:${key}`, {
//           id: `${catId}:${key}`,
//           name: label,
//           qty: 1,
//           price: 0,
//         })
//       );
//       setRows(Array.from(map.values()));
//     } catch {}
//   }, []);

//   const lineTotal = (r) => Number(r.qty || 0) * Number(r.price || 0);
//   const subTotal = useMemo(() => rows.reduce((s, r) => s + lineTotal(r), 0), [rows]);

//   const setQty = (i, v) =>
//     setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, qty: Math.max(0, Number(v || 0)) } : r)));
//   const setPrice = (i, v) =>
//     setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, price: Number(v || 0) } : r)));
//   const removeRow = (i) => setRows((rs) => rs.filter((_, idx) => idx !== i));

//   // --- PDF & Print ---
//   const downloadPDF = async (e) => {
//     // Prevent accidental double clicks and default form behavior
//     e?.preventDefault?.();
//     if (generatingRef.current) return;
//     generatingRef.current = true;
//     try {
//       const node = printRef.current;
//       if (!node) return;

//       // Force preview styling during capture so PDF matches the letterhead layout
//       const prev = preview;
//       if (!prev) setPreview(true);
//       await new Promise((r) => setTimeout(r, 60));

//       const canvas = await html2canvas(node, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         windowWidth: node.scrollWidth,
//         scrollY: -window.scrollY,
//       });
//       const img = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   // Properly paginate by shifting the image upward per page; avoid an extra blank page due to rounding
//   const epsilon = 0.5; // mm margin to prevent creating an almost-empty page
//   const pageCount = Math.max(1, Math.ceil((imgHeight - epsilon) / pageHeight));
//   for (let i = 0; i < pageCount; i++) {
//         if (i > 0) pdf.addPage();
//         const yOffset = -i * pageHeight; // shift image up to show next slice
//         pdf.addImage(img, "PNG", 0, yOffset, imgWidth, imgHeight);
//       }

//       pdf.save(`${meta.refNo}.pdf`);
//   // Restore preview state
//   if (!prev) setPreview(false);
//     } finally {
//       generatingRef.current = false;
//     }
//   };

//   const printPage = async () => {
//     const prev = preview;
//     setPreview(true);
//     await new Promise((r) => setTimeout(r, 40));
//     window.print();
//     setPreview(prev);
//   };

//   return (
//     <section className="qtn-wrap">
//       <div className="qtn-toolbar no-print">
//         <button className="btn ghost" onClick={() => setPreview((p) => !p)}>
//           {preview ? "Exit Preview" : "Preview"}
//         </button>
//         <div className="spacer" />
//   <button type="button" className="btn ghost" onClick={downloadPDF}>
//           Download PDF
//         </button>
//         <button className="btn" onClick={printPage}>
//           Print
//         </button>
//       </div>

//       <div className={`qtn-sheet ${preview ? "preview" : ""}`} ref={printRef}>
//   {/* Top-right decorative image (scoped to Quotation) */}
//         <div className="qtn-topimage">
//           <img
//             src={process.env.PUBLIC_URL + '/assests/img2.png'}
//             alt="Decoration"
//             loading="lazy"
//           />
//         </div>
//         {/* Top decorations removed as requested */}
//         <img className="watermark" src={watermarkSrc} alt="" aria-hidden="true" />
//         <header className="qtn-header">
//           <div className="brand">
//             <img src={logoSrc} alt="VRM Logo" className="brand-logo" />
//             <div className="brand-meta">
//               <h1>
//                 <span className="vrm">VRM</span> <span className="groups">GROUPS</span>
//               </h1>
//               <div className="slogan">{head.tagline}</div>
//             </div>
//           </div>
//         </header>

//   {/* Removed header-accent; gold bar is at top now */}

//         {/* Ref / Date & Time bar */}
//         <div className="refbar">
//           {!preview ? (
//             <>
//               <label className="refcell">
//                 <span>Ref No.</span>
//                 <input
//                   className="inp"
//                   value={meta.refNo}
//                   onChange={(e) => setMeta({ ...meta, refNo: e.target.value })}
//                 />
//               </label>
//               <div className="refgrid">
//                 <label className="refcell">
//                   <span>Date</span>
//                   <input
//                     className="inp"
//                     type="date"
//                     value={meta.date}
//                     onChange={(e) => setMeta({ ...meta, date: e.target.value })}
//                   />
//                 </label>
//                 <label className="refcell">
//                   <span>Time</span>
//                   <input
//                     className="inp"
//                     type="time"
//                     value={meta.time}
//                     onChange={(e) => setMeta({ ...meta, time: e.target.value })}
//                   />
//                 </label>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="refcell"><strong>Ref No.</strong> {meta.refNo}</div>
//               <div className="refcell right"><strong>Date:</strong> {meta.date} &nbsp; <strong>Time:</strong> {meta.time}</div>
//             </>
//           )}
//         </div>

//   {/* Body wrapper ensures footer stays at bottom of page */}
//   <div className="qtn-body">
//   {/* Client / Party details (content area) */}
//   <section className="qtn-meta">
//           {!preview ? (
//             <>
//               <div className="grid-2">
//                 <input
//                   className="inp"
//                   placeholder="Client / Party name"
//                   value={client.name}
//                   onChange={(e) => setClient({ ...client, name: e.target.value })}
//                 />
//                 <input
//                   className="inp"
//                   placeholder="name@example.com"
//                   value={client.email}
//                   onChange={(e) => setClient({ ...client, email: e.target.value })}
//                 />
//               </div>
//               <div className="grid-2">
//                 <input
//                   className="inp"
//                   placeholder="+91 ..."
//                   value={client.phone}
//                   onChange={(e) => setClient({ ...client, phone: e.target.value })}
//                 />
//                 <input
//                   className="inp"
//                   placeholder="Street, City, PIN"
//                   value={client.address}
//                   onChange={(e) => setClient({ ...client, address: e.target.value })}
//                 />
//               </div>
//             </>
//           ) : (
//             <div className="client-view">
//               <div>
//                 <strong>{client.name || "Client"}</strong>
//               </div>
//               {client.address && <div>{client.address}</div>}
//               {client.phone && <div>Phone: {client.phone}</div>}
//               {client.email && <div>Email: {client.email}</div>}
//             </div>
//           )}
//   </section>

//         {/* Items table */}
//         <section className="qtn-items">
//           <div className="table">
//             <div className="tr th">
//               <div className="td no">#</div>
//               <div className="td name">Item / Product Description</div>
//               <div className="td qty">Qty</div>
//               <div className="td price">Price / Unit</div>
//               <div className="td amt">Amount</div>
//               {!preview && <div className="td actions"></div>}
//             </div>

//             {rows.map((row, i) => (
//               <div className="tr" key={row.id}>
//                 <div className="td no">{i + 1}</div>
//                 <div className="td name">{row.name}</div>

//                 <div className="td qty">
//                   {preview ? (
//                     <span>{row.qty}</span>
//                   ) : (
//                     <input
//                       className="inp center small no-spin"
//                       type="number"
//                       min="0"
//                       step="1"
//                       value={row.qty}
//                       onChange={(e) => setQty(i, e.target.value)}
//                     />
//                   )}
//                 </div>

//                 <div className="td price">
//                   {preview ? (
//                     <span>{fmt(row.price)}</span>
//                   ) : (
//                     <input
//                       className="inp right small"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={row.price}
//                       onChange={(e) => setPrice(i, e.target.value)}
//                       placeholder="0.00"
//                     />
//                   )}
//                 </div>

//                 <div className="td amt">₹ {fmt(lineTotal(row))}</div>

//                 {!preview && (
//                   <div className="td actions">
//                     <button className="link danger" onClick={() => removeRow(i)}>
//                       Remove
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//   </section>

//   {/* Totals */}
//   <section className="qtn-totals">

//           <div className="row grand">
//             <div className="lbl">Grand Total</div>
//             <div className="val">₹ {fmt(subTotal)}</div>
//           </div>
//   </section>
//   </div>
//         {/* Footer contact bar to match letterhead */}
//         <footer className="lh-footer">
//           <div className="sep-line" />
//           <div className="contact-row">
//             {/* Left column row 1: Address */}
//             <div className="contact">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 14 6 14s6-9.5 6-14c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5z"/></svg>
//               <span>{head.addr1} {head.addr2}</span>
//             </div>
//             {/* Right column row 1: Email */}
//             <div className="contact">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
//               <span>{head.email}</span>
//             </div>
//             {/* Left column row 2: Website */}
//             <div className="contact">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
//               <span>{head.site}</span>
//             </div>
//             {/* Right column row 2: Phone */}
//             <div className="contact">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 12 20a19.8 19.8 0 0 1-7.82 1.92A2 2 0 0 1 2 19.92v-3a2 2 0 0 1 2-2h.58a2 2 0 0 1 1.94 1.5 11.7 11.7 0 0 0 2.2 4.52 2 2 0 0 0 2.63.38 11.7 11.7 0 0 0 4.52-2.2 2 2 0 0 1 1.5-1.94H20a2 2 0 0 1 2 2z"/></svg>
//               <span>{head.phone}</span>
//             </div>
//           </div>
//           <div className="bottom-bar" aria-hidden="true">
//             <div className="bottom-accent" aria-hidden="true" />
//           </div>
//         </footer>
//       </div>
//     </section>
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

// const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// async function ensureImagesLoaded(rootEl) {
//   const imgs = Array.from(rootEl.querySelectorAll("img"));
//   if (imgs.length === 0) return;
//   await Promise.all(
//     imgs.map(
//       (img) =>
//         new Promise((resolve) => {
//           if (img.complete) return resolve();
//           // help CORS for same-origin assets
//           try { img.crossOrigin = "anonymous"; } catch {}
//           img.onload = img.onerror = () => resolve();
//         })
//     )
//   );
// }

// export default function Quotation() {
//   const sheetRef = useRef(null);
//   const [preview, setPreview] = useState(false);
//   const makingRef = useRef(false);

//   // Branding
//   // Use the public/assests path so we don't import files from outside src (CRA restriction)
//   const logoSrc = (process.env.PUBLIC_URL || "") + "/assests/logoC.png";
//   const brand = {
//     company: "VRM GROUPS",
//     phone: "+91 9900315454",
//     email: "info@vrmgroups.com",
//     site: "www.vrmgroups.com",
//     street: "Your Street",
//     city: "City, State, Country",
//     zip: "ZIP Code",
//   };

//   // Header meta + BILL TO
//   const [meta, setMeta] = useState({
//     invoiceNumber: "QTN-" + new Date().getTime().toString().slice(-6),
//     date: new Date().toISOString().slice(0, 10),
//     customerId: "",
//   });
//   const [billTo, setBillTo] = useState({
//     name: "",
//     street: "",
//     cityStateCountry: "",
//     phone: "",
//   });

//   // Products
//   const [rows, setRows] = useState([]);
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       const arr = raw ? JSON.parse(raw) : [];
//       const map = new Map();
//       arr.forEach(({ catId, key, label }) =>
//         map.set(`${catId}:${key}`, {
//           id: `${catId}:${key}`,
//           name: label,
//           qty: 1,
//           price: 0,
//         })
//       );
//       setRows(Array.from(map.values()));
//     } catch {
//       setRows([]);
//     }
//   }, []);
//   const setQty = (i, v) =>
//     setRows((rs) =>
//       rs.map((r, k) => (k === i ? { ...r, qty: Math.max(0, Number(v || 0)) } : r))
//     );
//   const setPrice = (i, v) =>
//     setRows((rs) => rs.map((r, k) => (k === i ? { ...r, price: Number(v || 0) } : r)));
//   const removeRow = (i) => setRows((rs) => rs.filter((_, k) => k !== i));
//   const lineTotal = (r) => Number(r.qty || 0) * Number(r.price || 0);
//   const productsTotal = useMemo(() => rows.reduce((s, r) => s + lineTotal(r), 0), [rows]);

//   // Labor
//   const [laborVisible, setLaborVisible] = useState(false);
//   const [laborRows, setLaborRows] = useState([]);
//   const addLaborRow = () => {
//     if (!laborVisible) setLaborVisible(true);
//     setLaborRows((ls) => [
//       ...ls,
//       { id: Date.now() + "-" + (ls.length + 1), hours: 0, desc: "", rate: 0 },
//     ]);
//   };
//   const setLaborField = (i, field, val) =>
//     setLaborRows((ls) =>
//       ls.map((r, k) => (k === i ? { ...r, [field]: field === "desc" ? val : Number(val || 0) } : r))
//     );
//   const removeLaborRow = (i) => setLaborRows((ls) => ls.filter((_, k) => k !== i));
//   const laborLineTotal = (r) => Number(r.hours || 0) * Number(r.rate || 0);
//   const laborTotal = useMemo(() => laborRows.reduce((s, r) => s + laborLineTotal(r), 0), [laborRows]);

//   // Totals
//   const [taxPct, setTaxPct] = useState(0);
//   const subTotal = useMemo(() => productsTotal + laborTotal, [productsTotal, laborTotal]);
//   const taxAmount = useMemo(() => (subTotal * Number(taxPct || 0)) / 100, [subTotal, taxPct]);
//   const grandTotal = useMemo(() => subTotal + taxAmount, [subTotal, taxAmount]);

//   // Bottom notes
//   const [paymentDays, setPaymentDays] = useState("");
//   const [comments, setComments] = useState("");

//   // ---- PRINT/PDF: capture the exact PREVIEW layout ----
//   const downloadPDF = async () => {
//     if (makingRef.current) return;
//     makingRef.current = true;
//     const node = sheetRef.current;
//     const prevPreview = preview;

//     try {
//       // Force preview to ensure DOM matches what you see in Preview
//       setPreview(true);
//       await wait(50); // allow React to re-render

//       node.classList.add("print-mode");

//       // make sure fonts & images are ready
//       try { await document.fonts?.ready; } catch {}
//       await ensureImagesLoaded(node);
//       await wait(100);

//       const canvas = await html2canvas(node, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         windowWidth: node.scrollWidth,
//         windowHeight: node.scrollHeight,
//         allowTaint: true,
//         foreignObjectRendering: true,
//       });

//       const pdf = new jsPDF("p", "mm", "a4");
//       const pageW = pdf.internal.pageSize.getWidth();
//       const pageH = pdf.internal.pageSize.getHeight();

//       // Slice the tall canvas into page-high chunks (clean pagination)
//       const pxPerMm = canvas.width / pageW;
//       const pageHeightPx = Math.floor(pageH * pxPerMm);

//       let y = 0;
//       let pageIndex = 0;
//       while (y < canvas.height) {
//         const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
//         const pageCanvas = document.createElement("canvas");
//         pageCanvas.width = canvas.width;
//         pageCanvas.height = sliceHeight;
//         const ctx = pageCanvas.getContext("2d");
//         ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

//         const imgData = pageCanvas.toDataURL("image/png");
//         if (pageIndex > 0) pdf.addPage();
//         const hMm = (sliceHeight / canvas.width) * pageW; // keep aspect
//         pdf.addImage(imgData, "PNG", 0, 0, pageW, hMm);

//         y += sliceHeight;
//         pageIndex += 1;
//       }

//       pdf.save(`${meta.invoiceNumber}.pdf`);
//     } finally {
//       // restore UI
//       sheetRef.current?.classList.remove("print-mode");
//       setPreview(prevPreview);
//       makingRef.current = false;
//     }
//   };

//   const printPage = async () => {
//     const node = sheetRef.current;
//     const prevPreview = preview;
//     // Force preview so print matches preview
//     setPreview(true);
//     await wait(50);
//     node.classList.add("print-mode");
//     await wait(50);
//     window.print();
//     setTimeout(() => {
//       node.classList.remove("print-mode");
//       setPreview(prevPreview);
//     }, 400);
//   };

//   return (
//     <section className="qtn-wrap">
//       <div className="qtn-toolbar no-print">
//         <button className="btn ghost" onClick={() => setPreview((p) => !p)}>
//           {preview ? "Exit Preview" : "Preview"}
//         </button>
//         <div className="spacer" />
//         <button className="btn ghost" onClick={downloadPDF}>Download PDF</button>
//         <button className="btn" onClick={printPage}>Print</button>
//       </div>

//       <div className={`sheet a4 ${preview ? "preview" : ""}`} ref={sheetRef}>
//         {/* HEADER */}
//         <header className="invoice-header">
//           <div className="header-left">
//             <div className="title-construction">Construction</div>
//             <div className="title-invoice">INVOICE</div>
//             <div className="company-name">{brand.company}</div>
//           </div>
//           <div className="header-center">
//             <img
//               src={logoSrc}
//               alt="Logo"
//               className="logo"
//               crossOrigin="anonymous"
//               onError={(e) => {
//                 // fallback to public path if import failed for any reason
//                 if (e?.target) e.target.src = (process.env.PUBLIC_URL || "") + "/assests/logoC.png";
//               }}
//             />
//           </div>
//           <div className="header-right">
//             <div className="contact-line">{brand.phone}</div>
//             <div className="contact-line">{brand.email}</div>
//             <div className="contact-line">{brand.site}</div>
//             <div className="address-section">
//               <div className="address-line">{brand.street}</div>
//               <div className="address-line">{brand.city}</div>
//               <div className="address-line">{brand.zip}</div>
//             </div>
//           </div>
//         </header>

//         {/* BILL TO + TOTAL */}
//         <div className="billto-total-section">
//           <div className="billto-container">
//             <div className="billto-header">BILL TO</div>
//             <div className="billto-content">
//               <div className="billto-form">
//                 <div className="form-row">
//                   <label className="form-label">Invoice Number:</label>
//                   <input
//                     className="form-input"
//                     value={meta.invoiceNumber}
//                     onChange={(e) => setMeta({ ...meta, invoiceNumber: e.target.value })}
//                     readOnly={preview}
//                   />
//                   <label className="form-label">Name:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.name}
//                     onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <label className="form-label">Date:</label>
//                   <input
//                     className="form-input"
//                     type="date"
//                     value={meta.date}
//                     onChange={(e) => setMeta({ ...meta, date: e.target.value })}
//                     readOnly={preview}
//                   />
//                   <label className="form-label">Street:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.street}
//                     onChange={(e) => setBillTo({ ...billTo, street: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <label className="form-label">Customer ID:</label>
//                   <input
//                     className="form-input"
//                     value={meta.customerId}
//                     onChange={(e) => setMeta({ ...meta, customerId: e.target.value })}
//                     readOnly={preview}
//                   />
//                   <label className="form-label">City, State, Country:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.cityStateCountry}
//                     onChange={(e) => setBillTo({ ...billTo, cityStateCountry: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div></div><div></div>
//                   <label className="form-label">Phone:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.phone}
//                     onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="invoice-total-box">
//             <div className="total-label">INVOICE TOTAL</div>
//             <div className="total-amount">₹{fmt(grandTotal)}</div>
//           </div>
//         </div>

//         {/* PRODUCTS */}
//         <div className="section-header">PRODUCTS</div>
//         <div className="products-table">
//           <div className="table-header">
//             <div className="col-quantity">Quantity</div>
//             <div className="col-description">Description</div>
//             <div className="col-price">Unit Price</div>
//             <div className="col-amount">Amount</div>
//             {!preview && <div className="col-action"></div>}
//           </div>

//           {rows.map((r, i) => (
//             <div className="table-row" key={r.id}>
//               <div className="col-quantity">
//                 <input
//                   className="table-input center"
//                   type="number"
//                   min="0"
//                   step="1"
//                   value={r.qty}
//                   onChange={(e) => setQty(i, e.target.value)}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-description">{r.name}</div>
//               <div className="col-price">
//                 <input
//                   className="table-input right"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={r.price}
//                   onChange={(e) => setPrice(i, e.target.value)}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-amount">₹{fmt(lineTotal(r))}</div>
//               {!preview && (
//                 <div className="col-action">
//                   <button className="remove-btn" onClick={() => removeRow(i)}>Remove</button>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div className="table-total-row">
//             <div className="col-quantity"></div>
//             <div className="col-description total-label-cell">Total Products</div>
//             <div className="col-price"></div>
//             <div className="col-amount total-value">₹{fmt(productsTotal)}</div>
//             {!preview && <div className="col-action"></div>}
//           </div>
//         </div>

//         {/* LABOR */}
//         {laborVisible && (
//           <>
//             <div className="section-header">LABOR</div>
//             <div className="labor-table">
//               <div className="table-header">
//                 <div className="col-quantity">Hour</div>
//                 <div className="col-description">Description</div>
//                 <div className="col-price">₹ / Hour</div>
//                 <div className="col-amount">Amount</div>
//                 {!preview && <div className="col-action"></div>}
//               </div>

//               {laborRows.map((r, i) => (
//                 <div className="table-row" key={r.id}>
//                   <div className="col-quantity">
//                     <input
//                       className="table-input center"
//                       type="number"
//                       min="0"
//                       step="0.25"
//                       value={r.hours}
//                       onChange={(e) => setLaborField(i, "hours", e.target.value)}
//                       readOnly={preview}
//                     />
//                   </div>
//                   <div className="col-description">
//                     <input
//                       className="table-input"
//                       placeholder="Work description"
//                       value={r.desc}
//                       onChange={(e) => setLaborField(i, "desc", e.target.value)}
//                       readOnly={preview}
//                     />
//                   </div>
//                   <div className="col-price">
//                     <input
//                       className="table-input right"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={r.rate}
//                       onChange={(e) => setLaborField(i, "rate", e.target.value)}
//                       readOnly={preview}
//                     />
//                   </div>
//                   <div className="col-amount">₹{fmt(laborLineTotal(r))}</div>
//                   {!preview && (
//                     <div className="col-action">
//                       <button className="remove-btn" onClick={() => removeLaborRow(i)}>Remove</button>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {!preview && (
//                 <div className="table-add-row">
//                   <div className="col-quantity"></div>
//                   <div className="col-description">
//                     <button className="add-row-btn" onClick={addLaborRow}>+ Add Labor Row</button>
//                   </div>
//                   <div className="col-price"></div>
//                   <div className="col-amount"></div>
//                   <div className="col-action"></div>
//                 </div>
//               )}

//               <div className="table-total-row">
//                 <div className="col-quantity"></div>
//                 <div className="col-description total-label-cell">Total Labor</div>
//                 <div className="col-price"></div>
//                 <div className="col-amount total-value">₹{fmt(laborTotal)}</div>
//                 {!preview && <div className="col-action"></div>}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Summary totals */}
//         <div className="summary-section">
//           <div className="summary-totals">
//             <div className="summary-row">
//               <div className="summary-label">Total Labor</div>
//               <div className="summary-value">₹{fmt(laborTotal)}</div>
//             </div>
//             <div className="summary-row">
//               <div className="summary-label">Subtotal</div>
//               <div className="summary-value">₹{fmt(subTotal)}</div>
//             </div>
//             <div className="summary-row">
//               <div className="summary-label">
//                 Sales Tax{" "}
//                 <input
//                   className="tax-input"
//                   type="number"
//                   min="0"
//                   step="0.1"
//                   value={taxPct}
//                   onChange={(e) => setTaxPct(e.target.value)}
//                   readOnly={preview}
//                 />
//                 %
//               </div>
//               <div className="summary-value">₹{fmt(taxAmount)}</div>
//             </div>
//             <div className="summary-row total-row">
//               <div className="summary-label">TOTAL</div>
//               <div className="summary-value">₹{fmt(grandTotal)}</div>
//             </div>
//           </div>
//         </div>

//         {/* Notes */}
//         <div className="footer-section">
//           <div className="payment-terms">
//             Payment is due within{" "}
//             <input
//               className="inline-input"
//               type="number"
//               min="0"
//               value={paymentDays}
//               onChange={(e) => setPaymentDays(e.target.value)}
//               placeholder="#"
//               readOnly={preview}
//             />{" "}
//             of days.
//           </div>
//           <div className="comments-section">
//             Comments or Special Instructions:{" "}
//             <input
//               className="comments-input"
//               placeholder="Write any note for the client"
//               value={comments}
//               onChange={(e) => setComments(e.target.value)}
//               readOnly={preview}
//             />
//           </div>
//         </div>

//         {!preview && (
//           <div className="add-labor-section no-print">
//             <button className="btn add-labor-btn" onClick={addLaborRow}>Add Labour</button>
//           </div>
//         )}

//         <div className="document-footer">Brought to you by VRM GROUPS</div>
//       </div>
//     </section>
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

// /** Mount an off-screen clone for stable capture (no layout shifts) */
// function makeOffscreenClone(sourceEl) {
//   const wrapper = document.createElement("div");
//   Object.assign(wrapper.style, {
//     position: "fixed",
//     left: "-10000px",
//     top: "0",
//     width: `${sourceEl.offsetWidth}px`,
//     background: "#fff",
//     zIndex: "-1",
//   });
//   const clone = sourceEl.cloneNode(true);
//   // Only hide interactive controls; keep layout identical to screen
//   clone.classList.add("print-mode");
//   wrapper.appendChild(clone);
//   document.body.appendChild(wrapper);
//   return { wrapper, clone };
// }

// /** Utility: test if a small canvas slice is basically blank */
// function isSliceBlank(canvas, threshold = 250) {
//   const ctx = canvas.getContext("2d");
//   const { width, height } = canvas;
//   // Sample a 10x10 grid instead of full image for speed
//   const sampleX = 10, sampleY = 10;
//   for (let y = 0; y < sampleY; y++) {
//     const row = Math.floor((y / (sampleY - 1 || 1)) * (height - 1));
//     for (let x = 0; x < sampleX; x++) {
//       const col = Math.floor((x / (sampleX - 1 || 1)) * (width - 1));
//       const [r, g, b, a] = ctx.getImageData(col, row, 1, 1).data;
//       if (a !== 0 && (r < threshold || g < threshold || b < threshold)) {
//         return false; // found a non-white-ish pixel
//       }
//     }
//   }
//   return true;
// }

// export default function Quotation() {
//   const sheetRef = useRef(null);
//   const [preview, setPreview] = useState(false);
//   const makingRef = useRef(false);

//   // Branding
//   const logoPrimary = (process.env.PUBLIC_URL || "") + "/assets/vrmlogo.png";
//   const logoFallback = (process.env.PUBLIC_URL || "") + "/assests/vrmlogo.png";
//   const [logoSrc, setLogoSrc] = useState(logoPrimary);

//   const brand = {
//     company: "VRM GROUPS",
//     phone: "+91 9900315454",
//     email: "info@vrmgroups.com",
//     site: "www.vrmgroups.com",
//     street: "Your Street",
//     city: "City, State, Country",
//     zip: "ZIP Code",
//   };

//   const [meta, setMeta] = useState({
//     invoiceNumber: "QTN-" + new Date().getTime().toString().slice(-6),
//     date: new Date().toISOString().slice(0, 10),
//     customerId: "",
//   });
//   const [billTo, setBillTo] = useState({
//     name: "",
//     street: "",
//     cityStateCountry: "",
//     phone: "",
//   });

//   // Products
//   const [rows, setRows] = useState([]);
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       const arr = raw ? JSON.parse(raw) : [];
//       const map = new Map();
//       arr.forEach(({ catId, key, label }) =>
//         map.set(`${catId}:${key}`, { id: `${catId}:${key}`, name: label, qty: 1, price: 0 })
//       );
//       setRows(Array.from(map.values()));
//     } catch {
//       setRows([]);
//     }
//   }, []);
//   const setQty = (i, v) =>
//     setRows((rs) => rs.map((r, k) => (k === i ? { ...r, qty: Math.max(0, Number(v || 0)) } : r)));
//   const setPrice = (i, v) =>
//     setRows((rs) => rs.map((r, k) => (k === i ? { ...r, price: Number(v || 0) } : r)));
//   const removeRow = (i) => setRows((rs) => rs.filter((_, k) => k !== i));
//   const lineTotal = (r) => Number(r.qty || 0) * Number(r.price || 0);
//   const productsTotal = useMemo(() => rows.reduce((s, r) => s + lineTotal(r), 0), [rows]);

//   // Labor
//   const [laborVisible, setLaborVisible] = useState(false);
//   const [laborRows, setLaborRows] = useState([]);
//   const addLaborRow = () => {
//     if (!laborVisible) setLaborVisible(true);
//     setLaborRows((ls) => [...ls, { id: Date.now() + "-" + (ls.length + 1), hours: 0, desc: "", rate: 0 }]);
//   };
//   const setLaborField = (i, field, val) =>
//     setLaborRows((ls) => ls.map((r, k) => (k === i ? { ...r, [field]: field === "desc" ? val : Number(val || 0) } : r)));
//   const removeLaborRow = (i) => setLaborRows((ls) => ls.filter((_, k) => k !== i));
//   const laborLineTotal = (r) => Number(r.hours || 0) * Number(r.rate || 0);
//   const laborTotal = useMemo(() => laborRows.reduce((s, r) => s + laborLineTotal(r), 0), [laborRows]);

//   // Totals
//   const [taxPct, setTaxPct] = useState(0);
//   const subTotal = useMemo(() => productsTotal + laborTotal, [productsTotal, laborTotal]);
//   const taxAmount = useMemo(() => (subTotal * Number(taxPct || 0)) / 100, [subTotal, taxPct]);
//   const grandTotal = useMemo(() => subTotal + taxAmount, [subTotal, taxAmount]);

//   // Notes
//   const [paymentDays, setPaymentDays] = useState("");
//   const [comments, setComments] = useState("");

//   // -------- PDF Export (no blank trailing page, proper text rendering) --------
//   const downloadPDF = async () => {
//     if (makingRef.current) return;
//     makingRef.current = true;

//     try {
//       const src = sheetRef.current;
//       if (!src) return;

//       const { wrapper, clone } = makeOffscreenClone(src);

//       try { await document.fonts?.ready; } catch {}
//       await ensureImagesLoaded(clone);
//       await rAF(); // layout
//       await rAF(); // paint

//       const canvas = await html2canvas(clone, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scrollX: 0,
//         scrollY: 0,
//         logging: false,
//       });

//       document.body.removeChild(wrapper);

//       const pdf = new jsPDF("p", "mm", "a4");
//       const pageW = pdf.internal.pageSize.getWidth();
//       const pageH = pdf.internal.pageSize.getHeight();

//       const pxPerMm = canvas.width / pageW;
//       const pageHeightPx = Math.floor(pageH * pxPerMm);

//       // If everything fits on one page (allow tiny rounding errors), do single addImage
//       if (canvas.height <= pageHeightPx + 2) {
//         const imgData = canvas.toDataURL("image/png");
//         const imgH = (canvas.height / canvas.width) * pageW;
//         pdf.addImage(imgData, "PNG", 0, 0, pageW, imgH, undefined, "FAST");
//         pdf.save(`${meta.invoiceNumber}.pdf`);
//         return;
//       }

//       // Otherwise, slice vertically. Skip tiny/blank trailing slices.
//       let y = 0;
//       let pageIndex = 0;
//       while (y < canvas.height) {
//         let remaining = canvas.height - y;
//         if (remaining <= 2) break; // drop sub-pixel remainder

//         const sliceHeight = Math.min(pageHeightPx, remaining);
//         const pageCanvas = document.createElement("canvas");
//         pageCanvas.width = canvas.width;
//         pageCanvas.height = sliceHeight;
//         const ctx = pageCanvas.getContext("2d");
//         ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

//         // If this is the very last slice and it's basically blank, skip it
//         const lastSlice = y + sliceHeight >= canvas.height - 1;
//         if (lastSlice && (sliceHeight < 8 || isSliceBlank(pageCanvas))) break;

//         const imgData = pageCanvas.toDataURL("image/png");
//         if (pageIndex > 0) pdf.addPage();
//         const hMm = (sliceHeight / canvas.width) * pageW;
//         pdf.addImage(imgData, "PNG", 0, 0, pageW, hMm, undefined, "FAST");

//         y += sliceHeight;
//         pageIndex += 1;
//       }

//       pdf.save(`${meta.invoiceNumber}.pdf`);
//     } finally {
//       makingRef.current = false;
//     }
//   };

//   // -------- Print (same on-screen layout; only hides controls) --------
//   const printPage = async () => {
//     const src = sheetRef.current;
//     if (!src) return;
//     src.classList.add("print-mode");
//     await rAF();
//     window.print();
//     setTimeout(() => src.classList.remove("print-mode"), 300);
//   };

//   return (
//     <section className="qtn-wrap">
//       <div className="qtn-toolbar no-print">
//         <button className="btn ghost" onClick={() => setPreview((p) => !p)}>
//           {preview ? "Exit Preview" : "Preview"}
//         </button>
//         <div className="spacer" />
//         <button className="btn ghost" onClick={downloadPDF}>Download PDF</button>
//         <button className="btn" onClick={printPage}>Print</button>
//       </div>

//       <div className={`sheet a4 ${preview ? "preview" : ""}`} ref={sheetRef}>
//         {/* HEADER */}
//         <header className="invoice-header">
//           <div className="header-left">
//             <div className="title-construction">Construction</div>
//             <div className="title-invoice">INVOICE</div>
//             <div className="company-name">{brand.company}</div>
//           </div>
//           <div className="header-center">
//             <img
//               src={logoSrc}
//               alt="Logo"
//               className="logo1"
//               crossOrigin="anonymous"
//               onError={() => setLogoSrc(logoFallback)}
//             />
//           </div>
//           <div className="header-right">
//             <div className="contact-line">{brand.phone}</div>
//             <div className="contact-line">{brand.email}</div>
//             <div className="contact-line">{brand.site}</div>
//             <div className="address-section">
//               <div className="address-line">{brand.street}</div>
//               <div className="address-line">{brand.city}</div>
//               <div className="address-line">{brand.zip}</div>
//             </div>
//           </div>
//         </header>

//         {/* BILL TO + TOTAL */}
//         <div className="billto-total-section">
//           <div className="billto-container">
//             <div className="billto-header">BILL TO</div>
//             <div className="billto-content">
//               <div className="billto-form">
//                 <div className="form-row">
//                   <label className="form-label">Invoice Number:</label>
//                   <input
//                     className="form-input"
//                     value={meta.invoiceNumber}
//                     onChange={(e) => setMeta({ ...meta, invoiceNumber: e.target.value })}
//                     readOnly={preview}
//                   />
//                   <label className="form-label">Name:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.name}
//                     onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <label className="form-label">Date:</label>
//                   <input
//                     className="form-input"
//                     type="date"
//                     value={meta.date}
//                     onChange={(e) => setMeta({ ...meta, date: e.target.value })}
//                     readOnly={preview}
//                   />
//                   <label className="form-label">Street:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.street}
//                     onChange={(e) => setBillTo({ ...billTo, street: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <label className="form-label">Customer ID:</label>
//                   <input
//                     className="form-input"
//                     value={meta.customerId}
//                     onChange={(e) => setMeta({ ...meta, customerId: e.target.value })}
//                     readOnly={preview}
//                   />
//                   <label className="form-label">City, State, Country:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.cityStateCountry}
//                     onChange={(e) => setBillTo({ ...billTo, cityStateCountry: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div></div><div></div>
//                   <label className="form-label">Phone:</label>
//                   <input
//                     className="form-input"
//                     value={billTo.phone}
//                     onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
//                     readOnly={preview}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="invoice-total-box">
//             <div className="total-label">INVOICE TOTAL</div>
//             <div className="total-amount">₹{fmt(grandTotal)}</div>
//           </div>
//         </div>

//         {/* PRODUCTS */}
//         <div className="section-header">PRODUCTS</div>
//         <div className="products-table">
//           <div className="table-header">
//             <div className="col-quantity">Quantity</div>
//             <div className="col-description">Description</div>
//             <div className="col-price">Unit Price</div>
//             <div className="col-amount">Amount</div>
//             {!preview && <div className="col-action"></div>}
//           </div>

//           {rows.map((r, i) => (
//             <div className="table-row" key={r.id}>
//               <div className="col-quantity">
//                 <input
//                   className="table-input center"
//                   type="number"
//                   min="0"
//                   step="1"
//                   value={r.qty}
//                   onChange={(e) => setQty(i, e.target.value)}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-description">{r.name}</div>
//               <div className="col-price">
//                 <input
//                   className="table-input right"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={r.price}
//                   onChange={(e) => setPrice(i, e.target.value)}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-amount">₹{fmt(lineTotal(r))}</div>
//               {!preview && (
//                 <div className="col-action">
//                   <button className="remove-btn" onClick={() => removeRow(i)}>Remove</button>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div className="table-total-row">
//             <div className="col-quantity"></div>
//             <div className="col-description total-label-cell">Total Products</div>
//             <div className="col-price"></div>
//             <div className="col-amount total-value">₹{fmt(productsTotal)}</div>
//             {!preview && <div className="col-action"></div>}
//           </div>
//         </div>

//         {/* LABOR */}
//         {laborVisible && (
//           <>
//             <div className="section-header">LABOR</div>
//             <div className="labor-table">
//               <div className="table-header">
//                 <div className="col-quantity">Hour</div>
//                 <div className="col-description">Description</div>
//                 <div className="col-price">₹ / Hour</div>
//                 <div className="col-amount">Amount</div>
//                 {!preview && <div className="col-action"></div>}
//               </div>

//               {laborRows.map((r, i) => (
//                 <div className="table-row" key={r.id}>
//                   <div className="col-quantity">
//                     <input
//                       className="table-input center"
//                       type="number"
//                       min="0"
//                       step="0.25"
//                       value={r.hours}
//                       onChange={(e) => setLaborField(i, "hours", e.target.value)}
//                       readOnly={preview}
//                     />
//                   </div>
//                   <div className="col-description">
//                     <input
//                       className="table-input"
//                       placeholder="Work description"
//                       value={r.desc}
//                       onChange={(e) => setLaborField(i, "desc", e.target.value)}
//                       readOnly={preview}
//                     />
//                   </div>
//                   <div className="col-price">
//                     <input
//                       className="table-input right"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={r.rate}
//                       onChange={(e) => setLaborField(i, "rate", e.target.value)}
//                       readOnly={preview}
//                     />
//                   </div>
//                   <div className="col-amount">₹{fmt(laborLineTotal(r))}</div>
//                   {!preview && (
//                     <div className="col-action">
//                       <button className="remove-btn" onClick={() => removeLaborRow(i)}>Remove</button>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {!preview && (
//                 <div className="table-add-row">
//                   <div className="col-quantity"></div>
//                   <div className="col-description">
//                     <button className="add-row-btn" onClick={addLaborRow}>+ Add Labor Row</button>
//                   </div>
//                   <div className="col-price"></div>
//                   <div className="col-amount"></div>
//                   <div className="col-action"></div>
//                 </div>
//               )}

//               <div className="table-total-row">
//                 <div className="col-quantity"></div>
//                 <div className="col-description total-label-cell">Total Labor</div>
//                 <div className="col-price"></div>
//                 <div className="col-amount total-value">₹{fmt(laborTotal)}</div>
//                 {!preview && <div className="col-action"></div>}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Summary */}
//         <div className="summary-section">
//           <div className="summary-totals">
//             <div className="summary-row">
//               <div className="summary-label">Total Labor</div>
//               <div className="summary-value">₹{fmt(laborTotal)}</div>
//             </div>
//             <div className="summary-row">
//               <div className="summary-label">Subtotal</div>
//               <div className="summary-value">₹{fmt(subTotal)}</div>
//             </div>
//             <div className="summary-row">
//               <div className="summary-label">
//                 Sales Tax{" "}
//                 <input
//                   className="tax-input"
//                   type="number"
//                   min="0"
//                   step="0.1"
//                   value={taxPct}
//                   onChange={(e) => setTaxPct(e.target.value)}
//                   readOnly={preview}
//                 />
//                 %
//               </div>
//               <div className="summary-value">₹{fmt(taxAmount)}</div>
//             </div>
//             <div className="summary-row total-row">
//               <div className="summary-label">TOTAL</div>
//               <div className="summary-value">₹{fmt(grandTotal)}</div>
//             </div>
//           </div>
//         </div>

//         {/* Notes */}
//         <div className="footer-section">
//           <div className="payment-terms">
//             Payment is due within{" "}
//             <input
//               className="inline-input"
//               type="number"
//               min="0"
//               value={paymentDays}
//               onChange={(e) => setPaymentDays(e.target.value)}
//               placeholder="#"
//               readOnly={preview}
//             />{" "}
//             of days.
//           </div>
//           <div className="comments-section">
//             Comments or Special Instructions:{" "}
//             <input
//               className="comments-input"
//               placeholder="Write any note for the client"
//               value={comments}
//               onChange={(e) => setComments(e.target.value)}
//               readOnly={preview}
//             />
//           </div>
//         </div>

//         {!preview && (
//           <div className="add-labor-section no-print">
//             <button className="btn add-labor-btn" onClick={addLaborRow}>Add Labour</button>
//           </div>
//         )}

//         <div className="document-footer">Brought to you by VRM GROUPS</div>
//       </div>
//     </section>
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

// function makeOffscreenClone(sourceEl) {
//   const wrapper = document.createElement("div");
//   Object.assign(wrapper.style, {
//     position: "fixed",
//     left: "-10000px",
//     top: "0",
//     width: `${sourceEl.offsetWidth}px`,
//     background: "#fff",
//     zIndex: "-1",
//   });
//   const clone = sourceEl.cloneNode(true);
//   clone.classList.add("print-mode");
//   wrapper.appendChild(clone);
//   document.body.appendChild(wrapper);
//   return { wrapper, clone };
// }

// // Convert number to words (Indian format)
// function numberToWords(num) {
//   if (num === 0) return "Zero";

//   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

//   function convertHundreds(n) {
//     let result = "";
//     if (n >= 100) {
//       result += ones[Math.floor(n / 100)] + " Hundred ";
//       n %= 100;
//     }
//     if (n >= 20) {
//       result += tens[Math.floor(n / 10)] + " ";
//       n %= 10;
//     }
//     if (n > 0) {
//       result += ones[n] + " ";
//     }
//     return result;
//   }

//   const crore = Math.floor(num / 10000000);
//   num %= 10000000;
//   const lakh = Math.floor(num / 100000);
//   num %= 100000;
//   const thousand = Math.floor(num / 1000);
//   num %= 1000;
//   const hundred = num;

//   let result = "";
//   if (crore > 0) result += convertHundreds(crore) + "Crore ";
//   if (lakh > 0) result += convertHundreds(lakh) + "Lakh ";
//   if (thousand > 0) result += convertHundreds(thousand) + "Thousand ";
//   if (hundred > 0) result += convertHundreds(hundred);

//   return result.trim() + " Only";
// }

// export default function TaxQuotation() {
//   const sheetRef = useRef(null);
//   const [preview, setPreview] = useState(false);
//   const makingRef = useRef(false);

//   // Company details
//   const [company, setCompany] = useState({
//     name: "VRM GROUPS",
//     address: "Your Street, City, State, Country",
//     phone: "+91 9900315454",
//     email: "info@vrmgroups.com",
//     gstin: "GSTIN123456789",
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

//   // Products/Materials - Load from localStorage
//   const [materials, setMaterials] = useState([]);

//   // Load materials from previous quotation system
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       if (raw) {
//         const quotationItems = JSON.parse(raw);
//         const loadedMaterials = quotationItems.map((item, index) => ({
//           id: index + 1,
//           description: item.label || item.name || "",
//           hsn: "",
//           qty: 1,
//           unit: "Nos",
//           pricePerUnit: 0,
//           discount: 0,
//           gst: 18
//         }));

//         if (loadedMaterials.length > 0) {
//           setMaterials(loadedMaterials);
//         } else {
//           setMaterials([{
//             id: 1, description: "", hsn: "", qty: 0, unit: "Nos", 
//             pricePerUnit: 0, discount: 0, gst: 18
//           }]);
//         }
//       } else {
//         setMaterials([{
//           id: 1, description: "", hsn: "", qty: 0, unit: "Nos", 
//           pricePerUnit: 0, discount: 0, gst: 18
//         }]);
//       }
//     } catch (error) {
//       console.error("Error loading quotation items:", error);
//       setMaterials([{
//         id: 1, description: "", hsn: "", qty: 0, unit: "Nos", 
//         pricePerUnit: 0, discount: 0, gst: 18
//       }]);
//     }
//   }, []);

//   // Tax rates
//   const taxRates = {
//     sgst: 9,
//     cgst: 9
//   };

//   const [discountPercent, setDiscountPercent] = useState(0);

//   // Add new material row
//   const addMaterial = () => {
//     const newMaterial = {
//       id: Date.now(),
//       description: "",
//       hsn: "",
//       qty: 0,
//       unit: "Nos",
//       pricePerUnit: 0,
//       discount: 0,
//       gst: 18
//     };
//     setMaterials([...materials, newMaterial]);
//   };

//   // Remove material row
//   const removeMaterial = (id) => {
//     if (materials.length > 1) {
//       setMaterials(materials.filter(m => m.id !== id));
//     }
//   };

//   // Update material field
//   const updateMaterial = (id, field, value) => {
//     setMaterials(materials.map(m => 
//       m.id === id ? { ...m, [field]: field === 'description' || field === 'hsn' || field === 'unit' ? value : Number(value || 0) } : m
//     ));
//   };

//   // Calculate totals
//   const calculations = useMemo(() => {
//     let subtotal = 0;

//     materials.forEach(material => {
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

//     return {
//       subtotal: finalSubtotal,
//       discount: overallDiscount,
//       sgst,
//       cgst,
//       grandTotal
//     };
//   }, [materials, discountPercent, taxRates.sgst, taxRates.cgst]);

//   // Enhanced PDF Export with superior text rendering
//   const downloadPDF = async () => {
//     if (makingRef.current) return;
//     makingRef.current = true;

//     try {
//       const src = sheetRef.current;
//       if (!src) return;

//       // Create a temporary style element for better PDF rendering
//       const tempStyle = document.createElement("style");
//       tempStyle.textContent = `
//         .pdf-mode * {
//           font-family: 'Arial', 'Helvetica', sans-serif !important;
//           font-smoothing: antialiased !important;
//           -webkit-font-smoothing: antialiased !important;
//           -moz-osx-font-smoothing: grayscale !important;
//           text-rendering: optimizeLegibility !important;
//         }
//         .pdf-mode input, .pdf-mode select {
//           font-weight: normal !important;
//           color: #000 !important;
//           background: transparent !important;
//           border: none !important;
//         }
//       `;
//       document.head.appendChild(tempStyle);

//       const { wrapper, clone } = makeOffscreenClone(src);
//       clone.classList.add("pdf-mode");

//       // Force reflow and font loading
//       const cloneHeight = clone.offsetHeight;
//       console.log("Clone prepared, height:", cloneHeight);

//       // Wait for fonts to load properly
//       try { 
//         await document.fonts?.ready;
//         await new Promise(resolve => setTimeout(resolve, 200));
//       } catch (error) {
//         console.log("Font loading error:", error);
//       }

//       await ensureImagesLoaded(clone);
//       await rAF();
//       await rAF();

//       // High-quality canvas rendering
//       const canvas = await html2canvas(clone, {
//         scale: 4, // Very high scale for crisp text
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scrollX: 0,
//         scrollY: 0,
//         logging: false,
//         allowTaint: false,
//         foreignObjectRendering: true,
//         removeContainer: true,
//         imageTimeout: 2000,
//         onclone: (clonedDoc) => {
//           // Force all text elements to use proper fonts and rendering
//           const allElements = clonedDoc.querySelectorAll('*');
//           allElements.forEach(el => {
//             el.style.fontFamily = 'Arial, Helvetica, sans-serif';
//             el.style.fontSmoothing = 'antialiased';
//             el.style.webkitFontSmoothing = 'antialiased';
//             el.style.mozOsxFontSmoothing = 'grayscale';
//             el.style.textRendering = 'optimizeLegibility';

//             if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
//               el.style.color = '#000000';
//               el.style.background = 'transparent';
//               el.style.border = 'none';
//               el.style.outline = 'none';
//               el.style.fontWeight = 'normal';
//             }
//           });
//         }
//       });

//       // Cleanup
//       document.body.removeChild(wrapper);
//       document.head.removeChild(tempStyle);

//       // Generate PDF with optimal settings
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//         compress: true
//       });

//       const pageW = pdf.internal.pageSize.getWidth();
//       const pageH = pdf.internal.pageSize.getHeight();

//       const margin = 8;
//       const availableW = pageW - (2 * margin);
//       const availableH = pageH - (2 * margin);

//       const imgW = canvas.width;
//       const imgH = canvas.height;

//       const scaleX = availableW / (imgW * 0.264583);
//       const scaleY = availableH / (imgH * 0.264583);
//       const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

//       const finalW = (imgW * 0.264583) * scale;
//       const finalH = (imgH * 0.264583) * scale;

//       const x = margin + (availableW - finalW) / 2;
//       const y = margin;

//       // Use PNG for better text quality
//       const imgData = canvas.toDataURL("image/png", 1.0);
//       pdf.addImage(imgData, "PNG", x, y, finalW, finalH, undefined, "SLOW");

//       pdf.save(`${invoice.number}.pdf`);
//     } catch (error) {
//       console.error("PDF generation error:", error);
//       alert("Error generating PDF. Please try again.");
//     } finally {
//       makingRef.current = false;
//     }
//   };

//   // Print function
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
//                 onChange={(e) => setCompany({...company, name: e.target.value})}
//                 readOnly={preview}
//                 placeholder="Company Name"
//               />
//             </div>
//           </div>

//           <div className="header-center-logo">
//             <div className="logo-container">
//               <div className="logo-icon">
//                 <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <rect x="8" y="32" width="48" height="24" fill="none" stroke="currentColor" strokeWidth="2"/>
//                   <rect x="16" y="24" width="32" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
//                   <rect x="24" y="16" width="16" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
//                   <path d="M12 56h40M20 40h4M28 40h8M40 40h4" stroke="currentColor" strokeWidth="2"/>
//                   <circle cx="32" cy="48" r="2" fill="currentColor"/>
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="header-right-info">
//             <div className="contact-info">
//               <input 
//                 type="text" 
//                 value={company.phone}
//                 onChange={(e) => setCompany({...company, phone: e.target.value})}
//                 readOnly={preview}
//                 placeholder="+1(321)456-7890"
//               />
//             </div>
//             <div className="contact-info">
//               <input 
//                 type="text" 
//                 value={company.email}
//                 onChange={(e) => setCompany({...company, email: e.target.value})}
//                 readOnly={preview}
//                 placeholder="your@email.com"
//               />
//             </div>
//             <div className="contact-info">
//               <input 
//                 type="text" 
//                 value="www.vrmgroups.com"
//                 onChange={() => {}} 
//                 readOnly={preview}
//                 placeholder="yourwebsite.com"
//               />
//             </div>
//             <div className="address-info-right">
//               <div className="street-address">
//                 <input 
//                   type="text" 
//                   value="Your Street"
//                   onChange={() => {}}
//                   readOnly={preview}
//                   placeholder="Your Street"
//                 />
//               </div>
//               <div className="city-state">
//                 <input 
//                   type="text" 
//                   value="City, State, Country"
//                   onChange={() => {}}
//                   readOnly={preview}
//                   placeholder="City, State, Country"
//                 />
//               </div>
//               <div className="zip-code">
//                 <input 
//                   type="text" 
//                   value="ZIP Code"
//                   onChange={() => {}}
//                   readOnly={preview}
//                   placeholder="ZIP Code"
//                 />
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
//                   onChange={(e) => setBillTo({...billTo, name: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Address:</label>
//                 <input 
//                   type="text" 
//                   value={billTo.address}
//                   onChange={(e) => setBillTo({...billTo, address: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Contact No.:</label>
//                 <input 
//                   type="text" 
//                   value={billTo.contactNo}
//                   onChange={(e) => setBillTo({...billTo, contactNo: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>GSTIN No.:</label>
//                 <input 
//                   type="text" 
//                   value={billTo.gstin}
//                   onChange={(e) => setBillTo({...billTo, gstin: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>State:</label>
//                 <input 
//                   type="text" 
//                   value={billTo.state}
//                   onChange={(e) => setBillTo({...billTo, state: e.target.value})}
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
//                   onChange={(e) => setSiteLocation({...siteLocation, name: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Address:</label>
//                 <input 
//                   type="text" 
//                   value={siteLocation.address}
//                   onChange={(e) => setSiteLocation({...siteLocation, address: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Contact No.:</label>
//                 <input 
//                   type="text" 
//                   value={siteLocation.contactNo}
//                   onChange={(e) => setSiteLocation({...siteLocation, contactNo: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Invoice No.:</label>
//                 <input 
//                   type="text" 
//                   value={invoice.number}
//                   onChange={(e) => setInvoice({...invoice, number: e.target.value})}
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="field">
//                 <label>Date:</label>
//                 <input 
//                   type="date" 
//                   value={invoice.date}
//                   onChange={(e) => setInvoice({...invoice, date: e.target.value})}
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
//                   onChange={(e) => updateMaterial(material.id, 'description', e.target.value)}
//                   placeholder="Enter description"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-hsn">
//                 <input 
//                   type="text" 
//                   value={material.hsn}
//                   onChange={(e) => updateMaterial(material.id, 'hsn', e.target.value)}
//                   placeholder="HSN"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-qty">
//                 <input 
//                   type="number" 
//                   value={material.qty}
//                   onChange={(e) => updateMaterial(material.id, 'qty', e.target.value)}
//                   min="0"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-unit">
//                 <select 
//                   value={material.unit}
//                   onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
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
//                   onChange={(e) => updateMaterial(material.id, 'pricePerUnit', e.target.value)}
//                   min="0"
//                   step="0.01"
//                   readOnly={preview}
//                 />
//               </div>
//               <div className="col-disc">
//                 <input 
//                   type="number" 
//                   value={material.discount}
//                   onChange={(e) => updateMaterial(material.id, 'discount', e.target.value)}
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
//                   onChange={(e) => updateMaterial(material.id, 'gst', e.target.value)}
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
//             <div className="col-num"></div>
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
//             <button onClick={addMaterial} className="btn add-material">
//               + Add Material
//             </button>
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
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     className="discount-input"
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

async function ensureImagesLoaded(rootEl) {
  const imgs = Array.from(rootEl.querySelectorAll("img"));
  if (!imgs.length) return;
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) return resolve();
          try { img.crossOrigin = "anonymous"; } catch { }
          img.onload = img.onerror = () => resolve();
        })
    )
  );
}

/** Keep clone inside viewport but invisible: avoids blank renders */
function makeOffscreenClone(sourceEl) {
  const rect = sourceEl.getBoundingClientRect();
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: Math.ceil(rect.width) + "px",
    visibility: "hidden",
    pointerEvents: "none",
    background: "#fff",
    zIndex: "-1",
  });

  const clone = sourceEl.cloneNode(true);
  clone.classList.add("print-mode"); // hide buttons only; layout stays the same
  clone.style.maxWidth = "none";
  clone.style.width = "100%";

  document.body.appendChild(wrapper);
  wrapper.appendChild(clone);
  return { wrapper, clone };
}

/** Light check to see if a canvas is basically blank (white/transparent) */
function isCanvasBlank(canvas, threshold = 250) {
  if (!canvas || !canvas.width || !canvas.height) return true;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const sx = 10, sy = 10;
  for (let y = 0; y < sy; y++) {
    const row = Math.floor((y / (sy - 1 || 1)) * (height - 1));
    for (let x = 0; x < sx; x++) {
      const col = Math.floor((x / (sx - 1 || 1)) * (width - 1));
      const [r, g, b, a] = ctx.getImageData(col, row, 1, 1).data;
      if (a !== 0 && (r < threshold || g < threshold || b < threshold)) return false;
    }
  }
  return true;
}

// Convert number to words (Indian format)
function numberToWords(num) {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function convertHundreds(n) {
    let result = "";
    if (n >= 100) { result += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
    if (n >= 20) { result += tens[Math.floor(n / 10)] + " "; n %= 10; }
    if (n > 0) { result += ones[n] + " "; }
    return result;
  }
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000); num %= 100000;
  const thousand = Math.floor(num / 1000); num %= 1000;
  const hundred = num;
  let result = "";
  if (crore) result += convertHundreds(crore) + "Crore ";
  if (lakh) result += convertHundreds(lakh) + "Lakh ";
  if (thousand) result += convertHundreds(thousand) + "Thousand ";
  if (hundred) result += convertHundreds(hundred);
  return result.trim() + " Only";
}

export default function TaxQuotation() {
  const sheetRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const makingRef = useRef(false);

  // Company details
  const [company, setCompany] = useState({
    name: "VRM GROUPS",
    address: "15th Cross, A Block No.27 . Ground Floor, Bhuvaneshwari Nagar, Magadi Main Road, Banagalore - 560091",
    phone: "+91 9900315454",
    email: "info@vrmgroups.com",
    gstin: "29ATHPV3440K1Z5",
    state: "Karnataka"
  });

  // Invoice details
  const [invoice, setInvoice] = useState({
    number: "QTN-" + new Date().getTime().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
  });

  // Bill to details
  const [billTo, setBillTo] = useState({
    name: "",
    address: "",
    contactNo: "",
    gstin: "",
    state: ""
  });

  // Site/Location details
  const [siteLocation, setSiteLocation] = useState({
    name: "",
    address: "",
    contactNo: ""
  });

  // Materials
  const [materials, setMaterials] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("quotationItems");
      if (raw) {
        const quotationItems = JSON.parse(raw);
        const loaded = quotationItems.map((item, idx) => ({
          id: idx + 1,
          description: item.label || item.name || "",
          hsn: "",
          qty: 1,
          unit: "Nos",
          pricePerUnit: 0,
          discount: 0,
          gst: 18
        }));
        setMaterials(loaded.length ? loaded : [{
          id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
        }]);
      } else {
        setMaterials([{
          id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
        }]);
      }
    } catch {
      setMaterials([{
        id: 1, description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
      }]);
    }
  }, []);

  // Tax rates
  const taxRates = { sgst: 9, cgst: 9 };
  const [discountPercent, setDiscountPercent] = useState(0);

  const addMaterial = () => {
    setMaterials((m) => [...m, {
      id: Date.now(), description: "", hsn: "", qty: 0, unit: "Nos", pricePerUnit: 0, discount: 0, gst: 18
    }]);
  };
  const removeMaterial = (id) => {
    setMaterials((m) => (m.length > 1 ? m.filter((x) => x.id !== id) : m));
  };
  const updateMaterial = (id, field, value) => {
    setMaterials((m) =>
      m.map((row) =>
        row.id === id
          ? { ...row, [field]: ["description", "hsn", "unit"].includes(field) ? value : Number(value || 0) }
          : row
      )
    );
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    materials.forEach((material) => {
      const amount = material.qty * material.pricePerUnit;
      const discountAmount = (amount * material.discount) / 100;
      const taxableAmount = amount - discountAmount;
      subtotal += taxableAmount;
    });
    const overallDiscount = (subtotal * discountPercent) / 100;
    const finalSubtotal = subtotal - overallDiscount;
    const sgst = (finalSubtotal * taxRates.sgst) / 100;
    const cgst = (finalSubtotal * taxRates.cgst) / 100;
    const grandTotal = finalSubtotal + sgst + cgst;
    return { subtotal: finalSubtotal, discount: overallDiscount, sgst, cgst, grandTotal };
  }, [materials, discountPercent, taxRates.sgst, taxRates.cgst]);

  // Logo (assets/vrmlogo.png with fallback to assests/vrmlogo.png)
  const LOGO_PRIMARY = (process.env.PUBLIC_URL || "") + "/assets/vrmlogo.png";
  const LOGO_FALLBACK = (process.env.PUBLIC_URL || "") + "/assests/vrmlogo.png";
  const [logoSrc, setLogoSrc] = useState(LOGO_PRIMARY);

  // -------- PDF Export (blank-page-proof) --------
  const downloadPDF = async () => {
    if (makingRef.current) return;
    makingRef.current = true;

    try {
      const src = sheetRef.current;
      if (!src) return;

      // Temporary style to normalize input look in PDF
      const tempStyle = document.createElement("style");
      tempStyle.textContent = `
        .pdf-mode * {
          font-family: Arial, Helvetica, sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
        }
        .pdf-mode input, .pdf-mode select {
          color: #000 !important;
          background: transparent !important;
          border: none !important;
          outline: none !important;
          font-weight: normal !important;
        }
      `;
      document.head.appendChild(tempStyle);

      const { wrapper, clone } = makeOffscreenClone(src);
      clone.classList.add("pdf-mode");
      try { await document.fonts?.ready; } catch { }
      await ensureImagesLoaded(clone);
      await rAF(); await rAF();

      // Primary capture from clone (reliable settings)
      let canvas = await html2canvas(clone, {
        scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
        useCORS: true,
        backgroundColor: "#ffffff",
        foreignObjectRendering: false,   // important!
        allowTaint: true,
        imageTimeout: 0,
        logging: false,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Fallback: capture live node if the first canvas is blank
      if (isCanvasBlank(canvas)) {
        canvas = await html2canvas(src, {
          scale: Math.max(2, (window.devicePixelRatio || 1) * 2),
          useCORS: true,
          backgroundColor: "#ffffff",
          foreignObjectRendering: false,
          allowTaint: true,
          imageTimeout: 0,
          logging: false,
          width: src.scrollWidth || src.offsetWidth,
          height: src.scrollHeight || src.offsetHeight,
          scrollX: 0,
          scrollY: 0,
        });
      }

      // Cleanup clone & style
      document.body.removeChild(wrapper);
      document.head.removeChild(tempStyle);

      // Build PDF (single page fit; same structure as screen)
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const margin = 8;
      const availableW = pageW - 2 * margin;
      const availableH = pageH - 2 * margin;

      const imgWpx = canvas.width;
      const imgHpx = canvas.height;

      // px -> mm (96 CSS px per inch, 25.4 mm per inch)
      const pxToMm = 25.4 / 96;
      const imgWmm = imgWpx * pxToMm;
      const imgHmm = imgHpx * pxToMm;

      const scale = Math.min(availableW / imgWmm, availableH / imgHmm, 1);
      const finalW = imgWmm * scale;
      const finalH = imgHmm * scale;

      const x = margin + (availableW - finalW) / 2;
      const y = margin;

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", x, y, finalW, finalH, undefined, "FAST");
      pdf.save(`${invoice.number}.pdf`);
    } catch (e) {
      console.error("PDF generation error:", e);
      alert("Error generating PDF. Please try again.");
    } finally {
      makingRef.current = false;
    }
  };

  // Print
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
        <button className="btn ghost" onClick={downloadPDF}>Download PDF</button>
        <button className="btn primary" onClick={printInvoice}>Print</button>
      </div>

      <div className={`invoice-sheet ${preview ? "preview" : ""}`} ref={sheetRef}>
        {/* Modern Header with Logo */}
        <div className="modern-header">
          <div className="header-left-info">
            <div className="construction-title">Construction</div>
            <div className="invoice-title-text">INVOICE</div>
            <div className="company-name-text">
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                readOnly={preview}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="header-center-logo">
            <div className="logo-container">
              <img
                src={logoSrc}
                alt="VRM Logo"
                className="logo-image"
                crossOrigin="anonymous"
                onError={() => { if (logoSrc !== LOGO_FALLBACK) setLogoSrc(LOGO_FALLBACK); }}
                style={{ maxWidth: 128, maxHeight: 121, objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="header-right-info">
            <div className="contact-info">
              <input
                type="text"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                readOnly={preview}
                placeholder="+1(321)456-7890"
              />
            </div>
            <div className="contact-info">
              <input
                type="text"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                readOnly={preview}
                placeholder="your@email.com"
              />
            </div>
            <div className="contact-info">
              <input type="text" value="www.vrmgroups.com" onChange={() => { }} readOnly={preview} />
            </div>
            <div className="address-info-right">
              <div className="street-address">
                <input type="text" value="15th Cross, A Block No.27" readOnly={preview} onChange={() => { }} />
              </div>
              <div className="city-state">
                <input type="text" value="Ground Floor, Bhuvaneshwari Nagar" readOnly={preview} onChange={() => { }} />
              </div>
              <div className="zip-code">
                <input type="text" value="Magadi Main Road, Banagalore - 560091" readOnly={preview} onChange={() => { }} />
              </div>
              <div className="zip-code">
                <input type="text" value="GSTIN: 29ATHPV3440K1Z5" readOnly={preview} onChange={() => { }} />
              </div>
            </div>

          </div>
        </div>

        {/* Tax Invoice Title */}
        <div className="invoice-title">Tax Invoice</div>

        {/* Bill To and Site Location */}
        <div className="bill-site-section">
          <div className="bill-to">
            <div className="section-title">Bill To:</div>
            <div className="field-group">
              <div className="field">
                <label>Name:</label>
                <input
                  type="text"
                  value={billTo.name}
                  onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>Address:</label>
                <input
                  type="text"
                  value={billTo.address}
                  onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>Contact No.:</label>
                <input
                  type="text"
                  value={billTo.contactNo}
                  onChange={(e) => setBillTo({ ...billTo, contactNo: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>GSTIN No.:</label>
                <input
                  type="text"
                  value={billTo.gstin}
                  onChange={(e) => setBillTo({ ...billTo, gstin: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>State:</label>
                <input
                  type="text"
                  value={billTo.state}
                  onChange={(e) => setBillTo({ ...billTo, state: e.target.value })}
                  readOnly={preview}
                />
              </div>
            </div>
          </div>

          <div className="site-location">
            <div className="section-title">Site /Location:</div>
            <div className="field-group">
              <div className="field">
                <label>Name:</label>
                <input
                  type="text"
                  value={siteLocation.name}
                  onChange={(e) => setSiteLocation({ ...siteLocation, name: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>Address:</label>
                <input
                  type="text"
                  value={siteLocation.address}
                  onChange={(e) => setSiteLocation({ ...siteLocation, address: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>Contact No.:</label>
                <input
                  type="text"
                  value={siteLocation.contactNo}
                  onChange={(e) => setSiteLocation({ ...siteLocation, contactNo: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>Invoice No.:</label>
                <input
                  type="text"
                  value={invoice.number}
                  onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
                  readOnly={preview}
                />
              </div>
              <div className="field">
                <label>Date:</label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  readOnly={preview}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
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

          {materials.map((material, index) => (
            <div key={material.id} className="table-row">
              <div className="col-num">{index + 1}</div>
              <div className="col-desc">
                <input
                  type="text"
                  value={material.description}
                  onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
                  placeholder="Enter description"
                  readOnly={preview}
                />
              </div>
              <div className="col-hsn">
                <input
                  type="text"
                  value={material.hsn}
                  onChange={(e) => updateMaterial(material.id, "hsn", e.target.value)}
                  placeholder="HSN"
                  readOnly={preview}
                />
              </div>
              <div className="col-qty">
                <input
                  type="number"
                  value={material.qty}
                  onChange={(e) => updateMaterial(material.id, "qty", e.target.value)}
                  min="0"
                  readOnly={preview}
                />
              </div>
              <div className="col-unit">
                <select
                  value={material.unit}
                  onChange={(e) => updateMaterial(material.id, "unit", e.target.value)}
                  disabled={preview}
                >
                  <option value="Nos">Nos</option>
                  <option value="Kg">Kg</option>
                  <option value="Ltr">Ltr</option>
                  <option value="Mtr">Mtr</option>
                  <option value="Sq.Ft">Sq.Ft</option>
                  <option value="Box">Box</option>
                </select>
              </div>
              <div className="col-price">
                <input
                  type="number"
                  value={material.pricePerUnit}
                  onChange={(e) => updateMaterial(material.id, "pricePerUnit", e.target.value)}
                  min="0"
                  step="0.01"
                  readOnly={preview}
                />
              </div>
              <div className="col-disc">
                <input
                  type="number"
                  value={material.discount}
                  onChange={(e) => updateMaterial(material.id, "discount", e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                  readOnly={preview}
                />%
              </div>
              <div className="col-gst">
                <input
                  type="number"
                  value={material.gst}
                  onChange={(e) => updateMaterial(material.id, "gst", e.target.value)}
                  min="0"
                  step="0.01"
                  readOnly={preview}
                />%
              </div>
              <div className="col-amount">
                ₹{fmt(material.qty * material.pricePerUnit * (1 - material.discount / 100))}
              </div>
              {!preview && (
                <div className="col-action">
                  <button onClick={() => removeMaterial(material.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="table-total-row">
            <div className="col-qty"></div>
            <div className="col-desc total-label">Total</div>
            <div className="col-hsn"></div>
            <div className="col-qty"></div>
            <div className="col-unit"></div>
            <div className="col-price"></div>
            <div className="col-disc"></div>
            <div className="col-gst"></div>
            <div className="col-amount">₹{fmt(calculations.subtotal + calculations.discount)}</div>
            {!preview && <div className="col-action"></div>}
          </div>
        </div>

        {!preview && (
          <div className="add-material-section no-print">
            <button onClick={addMaterial} className="btn add-material">+ Add Material</button>
          </div>
        )}

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="amount-words">
            <div className="label">Amount in words:</div>
            <div className="words-value">
              {numberToWords(Math.floor(calculations.grandTotal))}
            </div>
            <div className="signature-area">
              <div className="signature-label">Company seal and Sign</div>
            </div>
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
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value || 0))}
                    min="0" max="100" step="0.1" className="discount-input"
                  />
                )}
              </span>
              <span className="value">₹{fmt(calculations.discount)}</span>
            </div>
            <div className="total-row">
              <span className="label">SGST ({taxRates.sgst}%):</span>
              <span className="value">₹{fmt(calculations.sgst)}</span>
            </div>
            <div className="total-row">
              <span className="label">CGST ({taxRates.cgst}%):</span>
              <span className="value">₹{fmt(calculations.cgst)}</span>
            </div>
            <div className="total-row grand-total">
              <span className="label">Total:</span>
              <span className="value">₹{fmt(calculations.grandTotal)}</span>
            </div>
            <div className="total-row">
              <span className="label">Balance:</span>
              <span className="value">₹{fmt(calculations.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
