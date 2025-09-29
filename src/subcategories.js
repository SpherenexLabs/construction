
// // SubCategories.js
// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SubCategories.css";

// /** HTTPS image slots (paste your URLs). */
// const ITEM_IMAGES = {
//   birla_super_53: "https://5.imimg.com/data5/SELLER/Default/2021/5/DN/BV/GG/31498371/birla-super-53-grade-cement-1000x1000.jpg",       // e.g. "https://example.com/birla.jpg"
//   ultratech_ppc: "https://5.imimg.com/data5/SELLER/Default/2024/12/470241748/RL/GK/QO/16423774/ultratech-cement-ppc.jpg",        // ...
//   ramco_53_43: "https://5.imimg.com/data5/SELLER/Default/2025/1/481300437/FN/IX/TR/65622648/ramco-infra-53-grade-cement.jpg",
//   dalmia: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS5jFQZUn2elqx-m2jhjmROFC48NXZtFf2eA&s",
//   acc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ6IkbD5uoya74t0_VVpKXjchl-CIK9PoZWw&s",
//   jsw_53_43: "https://content.jdmagicbox.com/quickquotes/images_main/jsw-opc-53-cement-weight-50-kg-2223391750-7tkq1zx6.jpg?impolicy=queryparam&im=Resize=(360,360),aspect=fit",

//   tata: "https://litrols.com/wp-content/uploads/2023/09/ABB-and-Tata-Steel-Collaborate-to-Explore-Technologies-Aim-to-Reduce-the-Carbon-Footprint-of-Steel-Manufacturing.jpg",
//   jsw: "https://5.imimg.com/data5/SELLER/Default/2022/10/OH/MX/CG/43598357/jsw-neo-tmt-steel-fe-550-500x500.jpg",
//   a_1_gold: "https://www.buildmaadi.com/wp-content/uploads/2019/11/Aone-Steel.jpg",
//   sungold: "https://media.istockphoto.com/id/1063784898/photo/building-armature-steel-bars-stack-on-white-background.jpg?s=612x612&w=0&k=20&c=fW1lo902dN0Oe_H3iSHKhuM9kS5pUOFJrO6Fp-EjH8Y=",
//   sunvik: "https://sunviksteels.com/wp-content/uploads/2025/04/image.png",
//   turbo: "https://5.imimg.com/data5/SELLER/Default/2023/3/MO/JI/MB/84139099/32-mm-turbosteel-tmt-bar-500x500.jpg",

//   solid_blocks: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtEz1XN7yylWtCQQWrj-xgCdDuaTq9-pxuIA&s",
//   red_bricks: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ViWoff7-W09tazJS_eiTmklrPWdhrWnRTA&s",
//   alpha_blocks: "https://images.jdmagicbox.com/v2/comp/bangalore/y4/080pxx80.xx80.190212081002.c4y4/catalogue/alpha-sand-hessargatta-main-road-bangalore-solid-block-manufacturers-8dbjjry4ll.jpg",
//   m_sand: "https://promaninfi.com/blog/wp-content/uploads/2023/05/blog1.jpg",
//   p_sand: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzNWZqhryg8SPbAcTqmTNCBPkeVDKe9EMWA&s",

//   m10: "https://5.imimg.com/data5/SELLER/Default/2024/2/382641584/OP/IQ/JG/193365696/m10-grade-ready-mixed-concrete.jpg",
//   m15: "https://dev-13sqft.s3.ap-south-1.amazonaws.com/vendor-list/1716024664Screenshot2024-05-18at2.58.24PM.webp",
//   m20: "https://5.imimg.com/data5/SELLER/Default/2024/1/376516631/SL/ZJ/DK/147104263/m20-grade-ready-mix-concrete-500x500.jpg",
//   m25: "https://www.ultratechcement.com/content/ultratechcement/in/en/home/for-homebuilders/home-building-explained-single/descriptive-articles/how-to-calculate-m25-concrete-mix-ratio/_jcr_content/root/container/container_1646056284/teaser.coreimg.jpeg/1718362325658/m25-concrete-1.jpeg",
//   m30: "https://5.imimg.com/data5/SELLER/Default/2025/6/516560952/AJ/YM/YR/77288737/m30-grade-ready-mix-concrete.jpg",
//   m40: "https://images.jdmagicbox.com/quickquotes/images_main/grey-ready-mix-concrete-m40-2226324702-pmnmw8xw.png",

//   agg_12mm: "https://5.imimg.com/data5/SELLER/Default/2024/12/473932942/YK/VU/PD/236367330/12mm-construction-aggregate-500x500.jpg",
//   agg_20mm: "https://5.imimg.com/data5/SELLER/Default/2025/1/479230402/BO/ZF/LF/121088787/20mm-construction-aggregate-500x500.jpg",
//   agg_40mm: "https://5.imimg.com/data5/SELLER/Default/2024/6/425395951/MB/RJ/HE/36154456/40-mm-construction-aggregate.jpg",

//   anchor: "https://m.media-amazon.com/images/I/71Dul7vevzL.jpg",
//   gm_box: "https://5.imimg.com/data5/SELLER/Default/2021/11/BY/MT/QU/32717440/gm-10ka-g-vault-mcb-box-500x500.jpg",

//   teak: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGjRM0pPog-HisTIjpQm_NNvGQ7SC7wmxXg&s",
//   nigerian_teak: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTZd5f8oyv_cfLHaO9dkacKKEldzUIAZs-nQ&s",
//   burma: "https://sinopro.ae/files/inventory/790_648468_CaribTeak-S4S-FEQ-Burmese-Teak-Wood-e1530125946869.jpg",
//   nati: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qdq6MBt9UfBWqrb3u_LCnSWycY8E3IlPww&s",

//   finolex: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqj54jCqpsmT1MR-PdRNoXX157Q9dmliinw&s",
//   polycab: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOonXPAGv1Ab8TDK0e3cMFSz8kDYBNdWdDYQ&s",
//   havells_wire: "https://www.gauryog.in/image/cache/catalog/Havells/Wires/Lifeline-Yellow-Pic1-600x600.jpg",
//   v_gaurd: "https://5.imimg.com/data5/SELLER/Default/2024/12/477552676/DE/TB/EW/230961617/superio-plus.png",

//   lisa: "https://5.imimg.com/data5/SELLER/Default/2022/5/HD/YT/XF/37663009/lisha-copper-bronze-lighting-switch.jpg",
//   hi_fi_switches: "https://4.imimg.com/data4/FS/DG/NSDMERP-54382157/hifiswitches-250x250.png",
//   gm: "https://jainbazaar.in/uploads/850be799f385c90f8d8297d9de2fa34c.jpg",

//   home: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSVuHZIAmrjxS6WmL5g3y6YhAf_PB213Gr-bNNCFc6keFxI7FiN7KHjYGwJoUQjp5hn6w&usqp=CAU",
//   red_sal: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDfKXTkM7lpuAx5NV4BouOW_ccbNtBqWmR4yD2rZVOH7tX2GiFhItu4b6wNrqdA5MUegs&usqp=CAU",

//   ms_grill: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmBOUd2jBHDexRtSV0IEuEvRZJ7yoh7DbyePtk7xQA8cPGxS7WvAJFYDSaFO-fvD0PfjA&usqp=CAU",

//   astral: "https://www.bing.com/th/id/OIP.i_wDCxyeThgbDaYFQOJz3AAAAA?w=216&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
//   supreme: "https://www.bing.com/th/id/OIP.MkFhhKGNX9JSQKWKCfdjmAHaHa?w=205&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
//   ashirvad: "https://www.bing.com/th/id/OIP.5Fn1_11i9EqjdiqtecRsuwHaGd?w=213&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

//   camera_wiring: "https://thvnext.bing.com/th/id/OIP.p9_yv9ghxP4UdzttrGQY_gHaFj?w=219&h=150&c=6&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   tv_cable: "https://www.bing.com/th/id/OIP.ZotQx_wtFe7MoQQ7KIotFgHaEf?w=237&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
//   ups_cable: "https://www.bing.com/th/id/OIP.4G-5ZdBQcbg9zYIgPRqwUAHaEc?w=230&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

//   jaquar: "https://www.bing.com/th/id/OIP.U-Jif2SYF8G6eeiN_8cYsQHaJ5?w=160&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
//   parrywar: "https://www.bing.com/th/id/OIP.GhXfBRcnWBSEYXKtQZbnfQHaHa?w=222&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
//   d_son: "https://tse1.mm.bing.net/th/id/OIP.5yOr52qjjYwB0pd4KhkgqQAAAA?cb=ucfimgc2&pid=ImgDet&w=179&h=111&c=7&dpr=1.5&o=7&rm=3", 

//   asian_apcolite: "https://thvnext.bing.com/th/id/OIP.rFLI3flf941JMYhlJN0DBwHaIN?w=191&h=212&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   asian_apex: "https://thvnext.bing.com/th/id/OIP.GWh9ArJfQWWhKZZPKftXgQHaHa?w=185&h=185&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   premium_emulsion: "https://thvnext.bing.com/th/id/OIP.sIeOyxAfaat4HkP3Cyp5XgHaHa?w=164&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",

//   solar_connection: "https://thvnext.bing.com/th/id/OIP.0IDMrYlqm0dfnm2dYf66uwHaE7?w=241&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   geyser: "https://thvnext.bing.com/th/id/OIP.xayVEJ8NXyGiUljCbCKbrAHaHa?w=195&h=196&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   ro_plumbing: "https://thvnext.bing.com/th/id/OIP.38arXXCv_bsGksQozIQVjAHaHa?w=202&h=202&c=7&r=0&o=5&cb=ucfimgc2&dpr=1.5&pid=1.7",

//   tiles: "https://www.bing.com/th/id/OIP.L502FzWvyN1oD3B2a1AMWwHaHa?w=197&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2", 
//   granate: "https://thvnext.bing.com/th/id/OIP.tKbeDULbwE48QNcQxDMegAHaFj?w=187&h=150&c=6&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   syramic_tiles: "https://thvnext.bing.com/th/id/OIP.PlTO3pHrTJQiC8eZcGOxcgHaE4?w=263&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",

//   haling_5mm: "https://thvnext.bing.com/th/id/OIP.OD1tOWiKWI_bM0EZlG--hgHaHa?w=191&h=191&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   topla: "https://thvnext.bing.com/th/id/OIP.OD1tOWiKWI_bM0EZlG--hgHaHa?w=191&h=191&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 

//   modren_kitchen: "https://thvnext.bing.com/th/id/OIP.9-dCHPfKCAw7YvkmMNNgaQHaE7?w=263&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   playwood_neam: "https://thvnext.bing.com/th/id/OIP.RUxrDa_OYcbbiL39fLq4JwHaEU?w=353&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3", 
//   alluminium_pvc: "https://thvnext.bing.com/th/id/OIP.ZZQoHWcHhrJMvXEvemDXBwAAAA?w=176&h=176&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
// };

// const ph = (label) =>
//   `https://via.placeholder.com/520x300/1f2937/ffffff?text=${encodeURIComponent(label)}`;
// const imgOrPH = (key, label) =>
//   ITEM_IMAGES[key] && ITEM_IMAGES[key].startsWith("https") ? ITEM_IMAGES[key] : ph(label);

// const SubCategories = () => {
//   const navigate = useNavigate();

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

//     const categories = useMemo(
//       () =>
//         baseCategories.map((c) => {
//           switch (c.title) {
//             case "Cement":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "birla_super_53", label: "Birla Super 53 Grade", img: imgOrPH("birla_super_53", "Birla Super 53 Grade") },
//                   { key: "ultratech_ppc", label: "Ultratech PPC", img: imgOrPH("ultratech_ppc", "Ultratech PPC") },
//                   { key: "ramco_53_43", label: "Ramco 53 & 43", img: imgOrPH("ramco_53_43", "Ramco 53 & 43") },
//                   { key: "dalmia", label: "Dalmia", img: imgOrPH("dalmia", "Dalmia") },
//                   { key: "acc", label: "ACC", img: imgOrPH("acc", "ACC") },
//                   { key: "jsw_53_43", label: "JSW 53 & 43", img: imgOrPH("jsw_53_43", "JSW 53 & 43") },
//                 ],
//               };
//             case "Steel":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "tata", label: "TATA", img: imgOrPH("tata", "TATA") },
//                   { key: "jsw", label: "JSW", img: imgOrPH("jsw", "JSW") },
//                   { key: "a_1_gold", label: "A-1 GOLD", img: imgOrPH("a_1_gold", "A-1 GOLD") },
//                   { key: "sungold", label: "SUNGOLD", img: imgOrPH("sungold", "SUNGOLD") },
//                   { key: "sunvik", label: "SUNVIK", img: imgOrPH("sunvik", "SUNVIK") },
//                   { key: "turbo", label: "TURBO", img: imgOrPH("turbo", "TURBO") },
//                 ],
//               };
//             case "Bricks":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "solid_blocks", label: "SOLID BLOCKS", img: imgOrPH("solid_blocks", "SOLID BLOCKS") },
//                   { key: "red_bricks", label: "RED BRICKS", img: imgOrPH("red_bricks", "RED BRICKS") },
//                   { key: "alpha_blocks", label: "ALPHA BLOCKS", img: imgOrPH("alpha_blocks", "ALPHA BLOCKS") },
//                 ],
//               };
//             case "Sand":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "m_sand", label: "M-Sand", img: imgOrPH("m_sand", "M-Sand") },
//                   { key: "p_sand", label: "P-Sand", img: imgOrPH("p_sand", "P-Sand") },
//                 ],
//               };
//             case "Concrete":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "m10", label: "M10", img: imgOrPH("m10", "Concrete M10") },
//                   { key: "m15", label: "M15", img: imgOrPH("m15", "Concrete M15") },
//                   { key: "m20", label: "M20", img: imgOrPH("m20", "Concrete M20") },
//                   { key: "m25", label: "M25", img: imgOrPH("m25", "Concrete M25") },
//                   { key: "m30", label: "M30", img: imgOrPH("m30", "Concrete M30") },
//                   { key: "m40", label: "M40", img: imgOrPH("m40", "Concrete M40") },
//                 ],
//               };
//             case "Aggregates":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "agg_12mm", label: "12 mm", img: imgOrPH("agg_12mm", "Aggregates 12 mm") },
//                   { key: "agg_20mm", label: "20 mm", img: imgOrPH("agg_20mm", "Aggregates 20 mm") },
//                   { key: "agg_40mm", label: "40 mm", img: imgOrPH("agg_40mm", "Aggregates 40 mm") },
//                 ],
//               };
//             case "Electrical Works":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "anchor", label: "Anchor (Boards/Fixtures)", img: imgOrPH("anchor", "Anchor") },
//                   { key: "gm_box", label: "G.M. Box", img: imgOrPH("gm_box", "G.M. Box") },
//                 ],
//               };
//             case "Wood":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "teak", label: "Teak Wood", img: imgOrPH("teak", "Teak Wood") },
//                   { key: "nigerian_teak", label: "Nigerian Teak", img: imgOrPH("nigerian_teak", "Nigerian Teak") },
//                   { key: "burma", label: "Burma", img: imgOrPH("burma", "Burma") },
//                   { key: "nati", label: "Nati", img: imgOrPH("nati", "Nati") },
//                 ],
//               };
//             case "Wires":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "finolex", label: "Finolex", img: imgOrPH("finolex", "Finolex") },
//                   { key: "polycab", label: "Polycab", img: imgOrPH("polycab", "Polycab") },
//                   { key: "havells_wire", label: "Havells", img: imgOrPH("havells_wire", "Havells") },
//                   { key: "v_gaurd", label: "V-Gaurd", img: imgOrPH("v_gaurd", "V-Gaurd") },
//                 ],
//               };
//             case "Switches":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "lisa", label: "Lisa", img: imgOrPH("lisa", "Lisa") },
//                   { key: "hi_fi switches", label: "Hi-Fi Switches", img: imgOrPH("hi_fi_switches", "Hi-Fi Switches") },
//                   { key: "gm", label: "GM", img: imgOrPH("gm", "GM Switches") },
//                 ],
//               };
//             case "Windows":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "home", label: "Home 5*3,3,4 Structres", img: imgOrPH("home", "Home 5*3,3,4 Structres") },
//                   { key: "red_sal", label: "Red Sal", img: imgOrPH("red_sal", "Red Sal") }
//                 ],
//               };
//             case "uPVC Windows":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "ms_grill", label: "MS Grill 12mm", img: imgOrPH("ms_grill", "MS Grill 12mm") }
//                 ],
//               };
//             case "Plumbing":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "astral", label: "Astral", img: imgOrPH("astral", "Astral") },
//                   { key: "supreme", label: "Supreme", img: imgOrPH("supreme", "Supreme") },
//                   { key: "ashirvad", label: "Ashirvad", img: imgOrPH("ashirvad", "Ashirvad") },
//                 ],
//               };
//             case "Electrical":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "camera_wiring", label: "Camera Wiring", img: imgOrPH("camera_wiring", "Camera Wiring") },
//                   { key: "tv_cable", label: "TV Cable", img: imgOrPH("tv_cable", "TV Cable") },
//                   { key: "ups_cable", label: "UPS Cable", img: imgOrPH("ups_cable", "UPS Cable") },
//                 ],
//               };
//             case "Fitting Items":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "jaquar", label: "Jaquar", img: imgOrPH("jaquar", "Jaquar") },
//                   { key: "parrywar", label: "Parrywar", img: imgOrPH("parrywar", "Parrywar") },
//                   { key: "d_son", label: "D son", img: imgOrPH("d_son", "FD son") },
//                 ],
//               };
//             case "Painting":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "asian_apcolite", label: "Asian Paints – Apcolite", img: imgOrPH("asian_apcolite", "Asian Apcolite") },
//                   { key: "asian_apex", label: "Asian Paints – Apex", img: imgOrPH("asian_apex", "Asian Apex") },
//                   { key: "premium_emulsion", label: "Premium Emulsion", img: imgOrPH("premium_emulsion", "Premium Emulsion") },
//                 ],
//               };
//             case "Connection":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "solar_connection", label: "Solar Connection", img: imgOrPH("solar_connection", "Solar Connection") },
//                   { key: "geyser", label: "Geyser Connection", img: imgOrPH("geyser", "Geyser Connection") },
//                   { key: "ro_plumbing", label: "RO Plumbing", img: imgOrPH("ro_plumbing", "RO Plumbing") },
//                 ],
//               };
//             case "Waterproof (Exterior Works)":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "tiles", label: "Tiles", img: imgOrPH("tiles", "Tiles") },
//                   { key: "granate", label: "Granate", img: imgOrPH("granate", "Granate") },
//                   { key: "syramic_tiles", label: "Syramic Tiles", img: imgOrPH("syramic_tiles", "Syramic Tiles") },
//                 ],
//               };
//             case "Glass":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "haling_5mm", label: "Haling Glass 5 mm", img: imgOrPH("haling_5mm", "Haling Glass 5 mm") },
//                   { key: "topla", label: "Topla Glass", img: imgOrPH("topla", "Topla Glass") },
//                 ],
//               };
//             case "Waterproof (Interior Work)":
//               return {
//                 ...c,
//                 subItems: [
//                   { key: "modren_kitchen", label: "Modren Kitchen", img: imgOrPH("modren_kitchen", "Modren Kitchen") },
//                   { key: "playwood_neam", label: "Neam Playwood", img: imgOrPH("playwood_neam", "Neam Playwood") },
//                   { key: "alluminium_pvc", label: "Alluminium PVC", img: imgOrPH("alluminium_pvc", "Alluminium PVC") },
//                 ],
//               };
//             default:
//               return { ...c, subItems: [] };
//           }
//         }),
//       [baseCategories]
//     );
  
//   // ---------- Selection state (persisted) ----------
//   const [selected, setSelected] = useState({}); // { [catId]: { [subKey]: true } }

//   // Build array used by Quotation page
//   const buildSelectedList = (map = selected) => {
//     const out = [];
//     categories.forEach((cat) =>
//       (cat.subItems || []).forEach((si) => {
//         if (map[cat.id]?.[si.key]) out.push({ catId: cat.id, key: si.key, label: si.label });
//       })
//     );
//     return out;
//   };

//   const persist = (map) =>
//     localStorage.setItem("quotationItems", JSON.stringify(buildSelectedList(map)));

//   // hydrate from previous session
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       if (!raw) return;
//       const arr = JSON.parse(raw);
//       if (!Array.isArray(arr)) return;
//       const map = {};
//       arr.forEach(({ catId, key }) => {
//         if (!map[catId]) map[catId] = {};
//         map[catId][key] = true;
//       });
//       setSelected(map);
//     } catch {}
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalCat, setModalCat] = useState(null);
//   const openModal = (cat) => { setModalCat(cat); setModalOpen(true); };
//   const closeModal = () => { setModalOpen(false); setModalCat(null); };

//   const toggleSelect = (categoryId, subKey) => {
//     setSelected((prev) => {
//       const catSel = { ...(prev[categoryId] || {}) };
//       catSel[subKey] = !catSel[subKey];
//       const next = { ...prev, [categoryId]: catSel };
//       persist(next);
//       return next;
//     });
//   };

//   const selectedCount = (id) => Object.values(selected[id] || {}).filter(Boolean).length;
//   const totalSelected = useMemo(
//     () => Object.values(selected).reduce((s, m) => s + Object.values(m).filter(Boolean).length, 0),
//     [selected]
//   );

//   return (
//     <section className="subcats-section">
//       {/* Top-right decorative image only on Sub Categories */}
//       <div className="subcats-topimage">
//         <img
//           src={process.env.PUBLIC_URL + '/assests/img2.png'}
//           alt="Decoration"
//           loading="lazy"
//         />
//       </div>
//       <div className="subcats-container">
//         {/* Top bar button to open quotation */}
//         <div className="subcats-topbar">
//           <button
//             className="btn primary"
//             disabled={totalSelected === 0}
//             title={totalSelected === 0 ? "Select at least one item" : "Open quotation"}
//             onClick={() => navigate("/quotation")}
//           >
//             View Quotation{totalSelected ? ` (${totalSelected})` : ""}
//           </button>
//         </div>

//         <div className="categories-header">
//           <h2 className="categories-title">Explore Building, Construction and Infrastructure</h2>
//         </div>

//         <div className="categories-grid">
//           {categories.map((cat) => (
//             <div className="category-card" key={cat.id}>
//               <div className="category-image">
//                 <img
//                   src={cat.image}
//                   alt={cat.title}
//                   onError={(e) => {
//                     e.currentTarget.src =
//                       "https://via.placeholder.com/300x200/003049/ffffff?text=" +
//                       encodeURIComponent(cat.title);
//                   }}
//                 />
//               </div>

//               <div className="category-footer">
//                 <h3 className="category-title-text">{cat.title}</h3>
//                 <button className="category-view-btn" onClick={() => openModal(cat)}>
//                   View all items{selectedCount(cat.id) ? ` · ${selectedCount(cat.id)} selected` : ""}
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <polyline points="9,18 15,12 9,6"></polyline>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <Modal onClose={closeModal} title={modalCat?.title || "Items"}>
//           <div className="items-grid">
//             {(modalCat?.subItems || []).map((it) => {
//               const checked = !!selected[modalCat.id]?.[it.key];
//               return (
//                 <button
//                   type="button"
//                   key={it.key}
//                   className={`item-card ${checked ? "item-checked" : ""}`}
//                   onClick={() => toggleSelect(modalCat.id, it.key)}
//                 >
//                   <div className="item-imgwrap">
//                     <img
//                       src={it.img}
//                       alt={it.label}
//                       loading="lazy"
//                       onError={(e) => { e.currentTarget.src = ph(it.label); }}
//                     />
//                   </div>
//                   <div className="item-meta">
//                     <span className="item-name">{it.label}</span>
//                     <input type="checkbox" readOnly checked={checked} className="item-checkbox" />
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="modal-actions">
//             <button className="btn ghost" onClick={closeModal}>Close</button>
//             <button
//               className="btn primary"
//               onClick={() => { persist(selected); closeModal(); }}
//             >
//               Apply
//             </button>
//           </div>
//         </Modal>
//       )}
//     </section>
//   );
// };

// const Modal = ({ title, children, onClose }) => {
//   const overlayRef = useRef(null);
//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   return (
//     <div
//       className="modal-overlay"
//       ref={overlayRef}
//       onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
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



// // SubCategories.js
// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SubCategories.css";

// /** Optional HTTPS image slots (kept from your build). Missing keys fall back to placeholder. */
// const ITEM_IMAGES = {
//   // Cement brands
//   birla_super_53:
//     "https://5.imimg.com/data5/SELLER/Default/2021/5/DN/BV/GG/31498371/birla-super-53-grade-cement-1000x1000.jpg",
//   ultratech_ppc:
//     "https://5.imimg.com/data5/SELLER/Default/2024/12/470241748/RL/GK/QO/16423774/ultratech-cement-ppc.jpg",
//   ramco_53_43:
//     "https://5.imimg.com/data5/SELLER/Default/2025/1/481300437/FN/IX/TR/65622648/ramco-infra-53-grade-cement.jpg",
//   dalmia:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS5jFQZUn2elqx-m2jhjmROFC48NXZtFf2eA&s",
//   acc:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ6IkbD5uoya74t0_VVpKXjchl-CIK9PoZWw&s",
//   jsw_53_43:
//     "https://content.jdmagicbox.com/quickquotes/images_main/jsw-opc-53-cement-weight-50-kg-2223391750-7tkq1zx6.jpg?impolicy=queryparam&im=Resize=(360,360),aspect=fit",

//   // Steel brands
//   tata:
//     "https://litrols.com/wp-content/uploads/2023/09/ABB-and-Tata-Steel-Collaborate-to-Explore-Technologies-Aim-to-Reduce-the-Carbon-Footprint-of-Steel-Manufacturing.jpg",
//   jsw:
//     "https://5.imimg.com/data5/SELLER/Default/2022/10/OH/MX/CG/43598357/jsw-neo-tmt-steel-fe-550-500x500.jpg",
//   a_1_gold: "https://www.buildmaadi.com/wp-content/uploads/2019/11/Aone-Steel.jpg",
//   sungold:
//     "https://media.istockphoto.com/id/1063784898/photo/building-armature-steel-bars-stack-on-white-background.jpg?s=612x612&w=0&k=20&c=fW1lo902dN0Oe_H3iSHKhuM9kS5pUOFJrO6Fp-EjH8Y=",
//   sunvik: "https://sunviksteels.com/wp-content/uploads/2025/04/image.png",
//   turbo:
//     "https://5.imimg.com/data5/SELLER/Default/2023/3/MO/JI/MB/84139099/32-mm-turbosteel-tmt-bar-500x500.jpg",

//   // Blocks/Bricks/Sand/Aggregates
//   solid_blocks:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtEz1XN7yylWtCQQWrj-xgCdDuaTq9-pxuIA&s",
//   red_bricks:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ViWoff7-W09tazJS_eiTmklrPWdhrWnRTA&s",
//   m_sand: "https://promaninfi.com/blog/wp-content/uploads/2023/05/blog1.jpg",
//   p_sand: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzNWZqhryg8SPbAcTqmTNCBPkeVDKe9EMWA&s",
//   agg_12mm:
//     "https://5.imimg.com/data5/SELLER/Default/2024/12/473932942/YK/VU/PD/236367330/12mm-construction-aggregate-500x500.jpg",
//   agg_20mm:
//     "https://5.imimg.com/data5/SELLER/Default/2025/1/479230402/BO/ZF/LF/121088787/20mm-construction-aggregate-500x500.jpg",
//   agg_40mm:
//     "https://5.imimg.com/data5/SELLER/Default/2024/6/425395951/MB/RJ/HE/36154456/40-mm-construction-aggregate.jpg",

//   // Wood / doors
//   teak:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuGjRM0pPog-HisTIjpQm_NNvGQ7SC7wmxXg&s",
//   nigerian_teak:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTZd5f8oyv_cfLHaO9dkacKKEldzUIAZs-nQ&s",
//   burma:
//     "https://sinopro.ae/files/inventory/790_648468_CaribTeak-S4S-FEQ-Burmese-Teak-Wood-e1530125946869.jpg",
//   nati:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qdq6MBt9UfBWqrb3u_LCnSWycY8E3IlPww&s",

//   // Electrical
//   anchor: "https://m.media-amazon.com/images/I/71Dul7vevzL.jpg",
//   gm_box: "https://5.imimg.com/data5/SELLER/Default/2021/11/BY/MT/QU/32717440/gm-10ka-g-vault-mcb-box-500x500.jpg",
//   finolex:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqj54jCqpsmT1MR-PdRNoXX157Q9dmliinw&s",
//   polycab:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOonXPAGv1Ab8TDK0e3cMFSz8kDYBNdWdDYQ&s",
//   havells_wire:
//     "https://www.gauryog.in/image/cache/catalog/Havells/Wires/Lifeline-Yellow-Pic1-600x600.jpg",

//   // Plumbing
//   astral:
//     "https://www.bing.com/th/id/OIP.i_wDCxyeThgbDaYFQOJz3AAAAA?w=216&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
//   supreme:
//     "https://www.bing.com/th/id/OIP.MkFhhKGNX9JSQKWKCfdjmAHaHa?w=205&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
//   ashirvad:
//     "https://www.bing.com/th/id/OIP.5Fn1_11i9EqjdiqtecRsuwHaGd?w=213&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

//   // Switches
//   lisa:
//     "https://5.imimg.com/data5/SELLER/Default/2022/5/HD/YT/XF/37663009/lisha-copper-bronze-lighting-switch.jpg",
//   hi_fi_switches:
//     "https://4.imimg.com/data4/FS/DG/NSDMERP-54382157/hifiswitches-250x250.png",
//   gm:
//     "https://jainbazaar.in/uploads/850be799f385c90f8d8297d9de2fa34c.jpg",
// };

// const ph = (label) =>
//   `https://via.placeholder.com/520x300/1f2937/ffffff?text=${encodeURIComponent(
//     label
//   )}`;
// const imgOrPH = (key, label) =>
//   ITEM_IMAGES[key] && ITEM_IMAGES[key].startsWith("https")
//     ? ITEM_IMAGES[key]
//     : ph(label);

// const SubCategories = () => {
//   const navigate = useNavigate();

//   /** === CATEGORIES aligned to the PDF (1 → 23) === */
//   const categories = useMemo(
//     () => [
//       // 1. Steel 550 Grade Bars
//       {
//         id: 1,
//         title: "Steel 550 Grade Bars",
//         image:
//           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "tata", label: "TATA Steel (4×16mm + 4×12mm)", img: imgOrPH("tata", "TATA Steel") },
//           { key: "jsw", label: "JSW Steel (4×16mm + 4×12mm)", img: imgOrPH("jsw", "JSW Steel") },
//           { key: "a_1_gold", label: "A-One Gold", img: imgOrPH("a_1_gold", "A-One Gold") },
//           { key: "sungold", label: "Sun Gold", img: imgOrPH("sungold", "Sun Gold") },
//           { key: "turbo", label: "Turbo Steel", img: imgOrPH("turbo", "Turbo Steel") },
//           { key: "sunvik", label: "Sunvik Steel", img: imgOrPH("sunvik", "Sunvik Steel") },
//         ],
//       },

//       // 2. Cement & Concrete Grades
//       {
//         id: 2,
//         title: "Cement & Concrete Grades",
//         image:
//           "https://img.freepik.com/premium-photo/cement-plant-cement-production_406939-10898.jpg",
//         subItems: [
//           { key: "birla_super_53", label: "Birla Super — 53 Grade", img: imgOrPH("birla_super_53", "Birla Super 53") },
//           { key: "ultratech_ppc", label: "UltraTech — PPC", img: imgOrPH("ultratech_ppc", "UltraTech PPC") },
//           { key: "ramco_53_43", label: "Ramco — 53 / 43 / PPC", img: imgOrPH("ramco_53_43", "Ramco 53/43/PPC") },
//           { key: "jsw_53_43", label: "JSW — 53 / 43", img: imgOrPH("jsw_53_43", "JSW 53/43") },
//           { key: "acc", label: "ACC — 53 / 43", img: imgOrPH("acc", "ACC 53/43") },
//           { key: "dalmia", label: "Dalmia — 53 / 43", img: imgOrPH("dalmia", "Dalmia 53/43") },
//           { key: "concrete_m25_footing", label: "Concrete Grade — M25 (Footing)", img: ph("Concrete M25 – Footing") },
//           { key: "concrete_m25_column", label: "Concrete Grade — M25 (Column)", img: ph("Concrete M25 – Column") },
//           { key: "concrete_m25_slab", label: "Concrete Grade — M25 (Slab)", img: ph("Concrete M25 – Slab") },
//           { key: "pcc_m10", label: "PCC Bed — M10", img: ph("PCC Bed M10") },
//         ],
//       },

//       // 3. Blocks & Bricks
//       {
//         id: 3,
//         title: "Blocks & Bricks",
//         image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDuABcGH3vzhNtGZumkSotP7gdUDk_aX334A&s",
//         subItems: [
//           { key: "blocks_8", label: "Blocks — 8 inch", img: imgOrPH("solid_blocks", "8 inch Blocks") },
//           { key: "blocks_6", label: "Blocks — 6 inch", img: imgOrPH("solid_blocks", "6 inch Blocks") },
//           { key: "blocks_4", label: "Blocks — 4 inch", img: imgOrPH("solid_blocks", "4 inch Blocks") },
//           { key: "bricks_wire", label: "Bricks — Red (Wire Cutting)", img: imgOrPH("red_bricks", "Red Bricks (Wire)") },
//           { key: "bricks_solid", label: "Bricks — Red (Solid Branded)", img: imgOrPH("red_bricks", "Red Bricks (Branded)") },
//         ],
//       },

//       // 4. Sand
//       {
//         id: 4,
//         title: "Sand",
//         image:
//           "https://static.vecteezy.com/system/resources/previews/042/654/226/non_2x/ai-generated-desert-sand-dunes-textured-landscape-free-png.png",
//         subItems: [
//           { key: "m_sand", label: "M-Sand — For concrete & block work", img: imgOrPH("m_sand", "M-Sand") },
//           { key: "p_sand", label: "P-Sand — For plastering", img: imgOrPH("p_sand", "P-Sand") },
//         ],
//       },

//       // 5. Aggregates (Jelly)
//       {
//         id: 5,
//         title: "Aggregates (Jelly)",
//         image:
//           "https://rockproducts.com/wp-content/uploads/2023/04/55jlbc_b78fc4f60cf5340e49d2e0637799cf187d016021-1.jpg",
//         subItems: [
//           { key: "agg_12mm", label: "12 mm", img: imgOrPH("agg_12mm", "12 mm Aggregate") },
//           { key: "agg_20mm", label: "20 mm", img: imgOrPH("agg_20mm", "20 mm Aggregate") },
//           { key: "agg_40mm", label: "40 mm", img: imgOrPH("agg_40mm", "40 mm Aggregate") },
//         ],
//       },

//       // 6. Woods, Frames, Pooja Room & Doors
//       {
//         id: 6,
//         title: "Woods, Frames, Pooja Room & Doors",
//         image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "teak_burma", label: "Teak Wood — Burma", img: imgOrPH("burma", "Burma Teak") },
//           { key: "teak_nigeria", label: "Teak Wood — Nigeria", img: imgOrPH("nigerian_teak", "Nigeria Teak") },
//           { key: "teak_nati", label: "Teak Wood — Nati", img: imgOrPH("nati", "Nati Teak") },
//           { key: "honne", label: "Honne Wood", img: ph("Honne Wood") },
//           { key: "readsal", label: "Readsal Wood", img: ph("Readsal Wood") },
//           { key: "need_wood", label: "Need Wood", img: ph("Need Wood") },
//           { key: "alum_grill", label: "Aluminium Window Grill — As per drawing", img: ph("Aluminium Grill") },
//           { key: "upvc_window", label: "uPVC Window — 12 mm MS grill (as per drawing)", img: ph("uPVC Window") },
//           { key: "pooja_door", label: "Pooja Room Door — 5×3, Height 7 ft", img: ph("Pooja Room Door") },
//           { key: "main_door", label: "Main Door", img: ph("Main Door") },
//           { key: "room_door", label: "Room Door — 32 mm", img: ph("Room Door") },
//           { key: "press_door", label: "Press Door", img: ph("Press Door") },
//         ],
//       },

//       // 7. Bathroom Doors
//       {
//         id: 7,
//         title: "Bathroom Doors",
//         image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "bath_pvc", label: "PVC — Solid", img: ph("PVC Door") },
//           { key: "bath_wpc", label: "WPC — Solid", img: ph("WPC Door") },
//         ],
//       },

//       // 8. Electrical (Wall Box)
//       {
//         id: 8,
//         title: "Electrical (Wall Box)",
//         image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "anchor", label: "Anchor", img: imgOrPH("anchor", "Anchor") },
//           { key: "gm_box", label: "GM", img: imgOrPH("gm_box", "GM") },
//         ],
//       },

//       // 9. Electrical Pipes
//       {
//         id: 9,
//         title: "Electrical Pipes",
//         image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "vip_pipe", label: "VIP", img: ph("VIP Pipes") },
//           { key: "finolex_pipe", label: "Finolex", img: imgOrPH("finolex", "Finolex") },
//         ],
//       },

//       // 10. Electrical Wires & Cables
//       {
//         id: 10,
//         title: "Electrical Wires & Cables",
//         image:
//           "https://thumbs.dreamstime.com/b/sparking-electrical-wires-ai-generated-image-two-disconnected-sparks-flying-them-382802919.jpg",
//         subItems: [
//           { key: "polycab_wire", label: "Polycab — Copper Wire", img: imgOrPH("polycab", "Polycab") },
//           { key: "finolex_wire", label: "Finolex — Copper Wire", img: imgOrPH("finolex", "Finolex") },
//           { key: "havells_wire", label: "Havells — Copper Wire", img: imgOrPH("havells_wire", "Havells") },
//           { key: "kel_industries", label: "KEL Industries — Copper Wire", img: ph("KEL Industries") },
//           { key: "star_light", label: "Star Light — Copper Wire", img: ph("Star Light") },
//         ],
//       },

//       // 11. Electrical Switches
//       {
//         id: 11,
//         title: "Electrical Switches",
//         image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "gm_switch", label: "GM", img: imgOrPH("gm", "GM") },
//           { key: "lissa_switch", label: "Lissa", img: imgOrPH("lisa", "Lissa") },
//           { key: "hifi_switch", label: "Hi-Fi", img: imgOrPH("hi_fi_switches", "Hi-Fi") },
//           { key: "romen_switch", label: "Romen", img: ph("Romen") },
//           { key: "cona_switch", label: "Cona", img: ph("Cona") },
//         ],
//       },

//       // 12. Plumbing & Sanitary
//       {
//         id: 12,
//         title: "Plumbing & Sanitary",
//         image:
//           "https://static.vecteezy.com/system/resources/previews/038/813/452/large_2x/ai-generated-beautifulgraphy-for-plumbing-services-advertising-free-photo.jpeg",
//         subItems: [
//           { key: "supreme", label: "Supreme", img: imgOrPH("supreme", "Supreme") },
//           { key: "ashirvad", label: "Ashirvad", img: imgOrPH("ashirvad", "Ashirvad") },
//           { key: "finolex_plumb", label: "Finolex", img: imgOrPH("finolex", "Finolex") },
//           { key: "astral", label: "Astral", img: imgOrPH("astral", "Astral") },
//         ],
//       },

//       // 13. Water Proofing Chemicals (Branded)
//       {
//         id: 13,
//         title: "Water Proofing Chemicals (Branded)",
//         image:
//           "https://img.freepik.com/premium-photo/worker-applying-waterproofing-membrane-rooftop_815570-8045.jpg",
//         subItems: [
//           { key: "fosroc", label: "Fosroc", img: ph("Fosroc") },
//           { key: "bostik", label: "Bostik", img: ph("Bostik") },
//           { key: "star_proof", label: "Star Proof", img: ph("Star Proof") },
//           { key: "pidilite", label: "Pidilite", img: ph("Pidilite") },
//           { key: "myk", label: "MYK", img: ph("MYK") },
//         ],
//       },

//       // 14. Flooring
//       {
//         id: 14,
//         title: "Flooring",
//         image:
//           "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "marble_flooring", label: "Marble — 20 mm — ₹250 / Sqft", img: ph("Marble Flooring") },
//           { key: "granite_flooring", label: "Granite — 20 mm — ₹100 / Sqft", img: ph("Granite Flooring") },
//           { key: "ceramic_tiles", label: "Ceramic / Vitrified Tiles — 9–12 mm — ₹35–₹50 / Sqft", img: ph("Ceramic/Vitrified Tiles") },
//         ],
//       },

//       // 15. Kitchen
//       {
//         id: 15,
//         title: "Kitchen",
//         image:
//           "https://thvnext.bing.com/th/id/OIP.9-dCHPfKCAw7YvkmMNNgaQHaE7?w=263&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
//         subItems: [
//           { key: "kitchen_granite_black_20", label: "Kitchen Slab – Granite (Black, 20 mm)", img: ph("Granite – Black 20mm") },
//           { key: "kitchen_granite_black_40", label: "Kitchen Slab – Granite (Black, 40 mm)", img: ph("Granite – Black 40mm") },
//           { key: "kitchen_granite_green_20", label: "Kitchen Slab – Granite (Green, 20 mm)", img: ph("Granite – Green 20mm") },
//           { key: "kitchen_granite_green_40", label: "Kitchen Slab – Granite (Green, 40 mm)", img: ph("Granite – Green 40mm") },
//           { key: "kitchen_marble", label: "Kitchen Slab – Marble", img: ph("Kitchen Marble") },
//           { key: "kitchen_tiles", label: "Kitchen Tiles", img: ph("Kitchen Tiles") },
//         ],
//       },

//       // 16. Bathroom Fittings & Toilets
//       {
//         id: 16,
//         title: "Bathroom Fittings & Toilets",
//         image:
//           "https://thumbs.dreamstime.com/b/plomo-profesional-que-fija-tuber%C3%ADas-de-suelo-ba%C3%B1o-con-herramientas-en-el-ajuste-servicio-ia-generativa-369170262.jpg",
//         subItems: [
//           { key: "jaguar_wall_mixer", label: "Jaguar — Wall Mixer (₹5,000)", img: ph("Jaguar Wall Mixer") },
//           { key: "jaguar_single_tap", label: "Jaguar — Single Tap (Basic) (₹1,000)", img: ph("Jaguar Single Tap") },
//           { key: "parryware", label: "Parryware", img: ph("Parryware") },
//           { key: "d_son_asian", label: "D-Son Asian", img: ph("D-Son Asian") },
//           { key: "hindware", label: "Hindware", img: ph("Hindware") },
//           { key: "cera", label: "Cera", img: ph("Cera") },
//           { key: "toilet_western", label: "Toilet – Western (Wall Mount)", img: ph("Toilet – Western") },
//           { key: "toilet_single_commode", label: "Toilet – Western (Single commode)", img: ph("Toilet – Western") },
//           { key: "toilet_indian", label: "Toilet – Indian (Standard)", img: ph("Toilet – Indian") },
//         ],
//       },

//       // 17. POP (Plaster of Paris)
//       {
//         id: 17,
//         title: "POP (Plaster of Paris)",
//         image:
//           "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "pvc_pop", label: "PVC POP — Water Proofing", img: ph("PVC POP") },
//           { key: "pop_putty", label: "POP Putty", img: ph("POP Putty") },
//         ],
//       },

//       // 18. Railings & Gate
//       {
//         id: 18,
//         title: "Railings & Gate",
//         image:
//           "https://img.freepik.com/premium-photo/contemporary-riverfront-home-glass-walls-stone-steps-leading-water-sunny-reflection_1342292-9395.jpg",
//         subItems: [
//           { key: "ms_hr", label: "MS — HR Grade", img: ph("MS HR Grade") },
//           { key: "ms_cr", label: "MS — CR Grade", img: ph("MS CR Grade") },
//           { key: "ss_304", label: "SS — 304 Grade", img: ph("SS 304") },
//           { key: "ss_302", label: "SS — 302 Grade", img: ph("SS 302") },
//           { key: "glass_etching", label: "Glass — Etching", img: ph("Glass Etching") },
//           { key: "glass_toughened", label: "Glass — Toughened", img: ph("Glass Toughened") },
//         ],
//       },

//       // 19. Painting / Polish & Wall Putty
//       {
//         id: 19,
//         title: "Painting / Polish & Wall Putty",
//         image:
//           "https://media.istockphoto.com/id/1384317531/photo/before-and-after-of-man-painting-roller-to-reveal-newly-remodeled-room-with-fresh-light-green.jpg?s=612x612&w=0&k=20&c=wF448uWLu7btrsbZedGiIHqHbeu6KxA-YxZOiTkfcMY=",
//         subItems: [
//           // Brand paint systems
//           { key: "asian_ultima", label: "Asian Paints — Ultima", img: ph("Asian – Ultima") },
//           { key: "asian_apex", label: "Asian Paints — Apex", img: ph("Asian – Apex") },
//           { key: "asian_emulsion", label: "Asian Paints — Dr. Emulsion", img: ph("Asian – Dr. Emulsion") },

//           { key: "berger_ultima", label: "Berger — Ultima", img: ph("Berger – Ultima") },
//           { key: "berger_apex", label: "Berger — Apex", img: ph("Berger – Apex") },
//           { key: "berger_emulsion", label: "Berger — Dr. Emulsion", img: ph("Berger – Dr. Emulsion") },

//           { key: "nerolac_ultima", label: "Nerolac — Ultima", img: ph("Nerolac – Ultima") },
//           { key: "nerolac_apex", label: "Nerolac — Apex", img: ph("Nerolac – Apex") },
//           { key: "nerolac_emulsion", label: "Nerolac — Dr. Emulsion", img: ph("Nerolac – Dr. Emulsion") },

//           { key: "indigo_ultima", label: "Indigo — Ultima", img: ph("Indigo – Ultima") },
//           { key: "indigo_apex", label: "Indigo — Apex", img: ph("Indigo – Apex") },
//           { key: "indigo_emulsion", label: "Indigo — Dr. Emulsion", img: ph("Indigo – Dr. Emulsion") },

//           { key: "nippon_ultima", label: "Nippon — Ultima", img: ph("Nippon – Ultima") },
//           { key: "nippon_apex", label: "Nippon — Apex", img: ph("Nippon – Apex") },
//           { key: "nippon_emulsion", label: "Nippon — Dr. Emulsion", img: ph("Nippon – Dr. Emulsion") },

//           { key: "jsw_ultima", label: "JSW — Ultima", img: ph("JSW – Ultima") },
//           { key: "jsw_apex", label: "JSW — Apex", img: ph("JSW – Apex") },
//           { key: "jsw_emulsion", label: "JSW — Dr. Emulsion", img: ph("JSW – Dr. Emulsion") },

//           // Wall Putty
//           { key: "putty_birla", label: "Wall Putty — Birla Super", img: ph("Birla Wall Putty") },
//           { key: "putty_jk", label: "Wall Putty — JK", img: ph("JK Wall Putty") },
//           { key: "putty_asian", label: "Wall Putty — Asian", img: ph("Asian Wall Putty") },
//         ],
//       },

//       // 20. Interior Works
//       {
//         id: 20,
//         title: "Interior Works",
//         image:
//           "https://content-management-files.canva.com/cbd06f5b-e7f3-4537-8e68-72ef597fd668/ai-interior-design_ogimage_2x.png",
//         subItems: [
//           { key: "plywood_branded", label: "Plywood (Branded) — Interior Works", img: ph("Plywood (Branded)") },
//           { key: "aluminium_branded", label: "Aluminium (Branded) — Interior Works", img: ph("Aluminium (Branded)") },
//           { key: "pvc_branded", label: "PVC (Branded) — Interior Works", img: ph("PVC (Branded)") },
//           { key: "modern_kitchen", label: "Modern Kitchen — Modular Setup", img: ph("Modern Kitchen") },
//           { key: "wardrobe", label: "Wardrobe — One Wall per Room", img: ph("Wardrobe") },
//           { key: "tv_unit", label: "TV Unit — Living Room", img: ph("TV Unit") },
//           { key: "dressing_unit", label: "Dressing Unit — Bedroom", img: ph("Dressing Unit") },
//           { key: "utility_area", label: "Utility Area — Storage / Wash Area", img: ph("Utility Area") },
//         ],
//       },

//       // 21. Truss Work
//       {
//         id: 21,
//         title: "Truss Work",
//         image:
//           "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop",
//         subItems: [{ key: "truss_as_per_drawing", label: "As per structural drawing", img: ph("Truss Work") }],
//       },

//       // 22. Elevation Cladding
//       {
//         id: 22,
//         title: "Elevation Cladding",
//         image:
//           "https://img.freepik.com/premium-photo/worker-applying-waterproofing-membrane-rooftop_815570-8045.jpg",
//         subItems: [
//           { key: "clad_stone", label: "Stone — Natural / Cut Stone", img: ph("Stone Cladding") },
//           { key: "clad_bricks", label: "Bricks — Facing / Exposed", img: ph("Brick Cladding") },
//           { key: "clad_wood", label: "Wood — Exterior Grade", img: ph("Wood Cladding") },
//           { key: "clad_concrete", label: "Concrete — Textured / Plain", img: ph("Concrete Cladding") },
//           { key: "clad_metal", label: "Metal — Modern Finish", img: ph("Metal Cladding") },
//           { key: "clad_glass", label: "Glass — Architectural / Toughened", img: ph("Glass Cladding") },
//           { key: "clad_fiber_cement", label: "Fiber Cement — Modern Finish", img: ph("Fiber Cement") },
//         ],
//       },

//       // 23. Extra Items
//       {
//         id: 23,
//         title: "Extra Items",
//         image:
//           "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop",
//         subItems: [
//           { key: "3d_wall_paint", label: "3D Wall Paint — One Wall", img: ph("3D Wall Paint") },
//           { key: "wallpaper", label: "Wallpaper — Decorative", img: ph("Wallpaper") },
//           { key: "geyser", label: "Geyser — 15–20 Ltrs", img: ph("Geyser") },
//           { key: "solar_water_heater", label: "Solar Water Heater — 100–200 Ltrs", img: ph("Solar Water Heater") },
//           { key: "lift", label: "Lift — As per design", img: ph("Lift") },
//           { key: "generator", label: "Generator — As per capacity", img: ph("Generator") },
//           { key: "ac", label: "Air Conditioner (AC) — As per requirement", img: ph("Air Conditioner") },
//           { key: "ups", label: "UPS — As per capacity", img: ph("UPS") },
//           { key: "bath_tub", label: "Bath Tub — Standard", img: ph("Bath Tub") },
//           { key: "light", label: "Light — Standard", img: ph("Light") },
//           { key: "fan", label: "Fan — ₹2500 (Standard)", img: ph("Fan") },
//           { key: "cctv", label: "CCTV — As per site coverage", img: ph("CCTV") },
//         ],
//       },
//     ],
//     []
//   );

//   // ---------- Selection state (persisted) ----------
//   const [selected, setSelected] = useState({}); // { [catId]: { [subKey]: true } }

//   const buildSelectedList = (map = selected) => {
//     const out = [];
//     categories.forEach((cat) =>
//       (cat.subItems || []).forEach((si) => {
//         if (map[cat.id]?.[si.key]) out.push({ catId: cat.id, key: si.key, label: si.label });
//       })
//     );
//     return out;
//   };
//   const persist = (map) =>
//     localStorage.setItem("quotationItems", JSON.stringify(buildSelectedList(map)));

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("quotationItems");
//       if (!raw) return;
//       const arr = JSON.parse(raw);
//       if (!Array.isArray(arr)) return;
//       const map = {};
//       arr.forEach(({ catId, key }) => {
//         if (!map[catId]) map[catId] = {};
//         map[catId][key] = true;
//       });
//       setSelected(map);
//     } catch {}
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalCat, setModalCat] = useState(null);
//   const openModal = (cat) => { setModalCat(cat); setModalOpen(true); };
//   const closeModal = () => { setModalOpen(false); setModalCat(null); };

//   const toggleSelect = (categoryId, subKey) => {
//     setSelected((prev) => {
//       const catSel = { ...(prev[categoryId] || {}) };
//       catSel[subKey] = !catSel[subKey];
//       const next = { ...prev, [categoryId]: catSel };
//       persist(next);
//       return next;
//     });
//   };

//   const selectedCount = (id) => Object.values(selected[id] || {}).filter(Boolean).length;
//   const totalSelected = useMemo(
//     () => Object.values(selected).reduce((s, m) => s + Object.values(m).filter(Boolean).length, 0),
//     [selected]
//   );

//   return (
//     <section className="subcats-section">
//       {/* Decorative header image (unchanged) */}
//       <div className="subcats-topimage">
//         <img src={process.env.PUBLIC_URL + "/assests/img2.png"} alt="Decoration" loading="lazy" />
//       </div>

//       <div className="subcats-container">
//         <div className="subcats-topbar">
//           <button
//             className="btn primary"
//             disabled={totalSelected === 0}
//             title={totalSelected === 0 ? "Select at least one item" : "Open quotation"}
//             onClick={() => navigate("/quotation")}
//           >
//             View Quotation{totalSelected ? ` (${totalSelected})` : ""}
//           </button>
//         </div>

//         <div className="categories-header">
//           <h2 className="categories-title">VRM Materials — Choose by Category</h2>
//         </div>

//         <div className="categories-grid">
//           {categories.map((cat) => (
//             <div className="category-card" key={cat.id}>
//               <div className="category-image">
//                 <img
//                   src={cat.image}
//                   alt={cat.title}
//                   onError={(e) => {
//                     e.currentTarget.src =
//                       "https://via.placeholder.com/300x200/003049/ffffff?text=" +
//                       encodeURIComponent(cat.title);
//                   }}
//                 />
//               </div>

//               <div className="category-footer">
//                 <h3 className="category-title-text">{cat.id}. {cat.title}</h3>
//                 <button className="category-view-btn" onClick={() => openModal(cat)}>
//                   View all items{selectedCount(cat.id) ? ` · ${selectedCount(cat.id)} selected` : ""}
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <polyline points="9,18 15,12 9,6"></polyline>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {modalOpen && (
//         <Modal onClose={closeModal} title={`${modalCat?.id}. ${modalCat?.title || "Items"}`}>
//           <div className="items-grid">
//             {(modalCat?.subItems || []).map((it) => {
//               const checked = !!selected[modalCat.id]?.[it.key];
//               return (
//                 <button
//                   type="button"
//                   key={it.key}
//                   className={`item-card ${checked ? "item-checked" : ""}`}
//                   onClick={() => toggleSelect(modalCat.id, it.key)}
//                 >
//                   <div className="item-imgwrap">
//                     <img
//                       src={it.img}
//                       alt={it.label}
//                       loading="lazy"
//                       onError={(e) => { e.currentTarget.src = ph(it.label); }}
//                     />
//                   </div>
//                   <div className="item-meta">
//                     <span className="item-name">{it.label}</span>
//                     <input type="checkbox" readOnly checked={checked} className="item-checkbox" />
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="modal-actions">
//             <button className="btn ghost" onClick={closeModal}>Close</button>
//             <button className="btn primary" onClick={() => { persist(selected); closeModal(); }}>
//               Apply
//             </button>
//           </div>
//         </Modal>
//       )}
//     </section>
//   );
// };

// const Modal = ({ title, children, onClose }) => {
//   const overlayRef = useRef(null);
//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   return (
//     <div
//       className="modal-overlay"
//       ref={overlayRef}
//       onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
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

/** HTTPS image slots (paste your URLs where empty or where a name is used). */
const ITEM_IMAGES = {
  /* ============= 1) Steel 550 Grade Bars ============= */
  tata:
    "https://litrols.com/wp-content/uploads/2023/09/ABB-and-Tata-Steel-Collaborate-to-Explore-Technologies-Aim-to-Reduce-the-Carbon-Footprint-of-Steel-Manufacturing.jpg",
  jsw:
    "https://5.imimg.com/data5/SELLER/Default/2022/10/OH/MX/CG/43598357/jsw-neo-tmt-steel-fe-550-500x500.jpg",
  a_1_gold:
    "https://i.pinimg.com/736x/40/9b/e9/409be901ba8cf2049f7f9ee5202a9a58.jpg",
  sungold:
    "https://th.bing.com/th/id/OIP.wcOIkl_fyc6UwTF7dFoPIAHaD1?w=319&h=179&c=7&r=0&o=5&pid=1.7",
  turbo:
    "https://5.imimg.com/data5/SELLER/Default/2023/3/MO/JI/MB/84139099/32-mm-turbosteel-tmt-bar-500x500.jpg",
  sunvik: "https://sunviksteels.com/wp-content/uploads/2025/04/image.png",

  /* ============= 2) Cement & Concrete Grades ============= */
  birla_super_53:
    "https://5.imimg.com/data5/SELLER/Default/2021/5/DN/BV/GG/31498371/birla-super-53-grade-cement-1000x1000.jpg",
  ultratech_ppc:
    "https://5.imimg.com/data5/SELLER/Default/2024/12/470241748/RL/GK/QO/16423774/ultratech-cement-ppc.jpg",
  ramco_53_43:
    "https://5.imimg.com/data5/SELLER/Default/2025/1/481300437/FN/IX/TR/65622648/ramco-infra-53-grade-cement.jpg",
  jsw_53_43:
    "https://content.jdmagicbox.com/quickquotes/images_main/jsw-opc-53-cement-weight-50-kg-2223391750-7tkq1zx6.jpg?impolicy=queryparam&im=Resize=(360,360),aspect=fit",
  acc:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ6IkbD5uoya74t0_VVpKXjchl-CIK9PoZWw&s",
  dalmia:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS5jFQZUn2elqx-m2jhjmROFC48NXZtFf2eA&s",
  concrete_m25_footing: "https://5.imimg.com/data5/SELLER/Default/2024/6/427326938/RW/PX/JQ/195861448/m25-grade-ready-mix-concrete-500x500.jpg",
  concrete_m25_column: "https://images.jdmagicbox.com/quickquotes/images_main/m25-grade-ready-mix-concrete-2221010526-4bgppls9.jpg",
  concrete_m25_slab: "https://www.ultratechcement.com/content/ultratechcement/in/en/home/for-homebuilders/home-building-explained-single/descriptive-articles/how-to-calculate-m25-concrete-mix-ratio/_jcr_content/root/container/container_1646056284/teaser.coreimg.jpeg/1718362325658/m25-concrete-1.jpeg",
  pcc_m10: "https://images.jdmagicbox.com/quickquotes/images_main/m10-grade-ready-mix-concrete-2216948244-0g734tkf.jpg",

  /* (legacy set you already had; fine to keep for compatibility) */
  m10:
    "https://5.imimg.com/data5/SELLER/Default/2024/2/382641584/OP/IQ/JG/193365696/m10-grade-ready-mixed-concrete.jpg",
  m15:
    "https://dev-13sqft.s3.ap-south-1.amazonaws.com/vendor-list/1716024664Screenshot2024-05-18at2.58.24PM.webp",
  m20:
    "https://5.imimg.com/data5/SELLER/Default/2024/1/376516631/SL/ZJ/DK/147104263/m20-grade-ready-mix-concrete-500x500.jpg",
  m25:
    "https://www.ultratechcement.com/content/ultratechcement/in/en/home/for-homebuilders/home-building-explained-single/descriptive-articles/how-to-calculate-m25-concrete-mix-ratio/_jcr_content/root/container/container_1646056284/teaser.coreimg.jpeg/1718362325658/m25-concrete-1.jpeg",
  m30:
    "https://5.imimg.com/data5/SELLER/Default/2025/6/516560952/AJ/YM/YR/77288737/m30-grade-ready-mix-concrete.jpg",
  m40:
    "https://images.jdmagicbox.com/quickquotes/images_main/grey-ready-mix-concrete-m40-2226324702-pmnmw8xw.png",

  /* ============= 3) Blocks & Bricks ============= */
  blocks_8: "https://images.jdmagicbox.com/quickquotes/images_main/solid-blocks-8-inch-2217023591-2q2szmyx.jpg",
  blocks_6: "https://th.bing.com/th/id/OIP.1CNj4F-rR1bjBELK7dRZggHaHa?w=172&h=180&c=7&r=0&o=5&pid=1.7",
  blocks_4: "https://th.bing.com/th/id/OIP.WtvODadZXWsGhAX19ingcAAAAA?w=142&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  bricks_wire: "https://th.bing.com/th/id/OIP.icvnXqeEcq-7rl7NuGrJJAHaE8?w=279&h=186&c=7&r=0&o=7&pid=1.7&rm=3",
  bricks_solid: "https://th.bing.com/th/id/OIP.lpNgMazp7bT6InwEk6-CnwHaEJ?w=296&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* (earlier keys kept) */
  solid_blocks:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtEz1XN7yylWtCQQWrj-xgCdDuaTq9-pxuIA&s",
  red_bricks:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ViWoff7-W09tazJS_eiTmklrPWdhrWnRTA&s",
  alpha_blocks:
    "https://images.jdmagicbox.com/v2/comp/bangalore/y4/080pxx80.xx80.190212081002.c4y4/catalogue/alpha-sand-hessargatta-main-road-bangalore-solid-block-manufacturers-8dbjjry4ll.jpg",

  /* ============= 4) Sand ============= */
  m_sand:
    "https://promaninfi.com/blog/wp-content/uploads/2023/05/blog1.jpg",
  p_sand:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzNWZqhryg8SPbAcTqmTNCBPkeVDKe9EMWA&s",

  /* ============= 5) Aggregates (Jelly) ============= */
  agg_12mm:
    "https://5.imimg.com/data5/SELLER/Default/2024/12/473932942/YK/VU/PD/236367330/12mm-construction-aggregate-500x500.jpg",
  agg_20mm:
    "https://5.imimg.com/data5/SELLER/Default/2025/1/479230402/BO/ZF/LF/121088787/20mm-construction-aggregate-500x500.jpg",
  agg_40mm:
    "https://5.imimg.com/data5/SELLER/Default/2024/6/425395951/MB/RJ/HE/36154456/40-mm-construction-aggregate.jpg",

  /* ============= 6) Woods, Frames, Pooja Room & Doors ============= */
  teak_burma:
    "https://sinopro.ae/files/inventory/790_648468_CaribTeak-S4S-FEQ-Burmese-Teak-Wood-e1530125946869.jpg",
  teak_nigeria:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTZd5f8oyv_cfLHaO9dkacKKEldzUIAZs-nQ&s",
  teak_nati:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qdq6MBt9UfBWqrb3u_LCnSWycY8E3IlPww&s",
  honne: "https://th.bing.com/th/id/OIP.jtjtEcG6NHZ1Tx70GhHx_wHaDX?w=338&h=159&c=7&r=0&o=7&pid=1.7&rm=3",
  readsal: "https://th.bing.com/th/id/OIP.2SzAjcxcXjf-GikmuEqFrAHaEK?w=332&h=187&c=7&r=0&o=5&pid=1.7",
  need_wood: "https://th.bing.com/th/id/OIP.1AaOmrBxl29FH-x5lgVVoAHaDt?w=305&h=175&c=7&r=0&o=7&pid=1.7&rm=3",
  alum_grill:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmBOUd2jBHDexRtSV0IEuEvRZJ7yoh7DbyePtk7xQA8cPGxS7WvAJFYDSaFO-fvD0PfjA&usqp=CAU",
  upvc_window: "https://th.bing.com/th/id/OIP.Aln9pr-YtIaBBgoSwX4IWwHaHa?w=181&h=181&c=7&r=0&o=5&pid=1.7",
  pooja_door: "https://th.bing.com/th/id/OIP.vl5iJbIMf4swcGuzxPpLrAHaLe?w=198&h=308&c=7&r=0&o=7&pid=1.7&rm=3",
  main_door: "https://th.bing.com/th/id/OIP.u0HgeZelSVJ9SaG834tjIQHaJ4?w=198&h=264&c=7&r=0&o=7&pid=1.7&rm=3",
  room_door: "https://th.bing.com/th/id/OIP.aL7R51z94TN36WEA-6ESEwHaHa?w=202&h=202&c=7&r=0&o=7&pid=1.7&rm=3",
  press_door: "https://th.bing.com/th/id/OIP.YfBX5TJxfyzYdTJylqOZ7gHaI_?w=115&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 7) Bathroom Doors ============= */
  bath_pvc: "https://tse3.mm.bing.net/th/id/OIP.59Gj7hSYchfV8CgAiQeLdQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3 Door – PVC",
  bath_wpc: "https://th.bing.com/th/id/OIP.LfWh5Ln1iA6Rweemtsvv_QHaJ4?w=198&h=264&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 8) Electrical (Wall Box) ============= */
  anchor: "https://m.media-amazon.com/images/I/71Dul7vevzL.jpg",
  gm_box:
    "https://5.imimg.com/data5/SELLER/Default/2021/11/BY/MT/QU/32717440/gm-10ka-g-vault-mcb-box-500x500.jpg",

  /* ============= 9) Electrical Pipes ============= */
  vip_pipe: "https://en.lesso.com/blogs/wp-content/uploads/2021/06/why-use-conduit-for-electrical-wiring.jpg",
  finolex_pipe: "https://th.bing.com/th/id/OIP.NtQTCuOYxAydiTIJF4KX_wHaEP?w=273&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 10) Electrical Wires & Cables ============= */
  polycab_wire:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOonXPAGv1Ab8TDK0e3cMFSz8kDYBNdWdDYQ&s",
  finolex_wire:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqj54jCqpsmT1MR-PdRNoXX157Q9dmliinw&s",
  havells_wire:
    "https://www.gauryog.in/image/cache/catalog/Havells/Wires/Lifeline-Yellow-Pic1-600x600.jpg",
  kel_industries: "https://th.bing.com/th/id/OIP.c84mlD2CA9ZaevdSt5uq-QHaE7?w=283&h=189&c=7&r=0&o=7&pid=1.7&rm=3",
  star_light: "https://th.bing.com/th?q=Wire+and+Cable+Box+Design&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",

  /* ============= 11) Electrical Switches ============= */
  gm_switch:
    "https://jainbazaar.in/uploads/850be799f385c90f8d8297d9de2fa34c.jpg",
  lissa_switch:
    "https://5.imimg.com/data5/SELLER/Default/2022/5/HD/YT/XF/37663009/lisha-copper-bronze-lighting-switch.jpg",
  hifi_switch:
    "https://4.imimg.com/data4/FS/DG/NSDMERP-54382157/hifiswitches-250x250.png",
  romen_switch: "https://th.bing.com/th/id/OIP.X2QRq720YIvQlDao2BjGMQHaHY?w=186&h=185&c=7&r=0&o=7&pid=1.7&rm=3",
  cona_switch: "https://th.bing.com/th/id/OIP.9t_bq2f3A7_tlmdrQzJ0egHaHa?w=172&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 12) Plumbing & Sanitary ============= */
  supreme:
    "https://www.bing.com/th/id/OIP.MkFhhKGNX9JSQKWKCfdjmAHaHa?w=205&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  ashirvad:
    "https://www.bing.com/th/id/OIP.5Fn1_11i9EqjdiqtecRsuwHaGd?w=213&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  finolex_plumb: "https://th.bing.com/th/id/OIP.NtQTCuOYxAydiTIJF4KX_wHaEP?w=273&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  astral:
    "https://www.bing.com/th/id/OIP.i_wDCxyeThgbDaYFQOJz3AAAAA?w=216&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",

  /* ============= 13) Water Proofing Chemicals (Branded) ============= */
  fosroc: "https://th.bing.com/th/id/OIP.lvbMUvX0EnAI_sgGszpeMgHaHa?w=200&h=200&c=7&r=0&o=7&pid=1.7&rm=3",
  bostik: "https://th.bing.com/th/id/OIP.1gQTcS1oydYTlBaHvbQixQHaHa?w=166&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  star_proof: "https://th.bing.com/th/id/OIP.qnpW1Pp60_DgerSBjHoZNwAAAA?w=166&h=200&c=7&r=0&o=7&pid=1.7&rm=3",
  pidilite: "https://th.bing.com/th/id/OIP.Rds6fDaH5XiBdR1DjffQ3gHaEK?w=305&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  myk: "https://th.bing.com/th/id/OIP.7CXkkpcjD3G0e-hBtQ2PCwHaD8?w=338&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 14) Flooring ============= */
  marble_flooring: "https://th.bing.com/th/id/OIP.aBa_1oDZQPjmMmjWakEiGwHaE8?w=295&h=197&c=7&r=0&o=7&pid=1.7&rm=3",
  granite_flooring: "https://th.bing.com/th/id/OIP.axGoUU4EweRUH9Ck2Mx4QAHaEK?w=308&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  ceramic_tiles: "https://th.bing.com/th/id/OIP.-FmQouqP8WUmhI933f0QbgAAAA?w=271&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 15) Kitchen ============= */
  kitchen_granite_black_20: "https://th.bing.com/th/id/OIP.oi8MSGWJdHDaPEKfXO0tKQHaEt?w=263&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  kitchen_granite_black_40: "https://th.bing.com/th/id/OIP.UogAsRvq6kxucUlfPiOlUAHaHa?w=216&h=216&c=7&r=0&o=7&pid=1.7&rm=3",
  kitchen_granite_green_20: "https://th.bing.com/th/id/OIP.iqASOd2Hkw9PgyZ2m6mcJwHaE7?w=286&h=190&c=7&r=0&o=7&pid=1.7&rm=3",
  kitchen_granite_green_40: "https://th.bing.com/th/id/OIP.jBKq8KC5OUo2U3oYJra5-QHaHa?w=156&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  kitchen_marble: "https://th.bing.com/th/id/OIP.DCaLRUv0Mj-HXnyjELVx3AHaEq?w=228&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  kitchen_tiles: "https://th.bing.com/th/id/OIP.QKNGsY_dweulez5wTY-6lwHaE8?w=195&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 16) Bathroom Fittings & Toilets ============= */
  jaguar_wall_mixer:
    "https://www.bing.com/th/id/OIP.U-Jif2SYF8G6eeiN_8cYsQHaJ5?w=160&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  jaguar_single_tap:
    "https://www.bing.com/th/id/OIP.U-Jif2SYF8G6eeiN_8cYsQHaJ5?w=160&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  parryware:
    "https://www.bing.com/th/id/OIP.GhXfBRcnWBSEYXKtQZbnfQHaHa?w=222&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
  d_son_asian:
    "https://tse1.mm.bing.net/th/id/OIP.5yOr52qjjYwB0pd4KhkgqQAAAA?cb=ucfimgc2&pid=ImgDet&w=179&h=111&c=7&dpr=1.5&o=7&rm=3",
  hindware: "https://th.bing.com/th/id/OIP.8gV0eMO6zQr2Zz8O3mTOOAHaEK?w=299&h=180&c=7&r=0&o=5&pid=1.7",
  cera: "https://th.bing.com/th/id/OIP.7maRmV1bJm9TuklrkllYAAHaEn?w=231&h=180&c=7&r=0&o=5&pid=1.7",
  toilet_western: "https://th.bing.com/th/id/OIP._92QFJNcGVW6JGg2X1G-ngHaD0?w=322&h=179&c=7&r=0&o=7&pid=1.7&rm=3",
  toilet_single_commode: "https://th.bing.com/th/id/OIP.xCMCGbxVjtJNaFVJE1jouwAAAA?w=172&h=184&c=7&r=0&o=5&pid=1.7",
  toilet_indian: "https://5.imimg.com/data5/SELLER/Default/2022/10/XM/WW/NL/99081048/cera-indian-toilet-sheet-500x500.jpg",

  /* ============= 17) POP (Plaster of Paris) ============= */
  pvc_pop: "https://th.bing.com/th/id/OIP.RmoaZ_2W_4uBsRamGswsUgHaEL?w=272&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  pop_putty: "https://th.bing.com/th/id/OIP.-e1XInLW9JLVw94ma0IpZQAAAA?w=172&h=176&c=7&r=0&o=5&pid=1.7",

  /* ============= 18) Railings & Gate ============= */
  ms_hr: "https://th.bing.com/th/id/OIP.LhQFdSaNKAAt9P-23USlRwHaDe?w=335&h=164&c=7&r=0&o=7&pid=1.7&rm=3",
  ms_cr: "https://th.bing.com/th/id/OIP.lQijEXLN1PCrCjavSotfrgHaFj?w=246&h=184&c=7&r=0&o=7&pid=1.7&rm=3",
  ss_304: "https://th.bing.com/th/id/OIP.G2zdAoF-DfLn3liTf0C4rAHaFd?w=284&h=208&c=7&r=0&o=7&pid=1.7&rm=3",
  ss_302: "https://th.bing.com/th/id/OIP.-5e5XfPg8eMmuQei_hkyZwHaDC?w=346&h=143&c=7&r=0&o=7&pid=1.7&rm=3",
  glass_etching: "https://th.bing.com/th/id/OIP.n92qIz4gFdFVMjVpAjs-OQHaEI?w=306&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  glass_toughened: "https://th.bing.com/th/id/OIP.cPOQZHKTGRtAGollYgGdbwHaHk?w=185&h=189&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 19) Painting / Polish & Wall Putty ============= */
  asian_ultima:
    "https://thvnext.bing.com/th/id/OIP.rFLI3flf941JMYhlJN0DBwHaIN?w=191&h=212&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
  asian_apex:
    "https://thvnext.bing.com/th/id/OIP.GWh9ArJfQWWhKZZPKftXgQHaHa?w=185&h=185&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
  asian_emulsion:
    "https://thvnext.bing.com/th/id/OIP.sIeOyxAfaat4HkP3Cyp5XgHaHa?w=164&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
  berger_ultima: "https://th.bing.com/th/id/OIP.Us9yz96P-h4SnNwwOXFv0AHaGG?w=200&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  berger_apex: "https://th.bing.com/th/id/OIP.r0WLDMCvxSm6ns-i3rLITgHaD2?w=327&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  berger_emulsion: "https://th.bing.com/th/id/OIP.3OSKoLdRTBayh8kjcYVk-gHaHe?w=185&h=187&c=7&r=0&o=7&pid=1.7&rm=3",
  nerolac_ultima: "https://th.bing.com/th/id/OIP.2ppkBOYXjbRqEFXT_KCBqAHaHa?w=179&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  nerolac_apex: "https://th.bing.com/th/id/OIP.lw78Kzn-eeDxQk_NnWn3DAAAAA?w=124&h=180&c=7&r=0&o=5&pid=1.7",
  nerolac_emulsion: "https://th.bing.com/th/id/OIP.Nz1KPJjmr6Db5vMfv_33tAHaFj?w=268&h=200&c=7&r=0&o=5&pid=1.7",
  indigo_ultima: "https://th.bing.com/th/id/OIP.X-PkE0G80Ad9EpTRdbqjbQAAAA?w=148&h=185&c=7&r=0&o=7&pid=1.7&rm=3",
  indigo_apex: "https://th.bing.com/th/id/OIP.X-PkE0G80Ad9EpTRdbqjbQAAAA?w=148&h=185&c=7&r=0&o=7&pid=1.7&rm=3",
  indigo_emulsion: "https://th.bing.com/th/id/OIP.-DggS978JYy-pWapVcLLAAAAAA?w=198&h=248&c=7&r=0&o=7&pid=1.7&rm=3",
  nippon_ultima: "https://th.bing.com/th/id/OIP.SPYDPGk5WXvNR78_qABSxgHaDL?w=308&h=180&c=7&r=0&o=5&pid=1.7",
  nippon_apex: "https://th.bing.com/th/id/OIP.9Ek16gxno59AjjLWFKcbuwHaIy?w=148&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  nippon_emulsion: "https://5.imimg.com/data5/SELLER/Default/2024/10/457319044/AU/LZ/LH/10421392/nippon-roof-coating-emulsion-paint-1000x1000.jpg",
  jsw_ultima: "https://th.bing.com/th/id/OIP.5CAsoEEGWVbGpZ9UmKO8SwHaJ4?w=95&h=180&c=7&r=0&o=5&pid=1.7",
  jsw_apex: "https://th.bing.com/th/id/OIP.L16AkPFAlvn29mNlGrRQYAAAAA?w=234&h=148&c=7&r=0&o=7&pid=1.7&rm=3",
  jsw_emulsion: "https://th.bing.com/th/id/OIP.rTp9WtHXz5UlTDmrh-gA5AHaFr?w=89&h=90&c=1&rs=1&qlt=70&r=0&o=7&pid=InlineBlock&rm=3",
  wall_putty_birla: "https://th.bing.com/th/id/OIP.AU1yZgTHdhuja6TRMf7D7wHaHa?w=198&h=198&c=7&r=0&o=7&pid=1.7&rm=3",
  wall_putty_jk: "https://th.bing.com/th/id/OIP.imbuTxRvpHha-XF4HgEe-wHaHa?w=202&h=203&c=7&r=0&o=7&pid=1.7&rm=3",
  wall_putty_asian: "https://th.bing.com/th/id/OIP.JEcuDJiVxGZA9DBy71fazQHaJz?w=139&h=184&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 20) Interior Works ============= */
  int_plywood: "https://th.bing.com/th/id/OIP.50rjsbib2y7PKcapvb4EewHaGP?w=216&h=181&c=7&r=0&o=7&pid=1.7&rm=3",
  int_aluminium: "https://th.bing.com/th/id/OIP.rAzQIe76IaAMwMNHH4TKGwHaFj?w=189&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  int_pvc: "https://th.bing.com/th/id/OIP.RnrYeSYgiGSc89PJFEj6VwHaFj?w=228&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  int_modern_kitchen: "https://th.bing.com/th/id/OIP.KAISbamM5CqfVNo_5T4TjgHaFP?w=258&h=183&c=7&r=0&o=7&pid=1.7&rm=3",
  int_wardrobe: "https://th.bing.com/th/id/OIP.mEsllLUFghNpC2jihHJh7QHaEn?w=247&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  int_tv_unit: "https://th.bing.com/th/id/OIP.u6ACbEXs_LnvmszgGi-PAQHaFj?w=242&h=182&c=7&r=0&o=7&pid=1.7&rm=3",
  int_dressing_unit: "https://th.bing.com/th/id/OIP.UJCgTuKv_i0BfOCPfWPPlAHaFj?w=219&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  int_utility: "https://th.bing.com/th/id/OIP.eTJKF0S-cOBJVaQK4wjT_AHaEK?w=300&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 21) Truss Work ============= */
  truss_work: "https://th.bing.com/th/id/OIP.G-EPJvjCH0UiSdvnChit5AHaFL?w=216&h=180&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 22) Elevation Cladding ============= */
  clad_stone: "https://th.bing.com/th/id/OIP.Db5l9hpaZDh4s-rDifirYAHaE7?w=236&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  clad_bricks: "https://th.bing.com/th/id/OIP.CuvjTA8fSTWxDwJ4KiiX5AHaJ4?w=168&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  clad_wood: "https://th.bing.com/th/id/OIP.RHTtbkuM4YoRzWRxepNYDAHaHa?w=174&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  clad_concrete: "https://th.bing.com/th/id/OIP.YCFRPxPxlPe7Q44wDDXkjAHaE8?w=266&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  clad_metal: "https://th.bing.com/th/id/OIP.Nc58qQqu5w8cP65eOb0aNgHaDS?w=289&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  clad_glass: "https://th.bing.com/th/id/OIP.koMpbMo_vnYpYXCOL-_pmAHaDa?w=328&h=161&c=7&r=0&o=7&pid=1.7&rm=3",
  clad_fiber_cement: "https://th.bing.com/th/id/OIP.f8hFSRBDo0DNchrIg5adQwHaE8?w=241&h=181&c=7&r=0&o=7&pid=1.7&rm=3",

  /* ============= 23) Extra Items ============= */
  extra_3d_wall_paint: "https://smooth-apricot-ooxv8mxdfo.edgeone.app/e15f51a2-7102-4973-b594-3e0a574b6031.jpg",
  extra_wallpaper: "https://th.bing.com/th/id/OIP.G7ESB1PytO_HG1XWxwRsvwHaEK?w=375&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_geyser: "https://th.bing.com/th/id/OIP.y7OZec_DSoHxj1yW4Ebo1QAAAA?w=121&h=180&c=7&r=0&o=5&pid=1.7",
  extra_solar_water_heater: "https://th.bing.com/th/id/OIP.h3e8DaqatgKV39MvzOY57AHaFj?w=297&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_lift: "https://th.bing.com/th/id/OIP.rjVAcLLJABeUz1zbSWjJ4wHaFg?w=235&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_generator: "https://th.bing.com/th/id/OIP.5E-NjGKPfTSupl2XsZbCYAHaE5?w=286&h=189&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_ac: "https://th.bing.com/th/id/OIP.8LhJ0CaWyhQ7s2zxlZZ3hAHaE8?w=291&h=194&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_ups: "https://th.bing.com/th/id/OIP.qh4uimuFdbX0v3JUnFtgrQHaE7?w=249&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_bath_tub: "https://th.bing.com/th/id/OIP.sDL-Zl_6lc_PC3XyEDR3hAHaE8?w=232&h=181&c=7&r=0&o=5&pid=1.7",
  extra_light: "https://th.bing.com/th/id/OIP.xT5n7NkLKQuIkAlLryyzuAHaHa?w=214&h=214&c=7&r=0&o=5&pid=1.7",
  extra_fan: "https://th.bing.com/th/id/OIP.beGaajU6vdXG7wVrCqnRlwHaHa?w=212&h=212&c=7&r=0&o=7&pid=1.7&rm=3",
  extra_cctv: "https://th.bing.com/th/id/OIP.tCwFYXxASfdVJ3WleeqWHwHaEg?w=259&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
};

/* Placeholders: if no HTTPS url, show a simple labeled placeholder */
const ph = (label) =>
  `https://via.placeholder.com/520x300/1f2937/ffffff?text=${encodeURIComponent(
    label
  )}`;
const imgOrPH = (key, label) =>
  ITEM_IMAGES[key] && ITEM_IMAGES[key].startsWith("http")
    ? ITEM_IMAGES[key]
    : ph(label);

const SubCategories = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Debug mount log to verify first navigation renders the component
    console.log('[SubCategories] mounted');
  }, []);

  /** Category list ordered exactly like your document (1 → 23). */
  const categories = useMemo(
    () => [
      /* 1 */ {
        id: 1,
        title: "Steel 550 Grade Bars",
        image:
          "https://media.istockphoto.com/id/1063784898/photo/building-armature-steel-bars-stack-on-white-background.jpg?s=612x612&w=0&k=20&c=fW1lo902dN0Oe_H3iSHKhuM9kS5pUOFJrO6Fp-EjH8Y=",
        subItems: [
          { key: "tata", label: "Tata Steel", img: imgOrPH("tata", "Tata Steel") },
          { key: "jsw", label: "JSW Steel", img: imgOrPH("jsw", "JSW Steel") },
          { key: "a_1_gold", label: "A-One Gold", img: imgOrPH("a_1_gold", "A-One Gold") },
          { key: "sungold", label: "Sun Gold", img: imgOrPH("sungold", "Sun Gold") },
          { key: "turbo", label: "Turbo Steel", img: imgOrPH("turbo", "Turbo Steel") },
          { key: "sunvik", label: "Sunvik Steel", img: imgOrPH("sunvik", "Sunvik Steel") },
        ],
      },

      /* 2 */ {
        id: 2,
        title: "Cement & Concrete Grades",
        image:
          "https://lirp.cdn-website.com/bc4439fa/dms3rep/multi/opt/Portland+Cement-1920w.jpg",
        subItems: [
          { key: "birla_super_53", label: "Birla Super (53)", img: imgOrPH("birla_super_53", "Birla Super 53") },
          { key: "ultratech_ppc", label: "UltraTech (PPC)", img: imgOrPH("ultratech_ppc", "UltraTech PPC") },
          { key: "ramco_53_43", label: "Ramco (53/43)", img: imgOrPH("ramco_53_43", "Ramco 53/43") },
          { key: "jsw_53_43", label: "JSW (53/43)", img: imgOrPH("jsw_53_43", "JSW 53/43") },
          { key: "acc", label: "ACC", img: imgOrPH("acc", "ACC") },
          { key: "dalmia", label: "Dalmia", img: imgOrPH("dalmia", "Dalmia") },
          { key: "concrete_m25_footing", label: "M25 — Footing", img: imgOrPH("concrete_m25_footing", "M25 Footing") },
          { key: "concrete_m25_column", label: "M25 — Column", img: imgOrPH("concrete_m25_column", "M25 Column") },
          { key: "concrete_m25_slab", label: "M25 — Slab", img: imgOrPH("concrete_m25_slab", "M25 Slab") },
          { key: "pcc_m10", label: "PCC Bed — M10", img: imgOrPH("pcc_m10", "PCC M10") },
        ],
      },

      /* 3 */ {
        id: 3,
        title: "Blocks & Bricks",
        image:
          "https://images.jdmagicbox.com/v2/comp/bangalore/y4/080pxx80.xx80.190212081002.c4y4/catalogue/alpha-sand-hessargatta-main-road-bangalore-solid-block-manufacturers-8dbjjry4ll.jpg",
        subItems: [
          { key: "blocks_8", label: "Blocks — 8 inch", img: imgOrPH("blocks_8", "Blocks 8 inch") },
          { key: "blocks_6", label: "Blocks — 6 inch", img: imgOrPH("blocks_6", "Blocks 6 inch") },
          { key: "blocks_4", label: "Blocks — 4 inch", img: imgOrPH("blocks_4", "Blocks 4 inch") },
          { key: "bricks_wire", label: "Red Bricks (Wire Cutting)", img: imgOrPH("bricks_wire", "Red Bricks (Wire)") },
          { key: "bricks_solid", label: "Red Bricks (Solid Branded)", img: imgOrPH("bricks_solid", "Red Bricks (Solid)") },
        ],
      },

      /* 4 */ {
        id: 4,
        title: "Sand",
        image:
          "https://promaninfi.com/blog/wp-content/uploads/2023/05/blog1.jpg",
        subItems: [
          { key: "m_sand", label: "M-Sand", img: imgOrPH("m_sand", "M-Sand") },
          { key: "p_sand", label: "P-Sand", img: imgOrPH("p_sand", "P-Sand") },
        ],
      },

      /* 5 */ {
        id: 5,
        title: "Aggregates (Jelly)",
        image:
          "https://5.imimg.com/data5/SELLER/Default/2024/12/473932942/YK/VU/PD/236367330/12mm-construction-aggregate-500x500.jpg",
        subItems: [
          { key: "agg_12mm", label: "12 mm", img: imgOrPH("agg_12mm", "12 mm Aggregates") },
          { key: "agg_20mm", label: "20 mm", img: imgOrPH("agg_20mm", "20 mm Aggregates") },
          { key: "agg_40mm", label: "40 mm", img: imgOrPH("agg_40mm", "40 mm Aggregates") },
        ],
      },

      /* 6 */ {
        id: 6,
        title: "Woods, Frames, Pooja Room & Doors",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qdq6MBt9UfBWqrb3u_LCnSWycY8E3IlPww&s",
        subItems: [
          { key: "teak_burma", label: "Teak Wood – Burma", img: imgOrPH("teak_burma", "Burma Teak") },
          { key: "teak_nigeria", label: "Teak Wood – Nigeria", img: imgOrPH("teak_nigeria", "Nigeria Teak") },
          { key: "teak_nati", label: "Teak Wood – Nati", img: imgOrPH("teak_nati", "Nati Teak") },
          { key: "honne", label: "Honne Wood", img: imgOrPH("honne", "Honne Wood") },
          { key: "readsal", label: "Readsal Wood", img: imgOrPH("readsal", "Readsal Wood") },
          { key: "need_wood", label: "Need Wood", img: imgOrPH("need_wood", "Need Wood") },
          { key: "alum_grill", label: "Aluminium Window Grill (MS 12 mm)", img: imgOrPH("alum_grill", "MS 12mm Grill") },
          { key: "upvc_window", label: "uPVC Window", img: imgOrPH("upvc_window", "uPVC Window") },
          { key: "pooja_door", label: "Pooja Room Door (Teak)", img: imgOrPH("pooja_door", "Pooja Room Door") },
          { key: "main_door", label: "Main Door (Carving / Plain)", img: imgOrPH("main_door", "Main Door") },
          { key: "room_door", label: "Room Door — 32 mm", img: imgOrPH("room_door", "Room Door 32mm") },
          { key: "press_door", label: "Press Door (Veneer Top End)", img: imgOrPH("press_door", "Press Door") },
        ],
      },

      /* 7 */ {
        id: 7,
        title: "Bathroom Doors",
        image: "https://tse3.mm.bing.net/th/id/OIP.59Gj7hSYchfV8CgAiQeLdQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
        subItems: [
          { key: "bath_pvc", label: "PVC", img: imgOrPH("bath_pvc", "PVC Bathroom Door") },
          { key: "bath_wpc", label: "WPC", img: imgOrPH("bath_wpc", "WPC Bathroom Door") },
        ],
      },

      /* 8 */ {
        id: 8,
        title: "Electrical (Wall Box)",
        image: "https://5.imimg.com/data5/SELLER/Default/2022/5/HD/YT/XF/37663009/lisha-copper-bronze-lighting-switch.jpg",
        subItems: [
          { key: "anchor", label: "Anchor", img: imgOrPH("anchor", "Anchor") },
          { key: "gm_box", label: "GM", img: imgOrPH("gm_box", "GM") },
        ],
      },

      /* 9 */ {
        id: 9,
        title: "Electrical Pipes",
        image: "https://th.bing.com/th/id/OIP.R9QKztBisxylODEyFjL4nwHaFj?w=252&h=189&c=7&r=0&o=7&pid=1.7&rm=3",
        subItems: [
          { key: "vip_pipe", label: "VIP", img: imgOrPH("vip_pipe", "VIP") },
          { key: "finolex_pipe", label: "Finolex", img: imgOrPH("finolex_pipe", "Finolex") },
        ],
      },

      /* 10 */ {
        id: 10,
        title: "Electrical Wires & Cables",
        image: "https://thumbs.dreamstime.com/b/sparking-electrical-wires-ai-generated-image-two-disconnected-sparks-flying-them-382802919.jpg",
        subItems: [
          { key: "polycab_wire", label: "Polycab", img: imgOrPH("polycab_wire", "Polycab") },
          { key: "finolex_wire", label: "Finolex", img: imgOrPH("finolex_wire", "Finolex") },
          { key: "havells_wire", label: "Havells", img: imgOrPH("havells_wire", "Havells") },
          { key: "kel_industries", label: "KEL Industries", img: imgOrPH("kel_industries", "KEL Industries") },
          { key: "star_light", label: "Star Light", img: imgOrPH("star_light", "Star Light") },
        ],
      },

      /* 11 */ {
        id: 11,
        title: "Electrical Switches",
        image: "https://jainbazaar.in/uploads/850be799f385c90f8d8297d9de2fa34c.jpg",
        subItems: [
          { key: "gm_switch", label: "GM", img: imgOrPH("gm_switch", "GM Switch") },
          { key: "lissa_switch", label: "Lissa", img: imgOrPH("lissa_switch", "Lissa Switch") },
          { key: "hifi_switch", label: "Hi-Fi", img: imgOrPH("hifi_switch", "Hi-Fi Switch") },
          { key: "romen_switch", label: "Romen", img: imgOrPH("romen_switch", "Romen Switch") },
          { key: "cona_switch", label: "Cona", img: imgOrPH("cona_switch", "Cona Switch") },
        ],
      },

      /* 12 */ {
        id: 12,
        title: "Plumbing & Sanitary",
        image:
          "https://www.bing.com/th/id/OIP.MkFhhKGNX9JSQKWKCfdjmAHaHa?w=205&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
        subItems: [
          { key: "supreme", label: "Supreme", img: imgOrPH("supreme", "Supreme") },
          { key: "ashirvad", label: "Ashirvad", img: imgOrPH("ashirvad", "Ashirvad") },
          { key: "finolex_plumb", label: "Finolex", img: imgOrPH("finolex_plumb", "Finolex") },
          { key: "astral", label: "Astral", img: imgOrPH("astral", "Astral") },
        ],
      },

      /* 13 */ {
        id: 13,
        title: "Water Proofing Chemicals (Branded)",
        image:
          "https://img.freepik.com/premium-photo/worker-applying-waterproofing-membrane-rooftop_815570-8045.jpg",
        subItems: [
          { key: "fosroc", label: "Fosroc", img: imgOrPH("fosroc", "Fosroc") },
          { key: "bostik", label: "Bostik", img: imgOrPH("bostik", "Bostik") },
          { key: "star_proof", label: "Star Proof", img: imgOrPH("star_proof", "Star Proof") },
          { key: "pidilite", label: "Pidilite", img: imgOrPH("pidilite", "Pidilite") },
          { key: "myk", label: "MYK", img: imgOrPH("myk", "MYK") },
        ],
      },

      /* 14 */ {
        id: 14,
        title: "Flooring",
        image:
          "https://www.raisedfloor.co.uk/wp-content/uploads/elementor/thumbs/insitu-concrete-floor-slabs-p3qax9xej6wi7kcfr2szi1rsrdnp1tyxncxj195h6w.jpg",
        subItems: [
          { key: "marble_flooring", label: "Marble Flooring", img: imgOrPH("marble_flooring", "Marble Flooring") },
          { key: "granite_flooring", label: "Granite Flooring", img: imgOrPH("granite_flooring", "Granite Flooring") },
          { key: "ceramic_tiles", label: "Ceramic / Vitrified Tiles", img: imgOrPH("ceramic_tiles", "Ceramic / Vitrified Tiles") },
        ],
      },

      /* 15 */ {
        id: 15,
        title: "Kitchen",
        image:
          "https://thvnext.bing.com/th/id/OIP.9-dCHPfKCAw7YvkmMNNgaQHaE7?w=263&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3",
        subItems: [
          { key: "kitchen_granite_black_20", label: "Granite – Black 20 mm", img: imgOrPH("kitchen_granite_black_20", "Granite Black 20mm") },
          { key: "kitchen_granite_black_40", label: "Granite – Black 40 mm", img: imgOrPH("kitchen_granite_black_40", "Granite Black 40mm") },
          { key: "kitchen_granite_green_20", label: "Granite – Green 20 mm", img: imgOrPH("kitchen_granite_green_20", "Granite Green 20mm") },
          { key: "kitchen_granite_green_40", label: "Granite – Green 40 mm", img: imgOrPH("kitchen_granite_green_40", "Granite Green 40mm") },
          { key: "kitchen_marble", label: "Kitchen Slab – Marble", img: imgOrPH("kitchen_marble", "Kitchen Marble") },
          { key: "kitchen_tiles", label: "Kitchen Tiles", img: imgOrPH("kitchen_tiles", "Kitchen Tiles") },
        ],
      },

      /* 16 */ {
        id: 16,
        title: "Bathroom Fittings & Toilets",
        image:
          "https://thumbs.dreamstime.com/b/plomo-profesional-que-fija-tuber%C3%ADas-de-suelo-ba%C3%B1o-con-herramientas-en-el-ajuste-servicio-ia-generativa-369170262.jpg",
        subItems: [
          { key: "jaguar_wall_mixer", label: "Jaquar – Wall Mixer", img: imgOrPH("jaguar_wall_mixer", "Jaquar Wall Mixer") },
          { key: "jaguar_single_tap", label: "Jaquar – Single Tap (Basic)", img: imgOrPH("jaguar_single_tap", "Jaquar Single Tap") },
          { key: "parryware", label: "Parryware", img: imgOrPH("parryware", "Parryware") },
          { key: "d_son_asian", label: "D-Son Asian", img: imgOrPH("d_son_asian", "D-Son Asian") },
          { key: "hindware", label: "Hindware", img: imgOrPH("hindware", "Hindware") },
          { key: "cera", label: "Cera", img: imgOrPH("cera", "Cera") },
          { key: "toilet_western", label: "Toilet – Western", img: imgOrPH("toilet_western", "Toilet Western") },
          { key: "toilet_single_commode", label: "Toilet – Single Commode", img: imgOrPH("toilet_single_commode", "Single Commode") },
          { key: "toilet_indian", label: "Toilet – Indian", img: imgOrPH("toilet_indian", "Toilet Indian") },
        ],
      },

      /* 17 */ {
        id: 17,
        title: "POP (Plaster of Paris)",
        image:
          "https://decorcity.com.ng/wp-content/uploads/2020/01/Residential-Interior-and-Exterior-finish-at-Mowe-Ibafo-by-Decor-City-Nigeria-005.jpg",
        subItems: [
          { key: "pvc_pop", label: "PVC POP", img: imgOrPH("pvc_pop", "PVC POP") },
          { key: "pop_putty", label: "POP Putty", img: imgOrPH("pop_putty", "POP Putty") },
        ],
      },

      /* 18 */ {
        id: 18,
        title: "Railings & Gate",
        image:
          "https://th.bing.com/th/id/OIP.ITfpYUZzDQLvdfNzY4NZrQHaFi?w=179&h=180&c=7&r=0&o=5&pid=1.7",
        subItems: [
          { key: "ms_hr", label: "MS – HR Grade", img: imgOrPH("ms_hr", "MS HR") },
          { key: "ms_cr", label: "MS – CR Grade", img: imgOrPH("ms_cr", "MS CR") },
          { key: "ss_304", label: "SS – 304 Grade", img: imgOrPH("ss_304", "SS 304") },
          { key: "ss_302", label: "SS – 302 Grade", img: imgOrPH("ss_302", "SS 302") },
          { key: "glass_etching", label: "Glass – Etching", img: imgOrPH("glass_etching", "Glass Etching") },
          { key: "glass_toughened", label: "Glass – Toughened", img: imgOrPH("glass_toughened", "Glass Toughened") },
        ],
      },

      /* 19 */ {
        id: 19,
        title: "Painting / Polish & Wall Putty",
        image:
          "https://media.istockphoto.com/id/1384317531/photo/before-and-after-of-man-painting-roller-to-reveal-newly-remodeled-room-with-fresh-light-green.jpg?s=612x612&w=0&k=20&c=wF448uWLu7btrsbZedGiIHqHbeu6KxA-YxZOiTkfcMY=",
        subItems: [
          { key: "asian_ultima", label: "Asian Paints – Ultima", img: imgOrPH("asian_ultima", "Asian Ultima") },
          { key: "asian_apex", label: "Asian Paints – Apex", img: imgOrPH("asian_apex", "Asian Apex") },
          { key: "asian_emulsion", label: "Asian – Dr. Emulsion", img: imgOrPH("asian_emulsion", "Asian Emulsion") },
          { key: "berger_ultima", label: "Berger – Ultima", img: imgOrPH("berger_ultima", "Berger Ultima") },
          { key: "berger_apex", label: "Berger – Apex", img: imgOrPH("berger_apex", "Berger Apex") },
          { key: "berger_emulsion", label: "Berger – Dr. Emulsion", img: imgOrPH("berger_emulsion", "Berger Emulsion") },
          { key: "nerolac_ultima", label: "Nerolac – Ultima", img: imgOrPH("nerolac_ultima", "Nerolac Ultima") },
          { key: "nerolac_apex", label: "Nerolac – Apex", img: imgOrPH("nerolac_apex", "Nerolac Apex") },
          { key: "nerolac_emulsion", label: "Nerolac – Dr. Emulsion", img: imgOrPH("nerolac_emulsion", "Nerolac Emulsion") },
          { key: "indigo_ultima", label: "Indigo – Ultima", img: imgOrPH("indigo_ultima", "Indigo Ultima") },
          { key: "indigo_apex", label: "Indigo – Apex", img: imgOrPH("indigo_apex", "Indigo Apex") },
          { key: "indigo_emulsion", label: "Indigo – Dr. Emulsion", img: imgOrPH("indigo_emulsion", "Indigo Emulsion") },
          { key: "nippon_ultima", label: "Nippon – Ultima", img: imgOrPH("nippon_ultima", "Nippon Ultima") },
          { key: "nippon_apex", label: "Nippon – Apex", img: imgOrPH("nippon_apex", "Nippon Apex") },
          { key: "nippon_emulsion", label: "Nippon – Dr. Emulsion", img: imgOrPH("nippon_emulsion", "Nippon Emulsion") },
          { key: "jsw_ultima", label: "JSW – Ultima", img: imgOrPH("jsw_ultima", "JSW Ultima") },
          { key: "jsw_apex", label: "JSW – Apex", img: imgOrPH("jsw_apex", "JSW Apex") },
          { key: "jsw_emulsion", label: "JSW – Dr. Emulsion", img: imgOrPH("jsw_emulsion", "JSW Emulsion") },
          { key: "wall_putty_birla", label: "Wall Putty – Birla Super", img: imgOrPH("wall_putty_birla", "Birla Wall Putty") },
          { key: "wall_putty_jk", label: "Wall Putty – JK", img: imgOrPH("wall_putty_jk", "JK Wall Putty") },
          { key: "wall_putty_asian", label: "Wall Putty – Asian", img: imgOrPH("wall_putty_asian", "Asian Wall Putty") },
        ],
      },

      /* 20 */ {
        id: 20,
        title: "Interior Works",
        image:
          "https://content-management-files.canva.com/cbd06f5b-e7f3-4537-8e68-72ef597fd668/ai-interior-design_ogimage_2x.png",
        subItems: [
          { key: "int_plywood", label: "Plywood (Branded)", img: imgOrPH("int_plywood", "Plywood (Branded)") },
          { key: "int_aluminium", label: "Aluminium (Branded)", img: imgOrPH("int_aluminium", "Aluminium (Branded)") },
          { key: "int_pvc", label: "PVC (Branded)", img: imgOrPH("int_pvc", "PVC (Branded)") },
          { key: "int_modern_kitchen", label: "Modern Kitchen", img: imgOrPH("int_modern_kitchen", "Modern Kitchen") },
          { key: "int_wardrobe", label: "Wardrobe", img: imgOrPH("int_wardrobe", "Wardrobe") },
          { key: "int_tv_unit", label: "TV Unit", img: imgOrPH("int_tv_unit", "TV Unit") },
          { key: "int_dressing_unit", label: "Dressing Unit", img: imgOrPH("int_dressing_unit", "Dressing Unit") },
          { key: "int_utility", label: "Utility Area", img: imgOrPH("int_utility", "Utility Area") },
        ],
      },

      /* 21 */ {
        id: 21,
        title: "Truss Work",
        image: "https://th.bing.com/th/id/OIP.bZcRXNHSOzxaTnplcV3ISQHaFj?w=232&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
        subItems: [{ key: "truss_work", label: "As per structural drawing", img: imgOrPH("truss_work", "Truss Work") }],
      },

      /* 22 */ {
        id: 22,
        title: "Elevation Cladding",
        image: "https://th.bing.com/th/id/OIP.NP_jukDI4S4RiH78zbdNQgAAAA?w=184&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
        subItems: [
          { key: "clad_stone", label: "Stone", img: imgOrPH("clad_stone", "Stone Cladding") },
          { key: "clad_bricks", label: "Bricks", img: imgOrPH("clad_bricks", "Brick Cladding") },
          { key: "clad_wood", label: "Wood", img: imgOrPH("clad_wood", "Wood Cladding") },
          { key: "clad_concrete", label: "Concrete", img: imgOrPH("clad_concrete", "Concrete Cladding") },
          { key: "clad_metal", label: "Metal", img: imgOrPH("clad_metal", "Metal Cladding") },
          { key: "clad_glass", label: "Glass", img: imgOrPH("clad_glass", "Glass Cladding") },
          { key: "clad_fiber_cement", label: "Fiber Cement", img: imgOrPH("clad_fiber_cement", "Fiber Cement Cladding") },
        ],
      },

      /* 23 */ {
        id: 23,
        title: "Extra Items",
        image: "https://smooth-apricot-ooxv8mxdfo.edgeone.app/e15f51a2-7102-4973-b594-3e0a574b6031.jpg",
        subItems: [
          { key: "extra_3d_wall_paint", label: "3D Wall Paint (One Wall)", img: imgOrPH("extra_3d_wall_paint", "3D Wall Paint") },
          { key: "extra_wallpaper", label: "Wallpaper (Decorative)", img: imgOrPH("extra_wallpaper", "Wallpaper") },
          { key: "extra_geyser", label: "Geyser (15–20 Ltrs)", img: imgOrPH("extra_geyser", "Geyser") },
          { key: "extra_solar_water_heater", label: "Solar Water Heater (100–200 Ltrs)", img: imgOrPH("extra_solar_water_heater", "Solar Water Heater") },
          { key: "extra_lift", label: "Lift (As per design)", img: imgOrPH("extra_lift", "Lift") },
          { key: "extra_generator", label: "Generator (As per capacity)", img: imgOrPH("extra_generator", "Generator") },
          { key: "extra_ac", label: "Air Conditioner (As per requirement)", img: imgOrPH("extra_ac", "Air Conditioner") },
          { key: "extra_ups", label: "UPS (As per capacity)", img: imgOrPH("extra_ups", "UPS") },
          { key: "extra_bath_tub", label: "Bath Tub (Standard)", img: imgOrPH("extra_bath_tub", "Bath Tub") },
          { key: "extra_light", label: "Light (Standard)", img: imgOrPH("extra_light", "Light") },
          { key: "extra_fan", label: "Fan (₹2500 Standard)", img: imgOrPH("extra_fan", "Fan") },
          { key: "extra_cctv", label: "CCTV (As per site coverage)", img: imgOrPH("extra_cctv", "CCTV") },
        ],
      },
    ],
    []
  );

  // ---------- Selection state (persisted) ----------
  const [selected, setSelected] = useState({}); // { [catId]: { [subKey]: true } }

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
    <section className="subcats-section" style={{minHeight:'100vh'}}>
      {/* Page header is rendered by SubCategories.css */}
      {/* Top-right decorative image (letterhead) */}
      <div className="subcats-topimage">
        <img
          src={process.env.PUBLIC_URL + "/assests/img2.png"}
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
          {categories.length === 0 && (
            <div style={{padding:16, background:'#fff', border:'1px solid #e5e7eb', borderRadius:8}}>
              No categories found. Please reload the page.
            </div>
          )}
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

