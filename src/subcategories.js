// // SubCategories.js
// import React, { useMemo, useState, useEffect, useRef } from "react";
// import "./SubCategories.css";

// /** Paste HTTPS image URLs here (leave "" if not ready).
//  *  The UI auto-falls back to a placeholder when the URL is empty or invalid.
//  */
// const ITEM_IMAGES = {
//   birla_super_53: "https://5.imimg.com/data5/SELLER/Default/2021/5/DN/BV/GG/31498371/birla-super-53-grade-cement-1000x1000.jpg",       // e.g. "https://example.com/birla.jpg"
//   ultratech_ppc: "https://5.imimg.com/data5/SELLER/Default/2024/12/470241748/RL/GK/QO/16423774/ultratech-cement-ppc.jpg",        // ...
//   ramco_53_43: "",
//   dalmia: "",
//   acc: "",

//   tata: "", jsw: "", sail: "", jindal: "", sunvik: "",

//   laterite_cutter: "", red_bricks: "", cc_blocks: "", aac_blocks: "", flyash_bricks: "",
//   m_sand: "", p_sand: "",

//   m10: "", m15: "", m20: "", m25: "", m30: "", m40: "",
//   agg_20mm: "", agg_40mm: "",

//   anchor: "", mi_box: "",

//   teak: "", nigerian_teak: "", plywood_mdf: "",

//   finolex: "", polycab: "", havells_wire: "", rr_kabel: "", kei: "",
//   anchor_switches: "", legrand: "", schneider: "", havells_sw: "", gm: "",

//   aluminium_windows: "", wooden_windows: "", upvc_windows: "",
//   upvc_sliding: "", upvc_casement: "", upvc_fixed: "", shutter_5_3u: "", shutter_3_3u: "", thickness_1_5mm: "",

//   astral: "", supreme: "", ashirvad: "",
//   camera_wiring: "", tv_cable: "", ups_cable: "",

//   taps: "", showers: "", faucets_mixers: "", basins: "", angle_valves: "",

//   asian_apcolite: "", asian_apex: "", premium_emulsion: "",

//   solar_connection: "", geyser: "", ro_plumbing: "",

//   dr_fixit: "", fosroc: "", sika: "", asian_dampproof: "", nerolac: "",

//   toughened_5mm: "", laminated: "", acrylic_sheet: "", polycarbonate: "",

//   bathroom_leakage: "", kitchen_sink_area: "", basement: "",
// };

// /** Placeholder builder */
// const ph = (label) =>
//   `https://via.placeholder.com/520x300/1f2937/ffffff?text=${encodeURIComponent(
//     label
//   )}`;

// /** Choose the image: prefer a valid https URL, else placeholder */
// const imgOrPH = (key, label) =>
//   ITEM_IMAGES[key] && ITEM_IMAGES[key].startsWith("https")
//     ? ITEM_IMAGES[key]
//     : ph(label);

// const SubCategories = () => {
//   const baseCategories = useMemo(
//     () => [
//       { id: 1,  title: "Cement",   image: "https://img.freepik.com/premium-photo/cement-plant-cement-production_406939-10898.jpg" },
//       { id: 2,  title: "Steel",    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
//       { id: 3,  title: "Bricks",   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDuABcGH3vzhNtGZumkSotP7gdUDk_aX334A&s" },
//       { id: 4,  title: "Sand",     image: "https://static.vecteezy.com/system/resources/previews/042/654/226/non_2x/ai-generated-desert-sand-dunes-textured-landscape-free-png.png" },
//       { id: 5,  title: "Concrete", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop" },
//       { id: 6,  title: "Aggregates", image: "https://rockproducts.com/wp-content/uploads/2023/04/55jlbc_b78fc4f60cf5340e49d2e0637799cf187d016021-1.jpg" },
//       { id: 7,  title: "Electrical Works", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop" },
//       { id: 8,  title: "Wood", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop" },
//       { id: 9,  title: "Wires", image: "https://thumbs.dreamstime.com/b/sparking-electrical-wires-ai-generated-image-two-disconnected-sparks-flying-them-382802919.jpg" },
//       { id: 10, title: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
//       { id: 11, title: "Windows", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop" },
//       { id: 12, title: "uPVC Windows", image: "https://img.freepik.com/premium-photo/outdoor-upvc-windows_636493-8.jpg" },
//       { id: 13, title: "Plumbing", image: "https://static.vecteezy.com/system/resources/previews/038/813/452/large_2x/ai-generated-beautifulgraphy-for-plumbing-services-advertising-free-photo.jpeg" },
//       { id: 14, title: "Electrical", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop" },
//       { id: 15, title: "Fitting Items", image: "https://thumbs.dreamstime.com/b/plomo-profesional-que-fija-tuber%C3%ADas-de-suelo-ba%C3%B1o-con-herramientas-en-el-ajuste-servicio-ia-generativa-369170262.jpg" },
//       { id: 16, title: "Painting", image: "https://media.istockphoto.com/id/1384317531/photo/before-and-after-of-man-painting-roller-to-reveal-newly-remodeled-room-with-fresh-light-green.jpg?s=612x612&w=0&k=20&c=wF448uWLu7btrsbZedGiIHqHbeu6KxA-YxZOiTkfcMY=" },
//       { id: 17, title: "Connection", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
//       { id: 18, title: "Waterproof (Exterior Works)", image: "https://img.freepik.com/premium-photo/worker-applying-waterproofing-membrane-rooftop_815570-8045.jpg" },
//       { id: 19, title: "Glass", image: "https://img.freepik.com/premium-photo/contemporary-riverfront-home-glass-walls-stone-steps-leading-water-sunny-reflection_1342292-9395.jpg" },
//       { id: 20, title: "Waterproof (Interior Work)", image: "https://content-management-files.canva.com/cbd06f5b-e7f3-4537-8e68-72ef597fd668/ai-interior-design_ogimage_2x.png" }
//     ],
//     []
//   );

//   const categories = useMemo(
//     () =>
//       baseCategories.map((c) => {
//         switch (c.title) {
//           case "Cement":
//             return {
//               ...c,
//               subItems: [
//                 { key: "birla_super_53", label: "Birla Super 53 Grade", img: imgOrPH("birla_super_53", "Birla Super 53 Grade") },
//                 { key: "ultratech_ppc", label: "Ultratech PPC", img: imgOrPH("ultratech_ppc", "Ultratech PPC") },
//                 { key: "ramco_53_43", label: "Ramco 53 & 43", img: imgOrPH("ramco_53_43", "Ramco 53 & 43") },
//                 { key: "dalmia", label: "Dalmia", img: imgOrPH("dalmia", "Dalmia") },
//                 { key: "acc", label: "ACC", img: imgOrPH("acc", "ACC") },
//                 { key: "acc", label: "ACC", img: imgOrPH("acc", "ACC") },
//               ],
//             };
//           case "Steel":
//             return {
//               ...c,
//               subItems: [
//                 { key: "tata", label: "TATA", img: imgOrPH("tata", "TATA") },
//                 { key: "jsw", label: "JSW", img: imgOrPH("jsw", "JSW") },
//                 { key: "sail", label: "SAIL", img: imgOrPH("sail", "SAIL") },
//                 { key: "jindal", label: "Jindal", img: imgOrPH("jindal", "Jindal") },
//                 { key: "sunvik", label: "Sunvik", img: imgOrPH("sunvik", "Sunvik") },
//               ],
//             };
//           case "Bricks":
//             return {
//               ...c,
//               subItems: [
//                 { key: "laterite_cutter", label: "Laterite Bricks (cutter finish)", img: imgOrPH("laterite_cutter", "Laterite Bricks") },
//                 { key: "red_bricks", label: "Red Bricks", img: imgOrPH("red_bricks", "Red Bricks") },
//                 { key: "cc_blocks", label: "C.C. Blocks", img: imgOrPH("cc_blocks", "C.C. Blocks") },
//                 { key: "aac_blocks", label: "AAC Blocks", img: imgOrPH("aac_blocks", "AAC Blocks") },
//                 { key: "flyash_bricks", label: "Fly Ash Bricks", img: imgOrPH("flyash_bricks", "Fly Ash Bricks") },
//               ],
//             };
//           case "Sand":
//             return {
//               ...c,
//               subItems: [
//                 { key: "m_sand", label: "M-Sand", img: imgOrPH("m_sand", "M-Sand") },
//                 { key: "p_sand", label: "P-Sand", img: imgOrPH("p_sand", "P-Sand") },
//               ],
//             };
//           case "Concrete":
//             return {
//               ...c,
//               subItems: [
//                 { key: "m10", label: "M10", img: imgOrPH("m10", "Concrete M10") },
//                 { key: "m15", label: "M15", img: imgOrPH("m15", "Concrete M15") },
//                 { key: "m20", label: "M20", img: imgOrPH("m20", "Concrete M20") },
//                 { key: "m25", label: "M25", img: imgOrPH("m25", "Concrete M25") },
//                 { key: "m30", label: "M30", img: imgOrPH("m30", "Concrete M30") },
//                 { key: "m40", label: "M40", img: imgOrPH("m40", "Concrete M40") },
//               ],
//             };
//           case "Aggregates":
//             return {
//               ...c,
//               subItems: [
//                 { key: "agg_20mm", label: "20 mm", img: imgOrPH("agg_20mm", "Aggregates 20 mm") },
//                 { key: "agg_40mm", label: "40 mm", img: imgOrPH("agg_40mm", "Aggregates 40 mm") },
//               ],
//             };
//           case "Electrical Works":
//             return {
//               ...c,
//               subItems: [
//                 { key: "anchor", label: "Anchor (Boards/Fixtures)", img: imgOrPH("anchor", "Anchor") },
//                 { key: "mi_box", label: "M.I. Box", img: imgOrPH("mi_box", "M.I. Box") },
//               ],
//             };
//           case "Wood":
//             return {
//               ...c,
//               subItems: [
//                 { key: "teak", label: "Teak Wood", img: imgOrPH("teak", "Teak Wood") },
//                 { key: "nigerian_teak", label: "Nigerian Teak", img: imgOrPH("nigerian_teak", "Nigerian Teak") },
//                 { key: "plywood_mdf", label: "Plywood / MDF", img: imgOrPH("plywood_mdf", "Plywood / MDF") },
//               ],
//             };
//           case "Wires":
//             return {
//               ...c,
//               subItems: [
//                 { key: "finolex", label: "Finolex", img: imgOrPH("finolex", "Finolex") },
//                 { key: "polycab", label: "Polycab", img: imgOrPH("polycab", "Polycab") },
//                 { key: "havells_wire", label: "Havells", img: imgOrPH("havells_wire", "Havells") },
//                 { key: "rr_kabel", label: "RR Kabel", img: imgOrPH("rr_kabel", "RR Kabel") },
//                 { key: "kei", label: "KEI", img: imgOrPH("kei", "KEI") },
//               ],
//             };
//           case "Switches":
//             return {
//               ...c,
//               subItems: [
//                 { key: "anchor_switches", label: "Anchor", img: imgOrPH("anchor_switches", "Anchor Switches") },
//                 { key: "legrand", label: "Legrand", img: imgOrPH("legrand", "Legrand Switches") },
//                 { key: "schneider", label: "Schneider", img: imgOrPH("schneider", "Schneider Switches") },
//                 { key: "havells_sw", label: "Havells", img: imgOrPH("havells_sw", "Havells Switches") },
//                 { key: "gm", label: "GM", img: imgOrPH("gm", "GM Switches") },
//               ],
//             };
//           case "Windows":
//             return {
//               ...c,
//               subItems: [
//                 { key: "aluminium_windows", label: "Aluminium Windows", img: imgOrPH("aluminium_windows", "Aluminium Windows") },
//                 { key: "wooden_windows", label: "Wooden Windows", img: imgOrPH("wooden_windows", "Wooden Windows") },
//                 { key: "upvc_windows", label: "uPVC Windows", img: imgOrPH("upvc_windows", "uPVC Windows") },
//               ],
//             };
//           case "uPVC Windows":
//             return {
//               ...c,
//               subItems: [
//                 { key: "upvc_sliding", label: "uPVC Sliding", img: imgOrPH("upvc_sliding", "uPVC Sliding") },
//                 { key: "upvc_casement", label: "uPVC Casement", img: imgOrPH("upvc_casement", "uPVC Casement") },
//                 { key: "upvc_fixed", label: "uPVC Fixed", img: imgOrPH("upvc_fixed", "uPVC Fixed") },
//                 { key: "shutter_5_3u", label: "Shutters 5.3U", img: imgOrPH("shutter_5_3u", "Shutters 5.3U") },
//                 { key: "shutter_3_3u", label: "Shutters 3.3U", img: imgOrPH("shutter_3_3u", "Shutters 3.3U") },
//                 { key: "thickness_1_5mm", label: "1.5 mm Thickness", img: imgOrPH("thickness_1_5mm", "1.5 mm Thickness") },
//               ],
//             };
//           case "Plumbing":
//             return {
//               ...c,
//               subItems: [
//                 { key: "astral", label: "Astral", img: imgOrPH("astral", "Astral") },
//                 { key: "supreme", label: "Supreme", img: imgOrPH("supreme", "Supreme") },
//                 { key: "ashirvad", label: "Ashirvad", img: imgOrPH("ashirvad", "Ashirvad") },
//               ],
//             };
//           case "Electrical":
//             return {
//               ...c,
//               subItems: [
//                 { key: "camera_wiring", label: "Camera Wiring", img: imgOrPH("camera_wiring", "Camera Wiring") },
//                 { key: "tv_cable", label: "TV Cable", img: imgOrPH("tv_cable", "TV Cable") },
//                 { key: "ups_cable", label: "UPS Cable", img: imgOrPH("ups_cable", "UPS Cable") },
//               ],
//             };
//           case "Fitting Items":
//             return {
//               ...c,
//               subItems: [
//                 { key: "taps", label: "Taps", img: imgOrPH("taps", "Taps") },
//                 { key: "showers", label: "Showers", img: imgOrPH("showers", "Showers") },
//                 { key: "faucets_mixers", label: "Faucets / Mixers", img: imgOrPH("faucets_mixers", "Faucets / Mixers") },
//                 { key: "basins", label: "Basins", img: imgOrPH("basins", "Basins") },
//                 { key: "angle_valves", label: "Angle Valves", img: imgOrPH("angle_valves", "Angle Valves") },
//               ],
//             };
//           case "Painting":
//             return {
//               ...c,
//               subItems: [
//                 { key: "asian_apcolite", label: "Asian Paints – Apcolite", img: imgOrPH("asian_apcolite", "Asian Apcolite") },
//                 { key: "asian_apex", label: "Asian Paints – Apex", img: imgOrPH("asian_apex", "Asian Apex") },
//                 { key: "premium_emulsion", label: "Premium Emulsion", img: imgOrPH("premium_emulsion", "Premium Emulsion") },
//               ],
//             };
//           case "Connection":
//             return {
//               ...c,
//               subItems: [
//                 { key: "solar_connection", label: "Solar Connection", img: imgOrPH("solar_connection", "Solar Connection") },
//                 { key: "geyser", label: "Geyser Connection", img: imgOrPH("geyser", "Geyser Connection") },
//                 { key: "ro_plumbing", label: "RO Plumbing", img: imgOrPH("ro_plumbing", "RO Plumbing") },
//               ],
//             };
//           case "Waterproof (Exterior Works)":
//             return {
//               ...c,
//               subItems: [
//                 { key: "dr_fixit", label: "Dr. Fixit", img: imgOrPH("dr_fixit", "Dr. Fixit") },
//                 { key: "fosroc", label: "Fosroc", img: imgOrPH("fosroc", "Fosroc") },
//                 { key: "sika", label: "Sika", img: imgOrPH("sika", "Sika") },
//                 { key: "asian_dampproof", label: "Asian Damp Proof", img: imgOrPH("asian_dampproof", "Asian Damp Proof") },
//                 { key: "nerolac", label: "Nerolac", img: imgOrPH("nerolac", "Nerolac") },
//               ],
//             };
//           case "Glass":
//             return {
//               ...c,
//               subItems: [
//                 { key: "toughened_5mm", label: "Toughened Glass 5 mm", img: imgOrPH("toughened_5mm", "Toughened Glass 5 mm") },
//                 { key: "laminated", label: "Laminated Glass", img: imgOrPH("laminated", "Laminated Glass") },
//                 { key: "acrylic_sheet", label: "Acrylic Sheet", img: imgOrPH("acrylic_sheet", "Acrylic Sheet") },
//                 { key: "polycarbonate", label: "Polycarbonate Sheet", img: imgOrPH("polycarbonate", "Polycarbonate Sheet") },
//               ],
//             };
//           case "Waterproof (Interior Work)":
//             return {
//               ...c,
//               subItems: [
//                 { key: "bathroom_leakage", label: "Bathroom Leakage Repair", img: imgOrPH("bathroom_leakage", "Bathroom Leakage Repair") },
//                 { key: "kitchen_sink_area", label: "Kitchen Sink Area Waterproofing", img: imgOrPH("kitchen_sink_area", "Kitchen Sink Area") },
//                 { key: "basement", label: "Basement Waterproofing", img: imgOrPH("basement", "Basement Waterproofing") },
//               ],
//             };
//           default:
//             return { ...c, subItems: [] };
//         }
//       }),
//     [baseCategories]
//   );

//   const [selected, setSelected] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalCat, setModalCat] = useState(null);

//   const openModal = (category) => { setModalCat(category); setModalOpen(true); };
//   const closeModal = () => { setModalOpen(false); setModalCat(null); };

//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && closeModal();
//     if (modalOpen) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [modalOpen]);

//   const toggleSelect = (categoryId, subKey) => {
//     setSelected((prev) => {
//       const catSel = { ...(prev[categoryId] || {}) };
//       catSel[subKey] = !catSel[subKey];
//       return { ...prev, [categoryId]: catSel };
//     });
//   };

//   const selectedCount = (catId) =>
//     Object.values(selected[catId] || {}).filter(Boolean).length;

//   return (
//     <section className="subcats-section">
//       <div className="subcats-container">
//         <div className="subcats-header">
//           <h2>Explore Building, Construction and Infrastructure</h2>
//         </div>

//         <div className="subcats-grid">
//           {categories.map((cat) => (
//             <div className="subcat-card" key={cat.id}>
//               <div className="subcat-img">
//                 <img
//                   src={cat.image}
//                   alt={cat.title}
//                   loading="lazy"
//                   onError={(e) => {
//                     e.currentTarget.src =
//                       "https://via.placeholder.com/600x360/003049/ffffff?text=" +
//                       encodeURIComponent(cat.title);
//                   }}
//                 />
//               </div>

//               <div className="subcat-footer">
//                 <h3 className="subcat-title">{cat.title}</h3>
//                 <button className="subcat-toggle" onClick={() => openModal(cat)} aria-haspopup="dialog">
//                   <span>
//                     View all items
//                     {selectedCount(cat.id) > 0 ? ` · ${selectedCount(cat.id)} selected` : ""}
//                   </span>
//                   <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <polyline points="9,18 15,12 9,6"></polyline>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {modalOpen && (
//         <Modal onClose={closeModal} title={modalCat?.title || "Items"}>
//           {modalCat?.subItems?.length ? (
//             <div className="items-grid">
//               {modalCat.subItems.map((it) => {
//                 const checked = !!selected[modalCat.id]?.[it.key];
//                 return (
//                   <button
//                     type="button"
//                     key={it.key}
//                     className={`item-card ${checked ? "item-checked" : ""}`}
//                     onClick={() => toggleSelect(modalCat.id, it.key)}
//                   >
//                     <div className="item-imgwrap">
//                       <img
//                         src={it.img}
//                         alt={it.label}
//                         loading="lazy"
//                         onError={(e) => { e.currentTarget.src = ph(it.label); }}
//                       />
//                     </div>
//                     <div className="item-meta">
//                       <span className="item-name">{it.label}</span>
//                       <input type="checkbox" readOnly checked={checked} className="item-checkbox" aria-label={`Select ${it.label}`} />
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="modal-empty">No sub-items added for <strong>{modalCat?.title}</strong> yet.</div>
//           )}

//           <div className="modal-actions">
//             <button className="btn ghost" onClick={closeModal}>Cancel</button>
//             <button className="btn primary" onClick={closeModal}>Apply</button>
//           </div>
//         </Modal>
//       )}
//     </section>
//   );
// };

// const Modal = ({ title, children, onClose }) => {
//   const overlayRef = useRef(null);
//   const onOverlayClick = (e) => { if (e.target === overlayRef.current) onClose(); };
//   return (
//     <div className="modal-overlay" ref={overlayRef} onMouseDown={onOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
//       <div className="modal-card" role="document">
//         <div className="modal-head">
//           <h3 id="modal-title">{title}</h3>
//           <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
//         </div>
//         <div className="modal-body">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default SubCategories;




// SubCategories.js
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SubCategories.css";

/** HTTPS image slots (paste your URLs). */
const ITEM_IMAGES = {
  birla_super_53: "https://5.imimg.com/data5/SELLER/Default/2021/5/DN/BV/GG/31498371/birla-super-53-grade-cement-1000x1000.jpg",       // e.g. "https://example.com/birla.jpg"
  ultratech_ppc: "https://5.imimg.com/data5/SELLER/Default/2024/12/470241748/RL/GK/QO/16423774/ultratech-cement-ppc.jpg",        // ...
  ramco_53_43: "https://5.imimg.com/data5/SELLER/Default/2025/1/481300437/FN/IX/TR/65622648/ramco-infra-53-grade-cement.jpg",
  dalmia: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS5jFQZUn2elqx-m2jhjmROFC48NXZtFf2eA&s",
  acc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ6IkbD5uoya74t0_VVpKXjchl-CIK9PoZWw&s",
  jsw_53_43: "https://content.jdmagicbox.com/quickquotes/images_main/jsw-opc-53-cement-weight-50-kg-2223391750-7tkq1zx6.jpg?impolicy=queryparam&im=Resize=(360,360),aspect=fit",

  tata: "https://litrols.com/wp-content/uploads/2023/09/ABB-and-Tata-Steel-Collaborate-to-Explore-Technologies-Aim-to-Reduce-the-Carbon-Footprint-of-Steel-Manufacturing.jpg",
  jsw: "https://5.imimg.com/data5/SELLER/Default/2022/10/OH/MX/CG/43598357/jsw-neo-tmt-steel-fe-550-500x500.jpg",
  a_1_gold: "https://www.buildmaadi.com/wp-content/uploads/2019/11/Aone-Steel.jpg",
  sungold: "https://media.istockphoto.com/id/1063784898/photo/building-armature-steel-bars-stack-on-white-background.jpg?s=612x612&w=0&k=20&c=fW1lo902dN0Oe_H3iSHKhuM9kS5pUOFJrO6Fp-EjH8Y=",
  sunvik: "https://sunviksteels.com/wp-content/uploads/2025/04/image.png",
  turbo: "https://5.imimg.com/data5/SELLER/Default/2023/3/MO/JI/MB/84139099/32-mm-turbosteel-tmt-bar-500x500.jpg",

  solid_blocks: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtEz1XN7yylWtCQQWrj-xgCdDuaTq9-pxuIA&s",
  red_bricks: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ViWoff7-W09tazJS_eiTmklrPWdhrWnRTA&s",
  alpha_blocks: "https://images.jdmagicbox.com/v2/comp/bangalore/y4/080pxx80.xx80.190212081002.c4y4/catalogue/alpha-sand-hessargatta-main-road-bangalore-solid-block-manufacturers-8dbjjry4ll.jpg",
  m_sand: "https://promaninfi.com/blog/wp-content/uploads/2023/05/blog1.jpg",
  p_sand: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzNWZqhryg8SPbAcTqmTNCBPkeVDKe9EMWA&s",

  m10: "https://5.imimg.com/data5/SELLER/Default/2024/2/382641584/OP/IQ/JG/193365696/m10-grade-ready-mixed-concrete.jpg",
  m15: "https://dev-13sqft.s3.ap-south-1.amazonaws.com/vendor-list/1716024664Screenshot2024-05-18at2.58.24PM.webp",
  m20: "https://5.imimg.com/data5/SELLER/Default/2024/1/376516631/SL/ZJ/DK/147104263/m20-grade-ready-mix-concrete-500x500.jpg",
  m25: "https://www.ultratechcement.com/content/ultratechcement/in/en/home/for-homebuilders/home-building-explained-single/descriptive-articles/how-to-calculate-m25-concrete-mix-ratio/_jcr_content/root/container/container_1646056284/teaser.coreimg.jpeg/1718362325658/m25-concrete-1.jpeg",
  m30: "https://5.imimg.com/data5/SELLER/Default/2025/6/516560952/AJ/YM/YR/77288737/m30-grade-ready-mix-concrete.jpg",
  m40: "https://images.jdmagicbox.com/quickquotes/images_main/grey-ready-mix-concrete-m40-2226324702-pmnmw8xw.png",

  agg_12mm: "https://5.imimg.com/data5/SELLER/Default/2024/12/473932942/YK/VU/PD/236367330/12mm-construction-aggregate-500x500.jpg",
  agg_20mm: "https://5.imimg.com/data5/SELLER/Default/2025/1/479230402/BO/ZF/LF/121088787/20mm-construction-aggregate-500x500.jpg",
  agg_40mm: "https://5.imimg.com/data5/SELLER/Default/2024/6/425395951/MB/RJ/HE/36154456/40-mm-construction-aggregate.jpg",

  anchor: "https://m.media-amazon.com/images/I/71Dul7vevzL.jpg",
  gm_box: "https://5.imimg.com/data5/SELLER/Default/2021/11/BY/MT/QU/32717440/gm-10ka-g-vault-mcb-box-500x500.jpg",

  teak: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGjRM0pPog-HisTIjpQm_NNvGQ7SC7wmxXg&s",
  nigerian_teak: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTZd5f8oyv_cfLHaO9dkacKKEldzUIAZs-nQ&s",
  burma: "https://sinopro.ae/files/inventory/790_648468_CaribTeak-S4S-FEQ-Burmese-Teak-Wood-e1530125946869.jpg",
  nati: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qdq6MBt9UfBWqrb3u_LCnSWycY8E3IlPww&s",

  finolex: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqj54jCqpsmT1MR-PdRNoXX157Q9dmliinw&s",
  polycab: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOonXPAGv1Ab8TDK0e3cMFSz8kDYBNdWdDYQ&s",
  havells_wire: "https://www.gauryog.in/image/cache/catalog/Havells/Wires/Lifeline-Yellow-Pic1-600x600.jpg",
  v_gaurd: "https://5.imimg.com/data5/SELLER/Default/2024/12/477552676/DE/TB/EW/230961617/superio-plus.png",

  lisa: "https://5.imimg.com/data5/SELLER/Default/2022/5/HD/YT/XF/37663009/lisha-copper-bronze-lighting-switch.jpg",
  hi_fi_switches: "https://4.imimg.com/data4/FS/DG/NSDMERP-54382157/hifiswitches-250x250.png",
  gm: "https://jainbazaar.in/uploads/850be799f385c90f8d8297d9de2fa34c.jpg",

  home: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSVuHZIAmrjxS6WmL5g3y6YhAf_PB213Gr-bNNCFc6keFxI7FiN7KHjYGwJoUQjp5hn6w&usqp=CAU",
  red_sal: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDfKXTkM7lpuAx5NV4BouOW_ccbNtBqWmR4yD2rZVOH7tX2GiFhItu4b6wNrqdA5MUegs&usqp=CAU",

  ms_grill: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmBOUd2jBHDexRtSV0IEuEvRZJ7yoh7DbyePtk7xQA8cPGxS7WvAJFYDSaFO-fvD0PfjA&usqp=CAU",

  astral: "https://www.bing.com/th/id/OIP.i_wDCxyeThgbDaYFQOJz3AAAAA?w=216&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
  supreme: "https://www.bing.com/th/id/OIP.MkFhhKGNX9JSQKWKCfdjmAHaHa?w=205&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
  ashirvad: "https://www.bing.com/th/id/OIP.5Fn1_11i9EqjdiqtecRsuwHaGd?w=213&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

  camera_wiring: "https://thvnext.bing.com/th/id/OIP.p9_yv9ghxP4UdzttrGQY_gHaFj?w=219&h=150&c=6&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  tv_cable: "https://www.bing.com/th/id/OIP.ZotQx_wtFe7MoQQ7KIotFgHaEf?w=237&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
  ups_cable: "https://www.bing.com/th/id/OIP.4G-5ZdBQcbg9zYIgPRqwUAHaEc?w=230&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

  jaquar: "https://www.bing.com/th/id/OIP.U-Jif2SYF8G6eeiN_8cYsQHaJ5?w=160&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
  parrywar: "https://www.bing.com/th/id/OIP.GhXfBRcnWBSEYXKtQZbnfQHaHa?w=222&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
  d_son: "https://tse1.mm.bing.net/th/id/OIP.5yOr52qjjYwB0pd4KhkgqQAAAA?cb=ucfimgc2&pid=ImgDet&w=179&h=111&c=7&dpr=1.5&o=7&rm=3", 

  asian_apcolite: "https://thvnext.bing.com/th/id/OIP.rFLI3flf941JMYhlJN0DBwHaIN?w=191&h=212&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  asian_apex: "https://thvnext.bing.com/th/id/OIP.GWh9ArJfQWWhKZZPKftXgQHaHa?w=185&h=185&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  premium_emulsion: "https://thvnext.bing.com/th/id/OIP.sIeOyxAfaat4HkP3Cyp5XgHaHa?w=164&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",

  solar_connection: "https://thvnext.bing.com/th/id/OIP.0IDMrYlqm0dfnm2dYf66uwHaE7?w=241&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  geyser: "https://thvnext.bing.com/th/id/OIP.xayVEJ8NXyGiUljCbCKbrAHaHa?w=195&h=196&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  ro_plumbing: "https://thvnext.bing.com/th/id/OIP.38arXXCv_bsGksQozIQVjAHaHa?w=202&h=202&c=7&r=0&o=5&cb=ucfimgc2&dpr=1.5&pid=1.7",

  tiles: "https://www.bing.com/th/id/OIP.L502FzWvyN1oD3B2a1AMWwHaHa?w=197&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
  granate: "https://thvnext.bing.com/th/id/OIP.tKbeDULbwE48QNcQxDMegAHaFj?w=187&h=150&c=6&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  syramic_tiles: "https://thvnext.bing.com/th/id/OIP.PlTO3pHrTJQiC8eZcGOxcgHaE4?w=263&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",

  haling_5mm: "https://thvnext.bing.com/th/id/OIP.OD1tOWiKWI_bM0EZlG--hgHaHa?w=191&h=191&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  topla: "https://thvnext.bing.com/th/id/OIP.OD1tOWiKWI_bM0EZlG--hgHaHa?w=191&h=191&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 

  modren_kitchen: "https://thvnext.bing.com/th/id/OIP.9-dCHPfKCAw7YvkmMNNgaQHaE7?w=263&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  playwood_neam: "https://thvnext.bing.com/th/id/OIP.RUxrDa_OYcbbiL39fLq4JwHaEU?w=353&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
  alluminium_pvc: "https://thvnext.bing.com/th/id/OIP.ZZQoHWcHhrJMvXEvemDXBwAAAA?w=176&h=176&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
};

const ph = (label) =>
  `https://via.placeholder.com/520x300/1f2937/ffffff?text=${encodeURIComponent(label)}`;
const imgOrPH = (key, label) =>
  ITEM_IMAGES[key] && ITEM_IMAGES[key].startsWith("https") ? ITEM_IMAGES[key] : ph(label);

const SubCategories = () => {
  const navigate = useNavigate();

  const baseCategories = useMemo(
    () => [
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
    ],
    []
  );

    const categories = useMemo(
      () =>
        baseCategories.map((c) => {
          switch (c.title) {
            case "Cement":
              return {
                ...c,
                subItems: [
                  { key: "birla_super_53", label: "Birla Super 53 Grade", img: imgOrPH("birla_super_53", "Birla Super 53 Grade") },
                  { key: "ultratech_ppc", label: "Ultratech PPC", img: imgOrPH("ultratech_ppc", "Ultratech PPC") },
                  { key: "ramco_53_43", label: "Ramco 53 & 43", img: imgOrPH("ramco_53_43", "Ramco 53 & 43") },
                  { key: "dalmia", label: "Dalmia", img: imgOrPH("dalmia", "Dalmia") },
                  { key: "acc", label: "ACC", img: imgOrPH("acc", "ACC") },
                  { key: "jsw_53_43", label: "JSW 53 & 43", img: imgOrPH("jsw_53_43", "JSW 53 & 43") },
                ],
              };
            case "Steel":
              return {
                ...c,
                subItems: [
                  { key: "tata", label: "TATA", img: imgOrPH("tata", "TATA") },
                  { key: "jsw", label: "JSW", img: imgOrPH("jsw", "JSW") },
                  { key: "a_1_gold", label: "A-1 GOLD", img: imgOrPH("a_1_gold", "A-1 GOLD") },
                  { key: "sungold", label: "SUNGOLD", img: imgOrPH("sungold", "SUNGOLD") },
                  { key: "sunvik", label: "SUNVIK", img: imgOrPH("sunvik", "SUNVIK") },
                  { key: "turbo", label: "TURBO", img: imgOrPH("turbo", "TURBO") },
                ],
              };
            case "Bricks":
              return {
                ...c,
                subItems: [
                  { key: "solid_blocks", label: "SOLID BLOCKS", img: imgOrPH("solid_blocks", "SOLID BLOCKS") },
                  { key: "red_bricks", label: "RED BRICKS", img: imgOrPH("red_bricks", "RED BRICKS") },
                  { key: "alpha_blocks", label: "ALPHA BLOCKS", img: imgOrPH("alpha_blocks", "ALPHA BLOCKS") },
                ],
              };
            case "Sand":
              return {
                ...c,
                subItems: [
                  { key: "m_sand", label: "M-Sand", img: imgOrPH("m_sand", "M-Sand") },
                  { key: "p_sand", label: "P-Sand", img: imgOrPH("p_sand", "P-Sand") },
                ],
              };
            case "Concrete":
              return {
                ...c,
                subItems: [
                  { key: "m10", label: "M10", img: imgOrPH("m10", "Concrete M10") },
                  { key: "m15", label: "M15", img: imgOrPH("m15", "Concrete M15") },
                  { key: "m20", label: "M20", img: imgOrPH("m20", "Concrete M20") },
                  { key: "m25", label: "M25", img: imgOrPH("m25", "Concrete M25") },
                  { key: "m30", label: "M30", img: imgOrPH("m30", "Concrete M30") },
                  { key: "m40", label: "M40", img: imgOrPH("m40", "Concrete M40") },
                ],
              };
            case "Aggregates":
              return {
                ...c,
                subItems: [
                  { key: "agg_12mm", label: "12 mm", img: imgOrPH("agg_12mm", "Aggregates 12 mm") },
                  { key: "agg_20mm", label: "20 mm", img: imgOrPH("agg_20mm", "Aggregates 20 mm") },
                  { key: "agg_40mm", label: "40 mm", img: imgOrPH("agg_40mm", "Aggregates 40 mm") },
                ],
              };
            case "Electrical Works":
              return {
                ...c,
                subItems: [
                  { key: "anchor", label: "Anchor (Boards/Fixtures)", img: imgOrPH("anchor", "Anchor") },
                  { key: "gm_box", label: "G.M. Box", img: imgOrPH("gm_box", "G.M. Box") },
                ],
              };
            case "Wood":
              return {
                ...c,
                subItems: [
                  { key: "teak", label: "Teak Wood", img: imgOrPH("teak", "Teak Wood") },
                  { key: "nigerian_teak", label: "Nigerian Teak", img: imgOrPH("nigerian_teak", "Nigerian Teak") },
                  { key: "burma", label: "Burma", img: imgOrPH("burma", "Burma") },
                  { key: "nati", label: "Nati", img: imgOrPH("nati", "Nati") },
                ],
              };
            case "Wires":
              return {
                ...c,
                subItems: [
                  { key: "finolex", label: "Finolex", img: imgOrPH("finolex", "Finolex") },
                  { key: "polycab", label: "Polycab", img: imgOrPH("polycab", "Polycab") },
                  { key: "havells_wire", label: "Havells", img: imgOrPH("havells_wire", "Havells") },
                  { key: "v_gaurd", label: "V-Gaurd", img: imgOrPH("v_gaurd", "V-Gaurd") },
                ],
              };
            case "Switches":
              return {
                ...c,
                subItems: [
                  { key: "lisa", label: "Lisa", img: imgOrPH("lisa", "Lisa") },
                  { key: "hi_fi switches", label: "Hi-Fi Switches", img: imgOrPH("hi_fi_switches", "Hi-Fi Switches") },
                  { key: "gm", label: "GM", img: imgOrPH("gm", "GM Switches") },
                ],
              };
            case "Windows":
              return {
                ...c,
                subItems: [
                  { key: "home", label: "Home 5*3,3,4 Structres", img: imgOrPH("home", "Home 5*3,3,4 Structres") },
                  { key: "red_sal", label: "Red Sal", img: imgOrPH("red_sal", "Red Sal") }
                ],
              };
            case "uPVC Windows":
              return {
                ...c,
                subItems: [
                  { key: "ms_grill", label: "MS Grill 12mm", img: imgOrPH("ms_grill", "MS Grill 12mm") }
                ],
              };
            case "Plumbing":
              return {
                ...c,
                subItems: [
                  { key: "astral", label: "Astral", img: imgOrPH("astral", "Astral") },
                  { key: "supreme", label: "Supreme", img: imgOrPH("supreme", "Supreme") },
                  { key: "ashirvad", label: "Ashirvad", img: imgOrPH("ashirvad", "Ashirvad") },
                ],
              };
            case "Electrical":
              return {
                ...c,
                subItems: [
                  { key: "camera_wiring", label: "Camera Wiring", img: imgOrPH("camera_wiring", "Camera Wiring") },
                  { key: "tv_cable", label: "TV Cable", img: imgOrPH("tv_cable", "TV Cable") },
                  { key: "ups_cable", label: "UPS Cable", img: imgOrPH("ups_cable", "UPS Cable") },
                ],
              };
            case "Fitting Items":
              return {
                ...c,
                subItems: [
                  { key: "jaquar", label: "Jaquar", img: imgOrPH("jaquar", "Jaquar") },
                  { key: "parrywar", label: "Parrywar", img: imgOrPH("parrywar", "Parrywar") },
                  { key: "d_son", label: "D son", img: imgOrPH("d_son", "FD son") },
                ],
              };
            case "Painting":
              return {
                ...c,
                subItems: [
                  { key: "asian_apcolite", label: "Asian Paints – Apcolite", img: imgOrPH("asian_apcolite", "Asian Apcolite") },
                  { key: "asian_apex", label: "Asian Paints – Apex", img: imgOrPH("asian_apex", "Asian Apex") },
                  { key: "premium_emulsion", label: "Premium Emulsion", img: imgOrPH("premium_emulsion", "Premium Emulsion") },
                ],
              };
            case "Connection":
              return {
                ...c,
                subItems: [
                  { key: "solar_connection", label: "Solar Connection", img: imgOrPH("solar_connection", "Solar Connection") },
                  { key: "geyser", label: "Geyser Connection", img: imgOrPH("geyser", "Geyser Connection") },
                  { key: "ro_plumbing", label: "RO Plumbing", img: imgOrPH("ro_plumbing", "RO Plumbing") },
                ],
              };
            case "Waterproof (Exterior Works)":
              return {
                ...c,
                subItems: [
                  { key: "tiles", label: "Tiles", img: imgOrPH("tiles", "Tiles") },
                  { key: "granate", label: "Granate", img: imgOrPH("granate", "Granate") },
                  { key: "syramic_tiles", label: "Syramic Tiles", img: imgOrPH("syramic_tiles", "Syramic Tiles") },
                ],
              };
            case "Glass":
              return {
                ...c,
                subItems: [
                  { key: "haling_5mm", label: "Haling Glass 5 mm", img: imgOrPH("haling_5mm", "Haling Glass 5 mm") },
                  { key: "topla", label: "Topla Glass", img: imgOrPH("topla", "Topla Glass") },
                ],
              };
            case "Waterproof (Interior Work)":
              return {
                ...c,
                subItems: [
                  { key: "modren_kitchen", label: "Modren Kitchen", img: imgOrPH("modren_kitchen", "Modren Kitchen") },
                  { key: "playwood_neam", label: "Neam Playwood", img: imgOrPH("playwood_neam", "Neam Playwood") },
                  { key: "alluminium_pvc", label: "Alluminium PVC", img: imgOrPH("alluminium_pvc", "Alluminium PVC") },
                ],
              };
            default:
              return { ...c, subItems: [] };
          }
        }),
      [baseCategories]
    );
  
  // ---------- Selection state (persisted) ----------
  const [selected, setSelected] = useState({}); // { [catId]: { [subKey]: true } }

  // Build array used by Quotation page
  const buildSelectedList = (map = selected) => {
    const out = [];
    categories.forEach((cat) =>
      (cat.subItems || []).forEach((si) => {
        if (map[cat.id]?.[si.key]) out.push({ catId: cat.id, key: si.key, label: si.label });
      })
    );
    return out;
  };

  const persist = (map) =>
    localStorage.setItem("quotationItems", JSON.stringify(buildSelectedList(map)));

  // hydrate from previous session
  useEffect(() => {
    try {
      const raw = localStorage.getItem("quotationItems");
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return;
      const map = {};
      arr.forEach(({ catId, key }) => {
        if (!map[catId]) map[catId] = {};
        map[catId][key] = true;
      });
      setSelected(map);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCat, setModalCat] = useState(null);
  const openModal = (cat) => { setModalCat(cat); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalCat(null); };

  const toggleSelect = (categoryId, subKey) => {
    setSelected((prev) => {
      const catSel = { ...(prev[categoryId] || {}) };
      catSel[subKey] = !catSel[subKey];
      const next = { ...prev, [categoryId]: catSel };
      persist(next);
      return next;
    });
  };

  const selectedCount = (id) => Object.values(selected[id] || {}).filter(Boolean).length;
  const totalSelected = useMemo(
    () => Object.values(selected).reduce((s, m) => s + Object.values(m).filter(Boolean).length, 0),
    [selected]
  );

  return (
    <section className="subcats-section">
      {/* Top-right decorative image only on Sub Categories */}
      <div className="subcats-topimage">
        <img
          src={process.env.PUBLIC_URL + '/assests/img2.png'}
          alt="Decoration"
          loading="lazy"
        />
      </div>
      <div className="subcats-container">
        {/* Top bar button to open quotation */}
        <div className="subcats-topbar">
          <button
            className="btn primary"
            disabled={totalSelected === 0}
            title={totalSelected === 0 ? "Select at least one item" : "Open quotation"}
            onClick={() => navigate("/quotation")}
          >
            View Quotation{totalSelected ? ` (${totalSelected})` : ""}
          </button>
        </div>

        <div className="categories-header">
          <h2 className="categories-title">Explore Building, Construction and Infrastructure</h2>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div className="category-card" key={cat.id}>
              <div className="category-image">
                <img
                  src={cat.image}
                  alt={cat.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x200/003049/ffffff?text=" +
                      encodeURIComponent(cat.title);
                  }}
                />
              </div>

              <div className="category-footer">
                <h3 className="category-title-text">{cat.title}</h3>
                <button className="category-view-btn" onClick={() => openModal(cat)}>
                  View all items{selectedCount(cat.id) ? ` · ${selectedCount(cat.id)} selected` : ""}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={closeModal} title={modalCat?.title || "Items"}>
          <div className="items-grid">
            {(modalCat?.subItems || []).map((it) => {
              const checked = !!selected[modalCat.id]?.[it.key];
              return (
                <button
                  type="button"
                  key={it.key}
                  className={`item-card ${checked ? "item-checked" : ""}`}
                  onClick={() => toggleSelect(modalCat.id, it.key)}
                >
                  <div className="item-imgwrap">
                    <img
                      src={it.img}
                      alt={it.label}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = ph(it.label); }}
                    />
                  </div>
                  <div className="item-meta">
                    <span className="item-name">{it.label}</span>
                    <input type="checkbox" readOnly checked={checked} className="item-checkbox" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="modal-actions">
            <button className="btn ghost" onClick={closeModal}>Close</button>
            <button
              className="btn primary"
              onClick={() => { persist(selected); closeModal(); }}
            >
              Apply
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

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
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card" role="document">
        <div className="modal-head">
          <h3 id="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default SubCategories;
