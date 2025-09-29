// // Dashboard.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from './firebase';
// import './Dashboard.css';
// import Categories from './Categories';
// import Footer from './Footer';

// const Dashboard = ({ user }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const q = (searchQuery || '').trim();
//     navigate(q ? `/subcategories?q=${encodeURIComponent(q)}` : '/subcategories');
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <div className="header-content">
//           {/* Logo Section */}
//           <div className="logo-section">
//             <div className="logo">
//               <img
//                 src={process.env.PUBLIC_URL + '/assests/vrmlogo.png'}
//                 alt="VRM Groups Logo"
//                 className="company-logo"
//                  loading="lazy" 
//               />
//               <span className="logo-text">VRM Groups</span>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="search-section">
//             <form className="search-form" onSubmit={handleSearch}>
//               <div className="search-input-wrapper">
//                 <input
//                   type="text"
//                   className="search-input"
//                   placeholder="Search items, categories, brands..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button type="submit" className="search-btn">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <path d="m21 21-4.35-4.35"></path>
//                   </svg>
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Profile Section */}
//           <div className="profile-section">
//             <div className="profile-wrapper">
//               <button 
//                 className="profile-btn"
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//               >
//                 <div className="profile-avatar">
//                   {user?.email?.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="profile-email">{user?.email}</span>
//                 <svg className="profile-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <polyline points="6,9 12,15 18,9"></polyline>
//                 </svg>
//               </button>
              
//               {showProfileMenu && (
//                 <div className="profile-menu">
                  
//                   <div className="profile-menu-divider"></div>
//                   <button className="profile-menu-item logout-item" onClick={handleLogout}>
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="dashboard-main">
//         <div className="dashboard-content">
//           <section className="banner-section">
//             <div className="banner-image">
//               <img
//                 src={'https://img.freepik.com/premium-vector/scene-building-construction-site_1308-108395.jpg'}
//                 alt="Construction Banner"
//                 className="banner-img"
//               />
//               <div className="banner-overlay">
//                 <div className="banner-content">
//                   <h1 className="banner-title">Building, Construction and Infrastructure</h1>
//                   <p className="banner-subtitle">Sustainable Design Freedom</p>
//                   <button
//                     className="generate-quotation-btn"
//                     onClick={() => navigate('/subcategories')}
//                   >
//                     Generate Quotation
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//           <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0' }}>
//             <button
//               className="btn"
//               onClick={() => navigate('/quotation')}
//               title="Open your quotation"
//             >
//               View Quotation
//             </button>
//           </div>
//           {/* Categories section */}
//           <Categories />
//           <Footer />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;




// // Dashboard.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from './firebase';
// import './Dashboard.css';
// import Categories from './Categories';
// import Footer from './Footer';

// const Dashboard = ({ user }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const q = (searchQuery || '').trim();
//     navigate(q ? `/subcategories?q=${encodeURIComponent(q)}` : '/subcategories');
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <div className="header-content">
//           {/* Logo Section */}
//           <div className="logo-section">
//             <div className="logo">
//               <img
//                 src={process.env.PUBLIC_URL + '/assests/vrmlogo.png'}
//                 alt="VRM Groups Logo"
//                 className="company-logo"
//                  loading="lazy" 
//               />
//               {/* <span className="logo-text">VRM Groups</span> */}
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="search-section">
//             <form className="search-form" onSubmit={handleSearch}>
//               <div className="search-input-wrapper">
//                 <input
//                   type="text"
//                   className="search-input"
//                   placeholder="Search items, categories, brands..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button type="submit" className="search-btn">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <path d="m21 21-4.35-4.35"></path>
//                   </svg>
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Profile Section */}
//           <div className="profile-section">
//             <div className="profile-wrapper">
//               <button 
//                 className="profile-btn"
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//               >
//                 <div className="profile-avatar">
//                   {user?.email?.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="profile-email">{user?.email}</span>
//                 <svg className="profile-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <polyline points="6,9 12,15 18,9"></polyline>
//                 </svg>
//               </button>
              
//               {showProfileMenu && (
//                 <div className="profile-menu">
                  
//                   <div className="profile-menu-divider"></div>
//                   <button className="profile-menu-item logout-item" onClick={handleLogout}>
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="dashboard-main">
//         <div className="dashboard-content">
//           <section className="banner-section">
//             <div className="banner-image">
//               <img
//                 src={'https://img.freepik.com/premium-vector/scene-building-construction-site_1308-108395.jpg'}
//                 alt="Construction Banner"
//                 className="banner-img"
//               />
//               <div className="banner-overlay">
//                 <div className="banner-content">
//                   <h1 className="banner-title">Building, Construction and Infrastructure</h1>
//                   <p className="banner-subtitle">Sustainable Design Freedom</p>
//                   <button
//                     className="generate-quotation-btn"
//                     onClick={() => navigate('/subcategories')}
//                   >
//                     Generate Quotation
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//           <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0' }}>
//             <button
//               className="btn"
//               onClick={() => navigate('/quotation')}
//               title="Open your quotation"
//             >
//               View Quotation
//             </button>
//           </div>
//           {/* Categories section */}
//           <Categories />
//           <Footer />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;



// Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './Dashboard.css';
import Categories from './Categories';
import Footer from './Footer';

const Dashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (searchQuery || '').trim();
    navigate(q ? `/subcategories?q=${encodeURIComponent(q)}` : '/subcategories');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo">
              <img
                src={process.env.PUBLIC_URL + '/assests/vrmlogo.png'}
                alt="VRM Groups Logo"
                className="company-logo"
                loading="lazy"
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search items, categories, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="profile-email">{user?.email}</span>
                <svg className="profile-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>

              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-menu-divider"></div>
                  <button className="profile-menu-item logout-item" onClick={handleLogout}>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <section className="banner-section">
            <div className="banner-image">
              {/* Use logo as the banner image */}
              <img
                src={process.env.PUBLIC_URL + '/assests/vrmlogo.png'}
                alt="VRM Groups Banner"
                className="banner-img banner-img--logo"
              />
              <div className="banner-overlay">
                <div className="banner-content">
                  {/* Added VRM GROUPS above the main heading */}
                  <h1 className="brand-title">
                    <span className="brand-vrm">VRM</span>{' '}
                    <span className="brand-groups">GROUPS</span>
                  </h1>

                  <h1 className="banner-title">Building, Construction and Infrastructure</h1>
                  <p className="banner-subtitle">Sustainable Design Freedom</p>
                  <button
                    className="generate-quotation-btn"
                    onClick={() => navigate('/subcategories')}
                  >
                    Generate Quotation
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0' }}>
            <button
              className="btn"
              onClick={() => navigate('/quotation')}
              title="Open your quotation"
            >
              View Quotation
            </button>
          </div>

          {/* Categories section */}
          {/* <Categories /> */}
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
