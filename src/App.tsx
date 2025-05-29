// src\App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Play } from '@page/PLay';
import { Admin } from '@page/Admin';
import { Login } from '@components/vues/Login';
import { CGU, NotFound } from '@happykiller/sunny-ui';
import { LayoutPublicExt } from '@components/layouts/LayoutPublicExt';

// Main application component
const App: React.FC = () => {

  return (
    <div>
      {/* Define the application's routing structure */}
      <Routes>
        <Route path="*" element={<LayoutPublicExt><NotFound /></LayoutPublicExt>} />
        
        {/* Route for the cgu page */}
        <Route path="/cgu" element={<LayoutPublicExt><CGU /></LayoutPublicExt>} />

        {/* Route for root */}
        <Route path="/" element={<LayoutPublicExt><Login /></LayoutPublicExt>} />

        {/* Route for the login page */}
        <Route path="/admin" element={<Admin />} />

        {/* Route for the profil page */}
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
}

export default App;
