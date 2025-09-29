// Categories.js
import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: 'Cement',
      image: 'https://lirp.cdn-website.com/bc4439fa/dms3rep/multi/opt/Portland+Cement-1920w.jpg',
      description: 'Birla Super, UltraTech, Ramco, JSW, ACC, Dalmia, etc.'
    },
    {
      id: 2,
      title: 'Concrete Grade',
      image: 'https://images.jdmagicbox.com/quickquotes/images_main/m25-grade-ready-mix-concrete-2221010526-4bgppls9.jpg',
      description: 'M25 (Footing/Column/Slab), PCC Bed M10, etc.'
    },
    {
      id: 3,
      title: 'Steel',
      image: 'https://media.istockphoto.com/id/1063784898/photo/building-armature-steel-bars-stack-on-white-background.jpg?s=612x612&w=0&k=20&c=fW1lo902dN0Oe_H3iSHKhuM9kS5pUOFJrO6Fp-EjH8Y=',
      description: 'Steel bars and structural materials'
    },
    {
      id: 4,
      title: 'Bricks',
      image: 'https://images.jdmagicbox.com/v2/comp/bangalore/y4/080pxx80.xx80.190212081002.c4y4/catalogue/alpha-sand-hessargatta-main-road-bangalore-solid-block-manufacturers-8dbjjry4ll.jpg',
      description: 'Premium quality construction bricks'
    },
    {
      id: 5,
      title: 'Sand',
      image: 'https://promaninfi.com/blog/wp-content/uploads/2023/05/blog1.jpg',
      description: 'Construction grade sand'
    },
    {
      id: 6,
      title: 'Aggregates',
      image: 'https://5.imimg.com/data5/SELLER/Default/2024/12/473932942/YK/VU/PD/236367330/12mm-construction-aggregate-500x500.jpg',
      description: 'Stone and gravel aggregates'
    },
    {
      id: 7,
      title: 'Electrical Works',
      image: 'https://5.imimg.com/data5/SELLER/Default/2022/5/HD/YT/XF/37663009/lisha-copper-bronze-lighting-switch.jpg',
      description: 'Complete electrical solutions'
  // ...existing code for other categories...
    },
    {
      id: 9,
      title: 'Wires',
      image: 'https://thumbs.dreamstime.com/b/sparking-electrical-wires-ai-generated-image-two-disconnected-sparks-flying-them-382802919.jpg',
      description: 'Electrical wiring solutions'
    },
    {
      id: 10,
      title: 'Switches',
      image: 'https://jainbazaar.in/uploads/850be799f385c90f8d8297d9de2fa34c.jpg',
      description: 'Electrical switches and controls'
    },
    {
      id: 11,
      title: 'Windows',
      image: 'https://th.bing.com/th/id/OIP.YoaAGum9vnkokJVImDez-QHaE8?w=279&h=186&c=7&r=0&o=5&pid=1.7',
      description: 'Window frames and installations'
    },
    {
      id: 12,
      title: 'UPC Windows',
      image: 'https://img.freepik.com/premium-photo/outdoor-upvc-windows_636493-8.jpg',
      description: 'UPC window solutions'
    },
    {
      id: 13,
      title: 'Plumbing',
      image: 'https://www.bing.com/th/id/OIP.MkFhhKGNX9JSQKWKCfdjmAHaHa?w=205&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
      description: 'Plumbing fixtures and fittings'
    },
    {
      id: 14,
      title: 'Electrical',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqj54jCqpsmT1MR-PdRNoXX157Q9dmliinw&s',
      description: 'Electrical components and systems'
    },
    {
      id: 15,
      title: 'Fitting Items',
      image: 'https://thumbs.dreamstime.com/b/plomo-profesional-que-fija-tuber%C3%ADas-de-suelo-ba%C3%B1o-con-herramientas-en-el-ajuste-servicio-ia-generativa-369170262.jpg',
      description: 'Hardware and fitting accessories'
    },
    {
      id: 16,
      title: 'Painting',
      image: 'https://media.istockphoto.com/id/1384317531/photo/before-and-after-of-man-painting-roller-to-reveal-newly-remodeled-room-with-fresh-light-green.jpg?s=612x612&w=0&k=20&c=wF448uWLu7btrsbZedGiIHqHbeu6KxA-YxZOiTkfcMY=',
      description: 'Paints and painting materials'
    },
    {
      id: 17,
      title: 'Connection',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      description: 'Connection and joining materials'
    },
    {
      id: 18,
      title: 'Waterproof',
      image: 'https://img.freepik.com/premium-photo/worker-applying-waterproofing-membrane-rooftop_815570-8045.jpg',
      description: 'Waterproofing solutions'
    },
    {
      id: 19,
      title: 'Glass',
      image: 'https://th.bing.com/th/id/OIP.sk0LW7QQBJ66ghQMKyaqNgHaE2?w=277&h=182&c=7&r=0&o=7&pid=1.7&rm=3',
      description: 'Glass panels and installations'
    },
    {
      id: 20,
      title: 'Waterproof Interior Work',
      image: 'https://content-management-files.canva.com/cbd06f5b-e7f3-4537-8e68-72ef597fd668/ai-interior-design_ogimage_2x.png',
      description: 'Interior waterproofing services'
    }
  ];

  const handleCategoryClick = (category) => {
    console.log('Selected category:', category.title);
    // Add your category navigation logic here
  };

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2 className="categories-title">Explore Building, Construction and Infrastructure</h2>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.title}
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/300x200/003049/ffffff?text=' +
                      encodeURIComponent(category.title);
                  }}
                />
              </div>

              <div className="category-footer">
                <h3 className="category-title-text">{category.title}</h3>
                <span className="category-chevron" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;