import React, { useState } from 'react';
import crowdfundingData from '../utils/data';
import './CrowdFunding.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

function CrowdFunding() {
    const { publicKey, sendTransaction } = useWallet();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleTransfer = async (recipient) => {
        if (!publicKey) {
            alert('Please connect your wallet.');
            return;
        }
        const amount = 0.5

        if (!recipient) {
            alert('Please provide both recipient address and amount.');
            return;
        }

        try {
            const connection = new Connection('https://api.devnet.solana.com');
            const recipientPublicKey = new PublicKey(recipient);
            const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports


            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPublicKey,
                    lamports,
                })
            );
            console.log(transaction);

            const signature = await sendTransaction(transaction, connection);


            await connection.confirmTransaction(signature, 'processed');

            setTransactionStatus(`Transaction successful with signature: ${signature}`);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setTransactionStatus('Transaction failed:  ' + error.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        }
    };
    return (
        <div className='crowd-funding'>
            <h1 className='title'>Donate to Some Good Cause:)</h1>
            <div className='all-funds'>
                {crowdfundingData.map(({ image, name, description, createdBy, walletAddress }, index) => (
                    <div key={index} className='funding-box'>
                        <img src={image} alt={`Image for ${name}`} className='funding-image' />
                        <div className='text-data'>
                            <h2 className='funding-name'>{name}</h2>
                            <p className='funding-description'>{description}</p>

                            <div >Wallet: <span className='wallet-address'>{walletAddress}</span></div>
                            <div className='lower-deck'>
                                <div className='creator'>

                                    Created by: <span className='creator-name'>{createdBy}</span>
                                </div>
                                <button className='minting-button' onClick={() => handleTransfer(walletAddress)}>Donate 0.5 Sol</button>
                            </div>
                        </div>
                        {showPopup && (
                            <div className='popup'>
                                <p>{transactionStatus}</p>
                            </div>
                        )}
                        <div className='creator-info'>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CrowdFunding;

