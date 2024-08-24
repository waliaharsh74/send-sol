import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import TransferSol from './TransferSol';
import FetchTokens from './FetchTokens';
import FetchNft from './fetchNFT'
import './Home.css'

// import './App.css'
import MintNft from './MintNft';
import Masonry from './Masonry';
import ShowCollections from './ShowCollections';
import TokenCreationForm from './TokenCreationForm';

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
                <div className="first-row">
                    <div className="wallet-info cen">
                        <h2>Wallet Info</h2>
                        <p className="public-key">Connected with: <span className='token-data'>{publicKey.toString()}</span></p>
                        {balance !== null && (
                            <p className="balance">Wallet Balance: <span className='token-data'>{balance} SOL</span></p>
                        )}
                    </div>
                    <TransferSol />

                </div>

            ) : (
                <p>Please connect your wallet.</p>
            )}
            <div className="first-row">

                {publicKey && <TokenCreationForm />}

                {publicKey && <FetchTokens walletToQuery={publicKey.toString()} />}
            </div>


            {/* <MintNft /> */}
            {/* <FetchNft /> */}



        </div>
    );
}

export default Home;

