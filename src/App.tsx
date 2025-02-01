import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from '@page/Home';
import { Play } from '@page/PLay';
import { Admin } from '@page/Admin';
import Flash from '@component/Flash';
import { Guard } from '@component/Guard';
import { Footer } from '@component/Footer';

// Main application component
const App: React.FC = () => {

  return (
    <div>
      {/* Define the application's routing structure */}
      <Routes>
        {/* Route for root */}
        <Route path="/" element={<Home />} />

        {/* Route for the home page */}
        <Route path="/home" element={<Home />} />

        {/* Route for the login page */}
        <Route path="/admin" element={<Guard><Admin /></Guard>} />

        {/* Route for the profil page */}
        <Route path="/play" element={<Guard><Play /></Guard>} />
      </Routes>
      
      {/* Render the Footer component */}
      <Footer />
      <Flash/>
    </div>
  );
}

export default App;
