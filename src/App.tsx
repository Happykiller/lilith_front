// src\App.tsx
import React from 'react';
import { Close } from '@mui/icons-material';
import { Routes, Route } from 'react-router-dom';


import { Play } from '@components/vues/PLay';
import { Admin } from '@components/vues/Admin';
import { Login } from '@components/vues/Login';
import { CGU, FlashMessage, NotFound } from '@happykiller/sunny-ui';
import { LayoutPublicExt } from '@components/layouts/LayoutPublicExt';
import { LayoutProtectedExt } from '@components/layouts/LayoutProtectedExt';

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
        <Route path="/login" element={<LayoutPublicExt><Login /></LayoutPublicExt>} />

        {/* Route for the login page */}
        <Route path="/" element={<LayoutProtectedExt><Admin /></LayoutProtectedExt>} />

        {/* Route for the profil page */}
        <Route path="/play" element={<LayoutProtectedExt><Play /></LayoutProtectedExt>} />
      </Routes>
      <FlashMessage icons={{ close: <Close fontSize="small" /> }} />
    </div>
  );
}

export default App;
