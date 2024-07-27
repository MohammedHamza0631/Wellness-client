import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { FloatingNav } from './components/ui/floating-navbar';

import { navItems } from './constants/navItems';
function App() {


  return (
    <div className='flex flex-col'>
      <nav className='relative w-full'>
        <FloatingNav navItems={navItems} />
      </nav>
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
