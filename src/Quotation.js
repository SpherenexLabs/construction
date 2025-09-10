
// Quotation.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Quotation.css";

const fmt = (n) =>
  (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Quotation() {
  const printRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const generatingRef = useRef(false);

  // --- Letterhead (HTML) ---
  // NOTE: images live under /public/assests (spelling as in project)
  const logoSrc = `${process.env.PUBLIC_URL}/assests/vrm.png`;
  const watermarkSrc = `${process.env.PUBLIC_URL}/assests/vrmlogo.png`;
  const head = {
    company: "VRM GROUPS",
    tagline: "Building Construction",
    addr1: "No 68 Hemadri, 1st Main Attached Bel,",
    addr2: "Balaji Layout, Marappana Palya, Bengaluru North 562123",
    site: "www.vrmgroups.com",
    email: "info@vrmgroups.com",
    phone: "+91 9900315454",
  };

  // --- Meta (Ref / Date) ---
  const [meta, setMeta] = useState({
    refNo: "QTN-" + new Date().getTime().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0,5), // HH:MM
    title: "QUOTATION",
  });

  // --- Client fields ---
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // --- Items from SubCategories selection ---
  const [rows, setRows] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("quotationItems");
      const arr = raw ? JSON.parse(raw) : [];
      const map = new Map();
      arr.forEach(({ catId, key, label }) =>
        map.set(`${catId}:${key}`, {
          id: `${catId}:${key}`,
          name: label,
          qty: 1,
          price: 0,
        })
      );
      setRows(Array.from(map.values()));
    } catch {}
  }, []);

  const lineTotal = (r) => Number(r.qty || 0) * Number(r.price || 0);
  const subTotal = useMemo(() => rows.reduce((s, r) => s + lineTotal(r), 0), [rows]);

  const setQty = (i, v) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, qty: Math.max(0, Number(v || 0)) } : r)));
  const setPrice = (i, v) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, price: Number(v || 0) } : r)));
  const removeRow = (i) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  // --- PDF & Print ---
  const downloadPDF = async (e) => {
    // Prevent accidental double clicks and default form behavior
    e?.preventDefault?.();
    if (generatingRef.current) return;
    generatingRef.current = true;
    try {
      const node = printRef.current;
      if (!node) return;

      // Force preview styling during capture so PDF matches the letterhead layout
      const prev = preview;
      if (!prev) setPreview(true);
      await new Promise((r) => setTimeout(r, 60));

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: node.scrollWidth,
        scrollY: -window.scrollY,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Properly paginate by shifting the image upward per page; avoid an extra blank page due to rounding
  const epsilon = 0.5; // mm margin to prevent creating an almost-empty page
  const pageCount = Math.max(1, Math.ceil((imgHeight - epsilon) / pageHeight));
  for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
        const yOffset = -i * pageHeight; // shift image up to show next slice
        pdf.addImage(img, "PNG", 0, yOffset, imgWidth, imgHeight);
      }

      pdf.save(`${meta.refNo}.pdf`);
  // Restore preview state
  if (!prev) setPreview(false);
    } finally {
      generatingRef.current = false;
    }
  };

  const printPage = async () => {
    const prev = preview;
    setPreview(true);
    await new Promise((r) => setTimeout(r, 40));
    window.print();
    setPreview(prev);
  };

  return (
    <section className="qtn-wrap">
      <div className="qtn-toolbar no-print">
        <button className="btn ghost" onClick={() => setPreview((p) => !p)}>
          {preview ? "Exit Preview" : "Preview"}
        </button>
        <div className="spacer" />
  <button type="button" className="btn ghost" onClick={downloadPDF}>
          Download PDF
        </button>
        <button className="btn" onClick={printPage}>
          Print
        </button>
      </div>

      <div className={`qtn-sheet ${preview ? "preview" : ""}`} ref={printRef}>
  {/* Top decorations removed as requested */}
        <img className="watermark" src={watermarkSrc} alt="" aria-hidden="true" />
        <header className="qtn-header">
          <div className="brand">
            <img src={logoSrc} alt="VRM Logo" className="brand-logo" />
            <div className="brand-meta">
              <h1>
                <span className="vrm">VRM</span> <span className="groups">GROUPS</span>
              </h1>
              <div className="slogan">{head.tagline}</div>
            </div>
          </div>
        </header>

  {/* Removed header-accent; gold bar is at top now */}

        {/* Ref / Date & Time bar */}
        <div className="refbar">
          {!preview ? (
            <>
              <label className="refcell">
                <span>Ref No.</span>
                <input
                  className="inp"
                  value={meta.refNo}
                  onChange={(e) => setMeta({ ...meta, refNo: e.target.value })}
                />
              </label>
              <div className="refgrid">
                <label className="refcell">
                  <span>Date</span>
                  <input
                    className="inp"
                    type="date"
                    value={meta.date}
                    onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                  />
                </label>
                <label className="refcell">
                  <span>Time</span>
                  <input
                    className="inp"
                    type="time"
                    value={meta.time}
                    onChange={(e) => setMeta({ ...meta, time: e.target.value })}
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="refcell"><strong>Ref No.</strong> {meta.refNo}</div>
              <div className="refcell right"><strong>Date:</strong> {meta.date} &nbsp; <strong>Time:</strong> {meta.time}</div>
            </>
          )}
        </div>

  {/* Body wrapper ensures footer stays at bottom of page */}
  <div className="qtn-body">
  {/* Client / Party details (content area) */}
  <section className="qtn-meta">
          {!preview ? (
            <>
              <div className="grid-2">
                <input
                  className="inp"
                  placeholder="Client / Party name"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                />
                <input
                  className="inp"
                  placeholder="name@example.com"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                />
              </div>
              <div className="grid-2">
                <input
                  className="inp"
                  placeholder="+91 ..."
                  value={client.phone}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                />
                <input
                  className="inp"
                  placeholder="Street, City, PIN"
                  value={client.address}
                  onChange={(e) => setClient({ ...client, address: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div className="client-view">
              <div>
                <strong>{client.name || "Client"}</strong>
              </div>
              {client.address && <div>{client.address}</div>}
              {client.phone && <div>Phone: {client.phone}</div>}
              {client.email && <div>Email: {client.email}</div>}
            </div>
          )}
  </section>

        {/* Items table */}
        <section className="qtn-items">
          <div className="table">
            <div className="tr th">
              <div className="td no">#</div>
              <div className="td name">Item / Product Description</div>
              <div className="td qty">Qty</div>
              <div className="td price">Price / Unit</div>
              <div className="td amt">Amount</div>
              {!preview && <div className="td actions"></div>}
            </div>

            {rows.map((row, i) => (
              <div className="tr" key={row.id}>
                <div className="td no">{i + 1}</div>
                <div className="td name">{row.name}</div>

                <div className="td qty">
                  {preview ? (
                    <span>{row.qty}</span>
                  ) : (
                    <input
                      className="inp center small no-spin"
                      type="number"
                      min="0"
                      step="1"
                      value={row.qty}
                      onChange={(e) => setQty(i, e.target.value)}
                    />
                  )}
                </div>

                <div className="td price">
                  {preview ? (
                    <span>{fmt(row.price)}</span>
                  ) : (
                    <input
                      className="inp right small"
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => setPrice(i, e.target.value)}
                      placeholder="0.00"
                    />
                  )}
                </div>

                <div className="td amt">₹ {fmt(lineTotal(row))}</div>

                {!preview && (
                  <div className="td actions">
                    <button className="link danger" onClick={() => removeRow(i)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
  </section>

  {/* Totals */}
  <section className="qtn-totals">
          
          <div className="row grand">
            <div className="lbl">Grand Total</div>
            <div className="val">₹ {fmt(subTotal)}</div>
          </div>
  </section>
  </div>
        {/* Footer contact bar to match letterhead */}
        <footer className="lh-footer">
          <div className="sep-line" />
          <div className="contact-row">
            {/* Left column row 1: Address */}
            <div className="contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 14 6 14s6-9.5 6-14c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5z"/></svg>
              <span>{head.addr1} {head.addr2}</span>
            </div>
            {/* Right column row 1: Email */}
            <div className="contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
              <span>{head.email}</span>
            </div>
            {/* Left column row 2: Website */}
            <div className="contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>{head.site}</span>
            </div>
            {/* Right column row 2: Phone */}
            <div className="contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 12 20a19.8 19.8 0 0 1-7.82 1.92A2 2 0 0 1 2 19.92v-3a2 2 0 0 1 2-2h.58a2 2 0 0 1 1.94 1.5 11.7 11.7 0 0 0 2.2 4.52 2 2 0 0 0 2.63.38 11.7 11.7 0 0 0 4.52-2.2 2 2 0 0 1 1.5-1.94H20a2 2 0 0 1 2 2z"/></svg>
              <span>{head.phone}</span>
            </div>
          </div>
          <div className="bottom-bar" aria-hidden="true">
            <div className="bottom-accent" aria-hidden="true" />
          </div>
        </footer>
      </div>
    </section>
  );
}
