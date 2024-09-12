import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './Navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <header className="navbar">
            <div className="links">



                <Link to='/' className="heading"><h1 >Home</h1></Link>
                <Link to='/collections' className="heading"><h1 >NFT Collection</h1></Link>
                <Link to='/crowd-funding' className="heading"><h1 >Crowd Funding</h1></Link>
                <Link to='/token-launch-pad' className="heading"><h1 >Token Launch </h1></Link>
            </div>
            <WalletMultiButton className="wallet-button" />
        </header>
    );
}

export default Navbar