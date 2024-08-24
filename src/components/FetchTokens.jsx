import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import './FetchTokens.css';

const rpcEndpoint = 'https://api.devnet.solana.com';

const FetchTokens = ({ walletToQuery }) => {
    const [tokenAccounts, setTokenAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTokenAccounts = async () => {
            try {
                const solanaConnection = new Connection(rpcEndpoint);
                const filters = [
                    {
                        dataSize: 165,
                    },
                    {
                        memcmp: {
                            offset: 32,
                            bytes: new PublicKey(walletToQuery).toBase58(),
                        },
                    },
                ];

                const accounts = await solanaConnection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters });
                setTokenAccounts(
                    accounts.map(account => {
                        const parsedAccountInfo = account.account.data.parsed.info;
                        const mintAddress = parsedAccountInfo.mint;
                        const tokenBalance = parsedAccountInfo.tokenAmount.uiAmount;
                        return {
                            pubkey: account.pubkey.toString(),
                            mintAddress,
                            tokenBalance,
                        };
                    })
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenAccounts();
    }, [walletToQuery]);

    return (
        <div className="fetch-tokens-container">
            <h2>Token Accounts In Wallet</h2>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : error ? (
                <div className="error">Error: {error}</div>
            ) : (
                <div className="token-accounts-list">
                    {tokenAccounts.length === 0 ? (
                        <p>No token accounts found.</p>
                    ) : (
                        <ul className='ul'>
                            {tokenAccounts.filter((item) => item.tokenBalance > 0).map((account, i) => (
                                <li key={i} className="token-account-item" >
                                    <div className="token-account-box">
                                        <strong>Token Account No. {i + 1}</strong>

                                        <div className='strong'>
                                            <strong>Token Mint:<span className='token-data'> {account.mintAddress}</span></strong>
                                        </div>
                                        <div className='strong'>

                                            <strong>Token Balance:<span className='token-data'>{account.tokenBalance}</span></strong>
                                        </div>


                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default FetchTokens;
