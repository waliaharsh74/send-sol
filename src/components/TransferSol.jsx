import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const TransferSol = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState('');
    const [isValidRecipient, setIsValidRecipient] = useState(true);

    const handleTransfer = async () => {
        if (!publicKey) {
            alert('Please connect your wallet.');
            return;
        }

        if (!recipient || !amount) {
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

            // await sendAndConfirmTransaction(connection, transaction, [publicKey]); 

            await connection.confirmTransaction(signature, 'processed');

            setTransactionStatus(`Transaction successful with signature: ${signature}`);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setTransactionStatus('Transaction failed! ' + error.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        }
    };

    return (
        <div className='transfer-sol'>
            <h2>Transfer SOL on Devnet</h2>
            <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount in SOL"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button className='minting-button' onClick={handleTransfer}>Transfer SOL</button>
            {showPopup && (
                <div className='popup'>
                    <p>{transactionStatus}</p>
                </div>
            )}
        </div>
    );
};

export default TransferSol;

