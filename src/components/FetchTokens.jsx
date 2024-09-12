import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import './FetchTokens.css';

const rpcEndpoint = 'https://api.devnet.solana.com';

const FetchTokens = ({ walletToQuery }) => {
    const [tokenAccounts, setTokenAccounts] = useState([]);
    const [splTokenAccounts, setSplTokenAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetaData = async (mintAddress) => {
            try {

                const metaData = await axios.post("https://explorer-api.devnet.solana.com", {
                    id: 1,
                    jsonrpc: "2.0",
                    method: "getMultipleAccounts",
                    params: [
                        [
                            mintAddress
                        ],
                        {
                            "encoding": "jsonParsed",
                            "commitment": "confirmed"
                        }
                    ]
                })

                // metaData?.data?.result?.value[0] != null ? console.log(metaData?.data?.result?.value[0]?.data.parsed.info) : console.log({})
                if (!metaData?.data?.result?.value) return null
                if (!metaData?.data?.result?.value[0]?.data?.parsed?.info.extensions) return null

                const bodyData = {
                    url: metaData?.data?.result?.value[0]?.data?.parsed?.info.extensions[1].state.uri
                };

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
                const { data: metaDataJson } = await axios.post("https://handler-cors.vercel.app/fetch",
                    bodyData, config);

                // =await axios.get(metaData?.data?.result?.value[0]?.data?.parsed?.info.extensions[1].state.uri)
                // console.log(metaDataJson)
                return {
                    image: metaDataJson.image,
                    Symbol: metaData?.data?.result?.value[0]?.data?.parsed?.info.extensions[1].state
                }


            } catch (err) {
                console.error(err)

            }
        };

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
                const allNonTokens = await axios.post("https://explorer-api.devnet.solana.com", {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getTokenAccountsByOwner",
                    params: [
                        walletToQuery,
                        {
                            programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                        },
                        {
                            encoding: "jsonParsed"
                        }
                    ]
                })
                const nonTokenDataArr = allNonTokens?.data?.result?.value?.map((item) => {

                    return {
                        address: item.account.data.parsed.info.mint,
                        metadata: null,
                        tokenBalance:item.account.data.parsed.info.tokenAmount.uiAmountString
                    }

                })
                console.log(nonTokenDataArr)
                //   console.log(nonTokenDataArr)
                const allSplTokens = await axios.post("https://explorer-api.devnet.solana.com", {
                    jsonrpc: "2.0",
                    id: 2,
                    method: "getTokenAccountsByOwner",
                    params: [
                        walletToQuery,
                        {
                            programId: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
                        },
                        {
                            encoding: "jsonParsed"
                        }
                    ]
                })
                const tokenMetaDataPromises = await allSplTokens.data.result.value?.map(async (item) => {
                    const tokenMetaData = await fetchMetaData(item.account.data.parsed.info.mint)
                    return {
                        address: item.account.data.parsed.info.mint,
                        metadata: tokenMetaData,
                        tokenBalance:item.account.data.parsed.info.tokenAmount.uiAmountString
                    }

                })
                const tokenMetaDataArray = await Promise.all(tokenMetaDataPromises);
                // console.log(tokenMetaDataArray)
                // console.log(tokenMetaDataArray);
                setSplTokenAccounts(tokenMetaDataArray)
                setTokenAccounts(nonTokenDataArr)



            } catch (err) {
                console.error(err)
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
                <div className="loading">Fetching Details...</div>
            ) : error ? (
                <div className="error">Error: {error}</div>
            ) : (
                <div className="token-accounts-list">
                    {splTokenAccounts.length === 0 && tokenAccounts.length===0 ? (
                        <h1 className='nothing-found'>No token accounts found!</h1>
                    ) : (
                        <ul className='ul'>
                            {splTokenAccounts.length>0 && splTokenAccounts.map((account, i) => (
                                <li key={i} className="token-account-item" >
                                    <div className="token-account-box">
                                        <div className='token-head'>

                                            <img src={account?.metadata ? account?.metadata.image : "unknown.jpg"} alt="unknown" />
                                            <div className='token-info'>
                                    <h2 className='token-no'>{account?.metadata ? account?.metadata?.Symbol?.name : "Unknown Token "} </h2>
                                                <div className='strong'>
                                                    <strong className='supply'>{account.tokenBalance}<span className='token-data'> {account?.metadata ? account?.metadata?.Symbol?.symbol : account?.address.substring(0, 7) + "..."}</span></strong>
                                                </div>

                                            </div>
                                        </div>




                                    </div>
                                </li>
                            ))}
                            {tokenAccounts.length>0 && tokenAccounts.map((account, i) => (
                                <li key={i} className="token-account-item" >
                                    <div className="token-account-box">
                                        <div className='token-head'>

                                            <img src={account?.metadata ? account?.metadata.image : "unknown.jpg"} alt="unknown" />
                                            <div className='token-info'>

                                                <h2 className='token-no'>{account?.metadata ? account?.metadata?.Symbol?.name : "Unknown Token "} </h2>

                                                <div className='strong'>
                                                    <strong className='supply'>{account.tokenBalance}<span className='token-data'> {account?.metadata ? account?.metadata?.Symbol?.symbol : account?.address.substring(0, 7) + "..."}</span></strong>
                                                </div>

                                            </div>
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
