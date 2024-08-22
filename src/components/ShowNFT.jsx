import { useParams } from 'react-router-dom';
import axios from 'axios'
import ShimmerPlaceholder from '../utils/ShimmerPlaceholder';
import { useWallet } from '@solana/wallet-adapter-react';

import React, { useEffect, useState } from 'react'


function ShowNFT() {
    const { publicKey } = useWallet();
    const { templateId } = useParams();
    const [nft, setNft] = useState({})
    const [loading, setLoading] = useState(true);
    const [metaData, setMetaData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = {
                    collectionId: "d383cf76-23f5-4c1e-a97e-b9f6e9e0b112",
                    templateId
                }
                const { data } = await axios.post(`https://nft-backend-a3ah.onrender.com/wesol/v1/meta-data`, body)
                setNft(data.data)
                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        fetchData()

    }, [])
    // useEffect(() => {

    //     fetchData()

    // }, [])

    const handleMintNft = async () => {
        try {
            const body = {
                collectionId: "d383cf76-23f5-4c1e-a97e-b9f6e9e0b112",
                walletAddress: publicKey.toString(),
                metadata: nft.metadata,
                templateId
            }

            console.log(nft.metadata);
            console.log(body);
            const { data } = await axios.post(`https://nft-backend-a3ah.onrender.com/wesol/v1/mint-nft`, body)
            console.log(data);
            setMetaData(data)
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div>
            {loading ? (<ShimmerPlaceholder count={6} />) :
                (<div>
                    <h1>
                        {nft?.metadata?.name}
                    </h1>
                    <img src={nft?.metadata?.image} alt={nft?.metadata?.description} />
                    {publicKey && <button onClick={async () => { await handleMintNft(); }}>Mint NFT</button>}
                    {(metaData?.status || metaData?.onChain) && <div>
                        <div>Status: {metaData?.status || metaData?.onChain?.status} { }</div>
                        <div>Message:{" Minting Started " || metaData?.msg} </div>
                    </div>}


                </div>)}
        </div>

    )
}

export default ShowNFT