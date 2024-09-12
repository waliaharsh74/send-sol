import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ShowCollections from './components/ShowCollections';
import CrowdFunding from './components/CrowdFunding';
import PrivateRoute from './components/PrivateRoute'
import ShowNFT from './components/ShowNFT';
import './App.css'
import TokenLaunchPad from './pages/TokenLaunchPad';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<ShowCollections />} />
        <Route path="/crowd-funding" element={<CrowdFunding />} />
        <Route path="/nfts/:templateId" element={<ShowNFT />} />
        <Route path="/token-launch-pad" element={<TokenLaunchPad />} />

      </Routes>
    </Router>
  );
}

export default App;
