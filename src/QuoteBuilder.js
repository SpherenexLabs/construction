// QuoteBuilder.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./QuoteBuilder.css";

/** ---------- IMAGES YOU CAN PASTE (HTTPS) ---------- */
const ITEM_IMAGES = {
  birla_super_53: "https://5.imimg.com/data5/SELLER/Default/2021/5/DN/BV/GG/31498371/birla-super-53-grade-cement-1000x1000.jpg",
  ultratech_ppc: "https://5.imimg.com/data5/SELLER/Default/2024/12/470241748/RL/GK/QO/16423774/ultratech-cement-ppc.jpg",
  ramco_53_43: "", dalmia: "", acc: "",

  tata: "", jsw: "", sail: "", jindal: "", sunvik: "",

  laterite_cutter: "", red_bricks: "", cc_blocks: "", aac_blocks: "", flyash_bricks: "",
  m_sand: "", p_sand: "",

  m10: "", m15: "", m20: "", m25: "", m30: "", m40: "",
  agg_20mm: "", agg_40mm: "",

  anchor: "", mi_box: "",

  teak: "", nigerian_teak: "", plywood_mdf: "",

  finolex: "", polycab: "", havells_wire: "", rr_kabel: "", kei: "",
  anchor_switches: "", legrand: "", schneider: "", havells_sw: "", gm: "",

  aluminium_windows: "", wooden_windows: "", upvc_windows: "",
  upvc_sliding: "", upvc_casement: "", upvc_fixed: "", shutter_5_3u: "", shutter_3_3u: "", thickness_1_5mm: "",

  astral: "", supreme: "", ashirvad: "",
  camera_wiring: "", tv_cable: "", ups_cable: "",

  taps: "", showers: "", faucets_mixers: "", basins: "", angle_valves: "",

  asian_apcolite: "", asian_apex: "", premium_emulsion: "",

  solar_connection: "", geyser: "", ro_plumbing: "",

  dr_fixit: "", fosroc: "", sika: "", asian_dampproof: "", nerolac: "",

  toughened_5mm: "", laminated: "", acrylic_sheet: "", polycarbonate: "",

  bathroom_leakage: "", kitchen_sink_area: "", basement: "",
};

const ph = (label) =>
  `https://via.placeholder.com/520x300/1f2937/ffffff?text=${encodeURIComponent(label)}`;

const imgOrPH = (k, label) =>
  ITEM_IMAGES[k] && ITEM_IMAGES[k].startsWith("https") ? ITEM_IMAGES[k] : ph(label);

/** ---------- CATEGORY DATA (same as your SubCategories) ---------- */
const makeCategories = () => {
  const base = [
    { id: 1,  title: "Cement",   image: "https://img.freepik.com/premium-photo/cement-plant-cement-production_406939-10898.jpg" },
    { id: 2,  title: "Steel",    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
    { id: 3,  title: "Bricks",   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDuABcGH3vzhNtGZumkSotP7gdUDk_aX334A&s" },
    { id: 4,  title: "Sand",     image: "https://static.vecteezy.com/system/resources/previews/042/654/226/non_2x/ai-generated-desert-sand-dunes-textured-landscape-free-png.png" },
    { id: 5,  title: "Concrete", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop" },
    { id: 6,  title: "Aggregates", image: "https://rockproducts.com/wp-content/uploads/2023/04/55jlbc_b78fc4f60cf5340e49d2e0637799cf187d016021-1.jpg" },
    { id: 7,  title: "Electrical Works", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop" },
    { id: 8,  title: "Wood", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop" },
    { id: 9,  title: "Wires", image: "https://thumbs.dreamstime.com/b/sparking-electrical-wires-ai-generated-image-two-disconnected-sparks-flying-them-382802919.jpg" },
    { id: 10, title: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
    { id: 11, title: "Windows", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop" },
    { id: 12, title: "uPVC Windows", image: "https://img.freepik.com/premium-photo/outdoor-upvc-windows_636493-8.jpg" },
    { id: 13, title: "Plumbing", image: "https://static.vecteezy.com/system/resources/previews/038/813/452/large_2x/ai-generated-beautifulgraphy-for-plumbing-services-advertising-free-photo.jpeg" },
    { id: 14, title: "Electrical", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop" },
    { id: 15, title: "Fitting Items", image: "https://thumbs.dreamstime.com/b/plomo-profesional-que-fija-tuber%C3%ADas-de-suelo-ba%C3%B1o-con-herramientas-en-el-ajuste-servicio-ia-generativa-369170262.jpg" },
    { id: 16, title: "Painting", image: "https://media.istockphoto.com/id/1384317531/photo/before-and-after-of-man-painting-roller-to-reveal-newly-remodeled-room-with-fresh-light-green.jpg?s=612x612&w=0&k=20&c=wF448uWLu7btrsbZedGiIHqHbeu6KxA-YxZOiTkfcMY=" },
    { id: 17, title: "Connection", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
    { id: 18, title: "Waterproof (Exterior Works)", image: "https://img.freepik.com/premium-photo/worker-applying-waterproofing-membrane-rooftop_815570-8045.jpg" },
    { id: 19, title: "Glass", image: "https://img.freepik.com/premium-photo/contemporary-riverfront-home-glass-walls-stone-steps-leading-water-sunny-reflection_1342292-9395.jpg" },
    { id: 20, title: "Waterproof (Interior Work)", image: "https://content-management-files.canva.com/cbd06f5b-e7f3-4537-8e68-72ef597fd668/ai-interior-design_ogimage_2x.png" }
  ];
  const withSubs = (title, subs) => ({ title, subs });

  const subs = new Map([
    withSubs("Cement", [
      ["birla_super_53","Birla Super 53 Grade"],
      ["ultratech_ppc","Ultratech PPC"],
      ["ramco_53_43","Ramco 53 & 43"],
      ["dalmia","Dalmia"],
      ["acc","ACC"],
    ]),
    withSubs("Steel", [["tata","TATA"],["jsw","JSW"],["sail","SAIL"],["jindal","Jindal"],["sunvik","Sunvik"]]),
    withSubs("Bricks", [["laterite_cutter","Laterite Bricks (cutter finish)"],["red_bricks","Red Bricks"],["cc_blocks","C.C. Blocks"],["aac_blocks","AAC Blocks"],["flyash_bricks","Fly Ash Bricks"]]),
    withSubs("Sand", [["m_sand","M-Sand"],["p_sand","P-Sand"]]),
    withSubs("Concrete", [["m10","M10"],["m15","M15"],["m20","M20"],["m25","M25"],["m30","M30"],["m40","M40"]]),
    withSubs("Aggregates",[["agg_20mm","20 mm"],["agg_40mm","40 mm"]]),
    withSubs("Electrical Works",[["anchor","Anchor (Boards/Fixtures)"],["mi_box","M.I. Box"]]),
    withSubs("Wood",[["teak","Teak Wood"],["nigerian_teak","Nigerian Teak"],["plywood_mdf","Plywood / MDF"]]),
    withSubs("Wires",[["finolex","Finolex"],["polycab","Polycab"],["havells_wire","Havells"],["rr_kabel","RR Kabel"],["kei","KEI"]]),
    withSubs("Switches",[["anchor_switches","Anchor"],["legrand","Legrand"],["schneider","Schneider"],["havells_sw","Havells"],["gm","GM"]]),
    withSubs("Windows",[["aluminium_windows","Aluminium Windows"],["wooden_windows","Wooden Windows"],["upvc_windows","uPVC Windows"]]),
    withSubs("uPVC Windows",[["upvc_sliding","uPVC Sliding"],["upvc_casement","uPVC Casement"],["upvc_fixed","uPVC Fixed"],["shutter_5_3u","Shutters 5.3U"],["shutter_3_3u","Shutters 3.3U"],["thickness_1_5mm","1.5 mm Thickness"]]),
    withSubs("Plumbing",[["astral","Astral"],["supreme","Supreme"],["ashirvad","Ashirvad"]]),
    withSubs("Electrical",[["camera_wiring","Camera Wiring"],["tv_cable","TV Cable"],["ups_cable","UPS Cable"]]),
    withSubs("Fitting Items",[["taps","Taps"],["showers","Showers"],["faucets_mixers","Faucets / Mixers"],["basins","Basins"],["angle_valves","Angle Valves"]]),
    withSubs("Painting",[["asian_apcolite","Asian Paints – Apcolite"],["asian_apex","Asian Paints – Apex"],["premium_emulsion","Premium Emulsion"]]),
    withSubs("Connection",[["solar_connection","Solar Connection"],["geyser","Geyser Connection"],["ro_plumbing","RO Plumbing"]]),
    withSubs("Waterproof (Exterior Works)",[["dr_fixit","Dr. Fixit"],["fosroc","Fosroc"],["sika","Sika"],["asian_dampproof","Asian Damp Proof"],["nerolac","Nerolac"]]),
    withSubs("Glass",[["toughened_5mm","Toughened Glass 5 mm"],["laminated","Laminated Glass"],["acrylic_sheet","Acrylic Sheet"],["polycarbonate","Polycarbonate Sheet"]]),
    withSubs("Waterproof (Interior Work)",[["bathroom_leakage","Bathroom Leakage Repair"],["kitchen_sink_area","Kitchen Sink Area Waterproofing"],["basement","Basement Waterproofing"]]),
  ]);

  return base.map((c) => ({
    ...c,
    subItems:
      (subs.get(c.title) || []).map(([key, label]) => ({
        key, label, img: imgOrPH(key, label),
      })),
  }));
};

/** ---------- QUOTE BUILDER PAGE ---------- */
const QuoteBuilder = () => {
  const categories = useMemo(makeCategories, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCat, setModalCat] = useState(null);
  const [selected, setSelected] = useState({}); // {catId: {subKey: true}}

  // RIGHT PANE (quotation) state
  const [client, setClient] = useState({ name:"", email:"", phone:"", address:"" });

  // Letterhead (from your PDF template)
  const letterhead = {
    company: "VRM GROUPS",
    tagline: "Building Construction",
    addr1: "No 68 Hemadri, 1st Main Attached Bel,",
    addr2: "Balaji Layout, Marappana Palya, Bengaluru North 562123",
    site: "www.vrmgroups.com",
    email: "info@vrmgroups.com",
    phone: "+91 9900315454",
  };

  // Items in the quotation table
  const [rows, setRows] = useState([]); // {id: 'key', name, qty, price}
  const findRowIndex = (id) => rows.findIndex((r) => r.id === id);

  const addRowFor = (id, label) =>
    setRows((r) =>
      findRowIndex(id) >= 0 ? r : [...r, { id, name: label, qty: 1, price: 0 }]
    );
  const removeRowFor = (id) =>
    setRows((r) => r.filter((x) => x.id !== id));

  // When user toggles a sub-item in the left popup
  const toggleSelect = (cat, sub) => {
    setSelected((prev) => {
      const catMap = { ...(prev[cat.id] || {}) };
      catMap[sub.key] = !catMap[sub.key];
      // Keep quotation in sync
      const fullId = `${cat.id}:${sub.key}`;
      if (catMap[sub.key]) addRowFor(fullId, sub.label);
      else removeRowFor(fullId);
      return { ...prev, [cat.id]: catMap };
    });
  };

  const qtyChange = (i, delta) =>
    setRows((r) =>
      r.map((row, idx) =>
        idx === i ? { ...row, qty: Math.max(0, Number(row.qty || 0) + delta) } : row
      )
    );
  const setQty = (i, v) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, qty: Math.max(0, Number(v || 0)) } : row)));
  const setPrice = (i, v) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, price: Number(v || 0) } : row)));
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));

  const lineTotal = (row) => Number(row.qty || 0) * Number(row.price || 0);
  const subTotal = rows.reduce((s, r) => s + lineTotal(r), 0);

  // Modal helpers
  const openModal = (cat) => { setModalCat(cat); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalCat(null); };

  // PDF / Print
  const sheetRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const fmt = (n) =>
    (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});

  const logoSrc = `${process.env.PUBLIC_URL}/assets/vrm.png`;

  const downloadPDF = async () => {
    const node = sheetRef.current;
    if (!node) return;
    const prev = preview; setPreview(true);
    await new Promise((r) => setTimeout(r, 40));
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    let remaining = imgHeight;
    let position = 0;
    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      remaining -= pdf.internal.pageSize.getHeight();
      if (remaining > 0) pdf.addPage();
      position += 1;
    }
    pdf.save(`Quotation-${Date.now()}.pdf`);
    setPreview(prev);
  };
  const printPage = async () => {
    const prev = preview; setPreview(true);
    await new Promise((r) => setTimeout(r, 40));
    window.print();
    setPreview(prev);
  };

  return (
    <div className="qb-wrap">
      {/* LEFT: Item selection */}
      <section className="qb-left">
        <h2 className="pane-title">Select Items</h2>

        <div className="cats-grid">
          {categories.map((cat) => (
            <div className="cat-card" key={cat.id}>
              <div className="cat-img">
                <img
                  src={cat.image}
                  alt={cat.title}
                  onError={(e)=>{e.currentTarget.src=ph(cat.title);}}
                />
              </div>
              <div className="cat-foot">
                <h3>{cat.title}</h3>
                <button className="link-btn" onClick={() => openModal(cat)}>
                  View all items
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for sub-items */}
        {modalOpen && (
          <Modal title={modalCat?.title || "Items"} onClose={closeModal}>
            <div className="items-grid">
              {(modalCat?.subItems || []).map((sub) => {
                const isChecked = !!selected[modalCat.id]?.[sub.key];
                return (
                  <button
                    type="button"
                    key={sub.key}
                    className={`item-card ${isChecked ? "checked" : ""}`}
                    onClick={() => toggleSelect(modalCat, sub)}
                  >
                    <div className="item-img">
                      <img
                        src={sub.img}
                        alt={sub.label}
                        onError={(e)=>{e.currentTarget.src=ph(sub.label);}}
                      />
                    </div>
                    <div className="item-meta">
                      <span className="item-name">{sub.label}</span>
                      <input type="checkbox" readOnly checked={isChecked} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={closeModal}>Close</button>
            </div>
          </Modal>
        )}
      </section>

      {/* RIGHT: Quotation */}
      <section className="qb-right">
        <div className="toolbar no-print">
          <button className="btn ghost" onClick={()=>setPreview(p=>!p)}>
            {preview ? "Exit Preview" : "Preview"}
          </button>
          <div className="spacer" />
          <button className="btn ghost" onClick={downloadPDF}>Download PDF</button>
          <button className="btn" onClick={printPage}>Print</button>
        </div>

        <div className={`sheet ${preview ? "preview" : ""}`} ref={sheetRef}>
          {/* Letterhead */}
          <header className="letterhead">
            <div className="lh-left">
              <img className="lh-logo" src={logoSrc} alt="VRM logo" />
              <div>
                <h1 className="lh-company">{letterhead.company}</h1>
                <div className="lh-tag">{letterhead.tagline}</div>
              </div>
            </div>
            <div className="lh-right">
              <div>{letterhead.addr1}</div>
              <div>{letterhead.addr2}</div>
              <div>{letterhead.site}</div>
              <div>{letterhead.email}</div>
              <div>{letterhead.phone}</div>
            </div>
          </header>

          {/* Quotation title */}
          <div className="doc-title">QUOTATION</div>

          {/* Client fields */}
          <section className="client">
            {!preview ? (
              <>
                <div className="grid2">
                  <label>
                    <span>Name</span>
                    <input
                      className="inp"
                      value={client.name}
                      onChange={(e)=>setClient({...client, name:e.target.value})}
                      placeholder="Client / Party name"
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      className="inp"
                      value={client.email}
                      onChange={(e)=>setClient({...client, email:e.target.value})}
                      placeholder="name@example.com"
                    />
                  </label>
                </div>
                <div className="grid2">
                  <label>
                    <span>Phone</span>
                    <input
                      className="inp"
                      value={client.phone}
                      onChange={(e)=>setClient({...client, phone:e.target.value})}
                      placeholder="+91 ..."
                    />
                  </label>
                  <label>
                    <span>Address</span>
                    <input
                      className="inp"
                      value={client.address}
                      onChange={(e)=>setClient({...client, address:e.target.value})}
                      placeholder="Street, City, PIN"
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="client-view">
                <div><strong>{client.name || "Client"}</strong></div>
                {client.address && <div>{client.address}</div>}
                {client.phone && <div>Phone: {client.phone}</div>}
                {client.email && <div>Email: {client.email}</div>}
              </div>
            )}
          </section>

          {/* Items table */}
          <section className="items">
            <div className="t-row head">
              <div className="t-cell no">#</div>
              <div className="t-cell name">Item / Description</div>
              <div className="t-cell qty">Qty</div>
              <div className="t-cell price">Price / Unit</div>
              <div className="t-cell amt">Amount</div>
              {!preview && <div className="t-cell act"></div>}
            </div>

            {rows.map((row, i) => (
              <div className="t-row" key={row.id}>
                <div className="t-cell no">{i + 1}</div>
                <div className="t-cell name">{row.name}</div>

                <div className="t-cell qty">
                  {preview ? (
                    <span>{row.qty}</span>
                  ) : (
                    <div className="qtybox">
                      <button className="btn sm ghost" onClick={()=>qtyChange(i,-1)}>−</button>
                      <input
                        className="inp center small"
                        type="number"
                        min="0"
                        value={row.qty}
                        onChange={(e)=>setQty(i, e.target.value)}
                      />
                      <button className="btn sm ghost" onClick={()=>qtyChange(i, +1)}>+</button>
                    </div>
                  )}
                </div>

                <div className="t-cell price">
                  {preview ? (
                    <span>{fmt(row.price)}</span>
                  ) : (
                    <input
                      className="inp right small"
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price}
                      onChange={(e)=>setPrice(i, e.target.value)}
                      placeholder="0.00"
                    />
                  )}
                </div>

                <div className="t-cell amt">₹ {fmt(lineTotal(row))}</div>

                {!preview && (
                  <div className="t-cell act">
                    <button className="link danger" onClick={()=>removeRow(i)}>Remove</button>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Totals */}
          <section className="totals">
            <div className="row">
              <div className="lbl">Sub Total</div>
              <div className="val">₹ {fmt(subTotal)}</div>
            </div>
            <div className="row grand">
              <div className="lbl">Grand Total</div>
              <div className="val">₹ {fmt(subTotal)}</div>
            </div>
          </section>

          <footer className="foot">
            <p>
              Thank you for the opportunity. Taxes extra unless specified.
              Delivery & payment terms as discussed.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};

/** ---------- Simple Modal ---------- */
const Modal = ({ title, children, onClose }) => {
  const overlayRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={(e)=>{ if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <div className="modal-head">
          <h3 id="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
