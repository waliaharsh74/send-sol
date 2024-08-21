import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import TransferSol from './TransferSol';
import FetchNft from './fetchNFT'
import './Home.css'

// import './App.css'
import MintNft from './MintNft';
import Masonry from './Masonry';
import ShowCollections from './ShowCollections';

function Home() {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);
    const connection = new Connection(clusterApiUrl('devnet'));

    useEffect(() => {
        if (publicKey) {
            const fetchBalance = async () => {
                const walletBalance = await getWalletBalance(publicKey.toString());
                setBalance(walletBalance);
            };

            fetchBalance();
        }
    }, [publicKey]);

    const getWalletBalance = async (walletAddress) => {
        try {
            const publicKey = new PublicKey(walletAddress);
            const balance = await connection.getBalance(publicKey);
            return balance / 1e9; // Convert lamports to SOL
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    return (
        <div className='home'>

            {publicKey ? (

                <div className="wallet-info cen">
                    <p className="public-key">Connected with: {publicKey.toString()}</p>
                    {balance !== null && (
                        <p className="balance">Wallet Balance: {balance} SOL</p>
                    )}
                </div>
            ) : (
                <p>Please connect your wallet.</p>
            )}

            {publicKey && <TransferSol />}
            {/* <MintNft /> */}
            {/* <FetchNft /> */}



        </div>
    );
}

export default Home;

