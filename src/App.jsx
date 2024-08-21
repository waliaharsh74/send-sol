import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ShowCollections from './components/ShowCollections';
import PrivateRoute from './components/PrivateRoute'
import ShowNFT from './components/ShowNFT';
import './app.css'


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<ShowCollections />} />
        <Route path="/nfts/:templateId" element={<ShowNFT />} />

      </Routes>
    </Router>
  );
}

export default App;
