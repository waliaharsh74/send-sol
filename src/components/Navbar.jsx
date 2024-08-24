import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './Navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <header className="navbar">

            <Link to='/' className="heading"><h1 >Solana Wallet App</h1></Link>
            <Link to='/collections' className="heading"><h1 >Collections</h1></Link>

            <WalletMultiButton className="wallet-button" />
        </header>
    );
}

export default Navbar