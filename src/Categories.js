// Categories.js
import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: 'Cement',
      image: 'https://img.freepik.com/premium-photo/cement-plant-cement-production_406939-10898.jpg',
      description: 'High-quality cement for construction'
    },
    {
      id: 2,
      title: 'Steel',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      description: 'Steel bars and structural materials'
    },
    {
      id: 3,
      title: 'Bricks',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDuABcGH3vzhNtGZumkSotP7gdUDk_aX334A&s',
      description: 'Premium quality construction bricks'
    },
    {
      id: 4,
      title: 'Sand',
      image: 'https://static.vecteezy.com/system/resources/previews/042/654/226/non_2x/ai-generated-desert-sand-dunes-textured-landscape-free-png.png',
      description: 'Construction grade sand'
    },
    {
      id: 5,
      title: 'Concrete',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
      description: 'Ready-mix concrete solutions'
    },
    {
      id: 6,
      title: 'Aggregates',
      image: 'https://rockproducts.com/wp-content/uploads/2023/04/55jlbc_b78fc4f60cf5340e49d2e0637799cf187d016021-1.jpg',
      description: 'Stone and gravel aggregates'
    },
    {
      id: 7,
      title: 'Electrical Works',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop',
      description: 'Complete electrical solutions'
    },
    {
      id: 8,
      title: 'Wood',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
      description: 'Timber and wooden materials'
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
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      description: 'Electrical switches and controls'
    },
    {
      id: 11,
      title: 'Windows',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
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
      image: 'https://static.vecteezy.com/system/resources/previews/038/813/452/large_2x/ai-generated-beautifulgraphy-for-plumbing-services-advertising-free-photo.jpeg',
      description: 'Plumbing fixtures and fittings'
    },
    {
      id: 14,
      title: 'Electrical',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop',
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
      image: 'https://img.freepik.com/premium-photo/contemporary-riverfront-home-glass-walls-stone-steps-leading-water-sunny-reflection_1342292-9395.jpg',
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