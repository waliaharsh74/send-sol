import { useParams } from 'react-router-dom';
import axios from 'axios';
import ShimmerPlaceholder from '../utils/ShimmerPlaceholder';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import './ShowNFT.css';

function ShowNFT() {
    const { publicKey } = useWallet();
    const { templateId } = useParams();
    const [nft, setNft] = useState({});
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [metaData, setMetaData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = {
                    collectionId: "d383cf76-23f5-4c1e-a97e-b9f6e9e0b112",
                    templateId
                };
                const { data } = await axios.post(`https://nft-backend-a3ah.onrender.com/wesol/v1/meta-data`, body);
                setNft(data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [templateId]);

    const handleMintNft = async () => {

        setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        try {
            const body = {
                collectionId: "d383cf76-23f5-4c1e-a97e-b9f6e9e0b112",
                walletAddress: publicKey.toString(),
                metadata: nft.metadata,
                templateId
            };
            const { data } = await axios.post(`https://nft-backend-a3ah.onrender.com/wesol/v1/mint-nft`, body);
            
            console.log(data);
            setMetaData(data);
            
        } catch (error) {
            console.log(error);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        }
    };

    return (
        <div className="full-container">
            <h1 className="title">Mint NFT</h1>
            {loading ? (
                <div>
                <h2 className="warning">Please wait requests may take 50 seconds or more!</h2>
                <ShimmerPlaceholder count={6} />
            </div>
            ) : (
                <div>
                    <div className="image-container">
                        <img
                            src={nft?.metadata?.image}
                            alt={nft?.metadata?.description}
                            width={500}
                            height={500}
                            className="image"
                        />
                    </div>
                    {publicKey && (
                        <button
                            className="minting-button"
                            onClick={async () => { await handleMintNft(); }}
                        >
                            Mint NFT
                        </button>
                    )}
                    {(metaData?.status || metaData?.onChain) ? (
                        <div className="status">
                            <div>Status: {metaData?.status || metaData?.onChain?.status}</div>
                            <div>Message: {metaData?.msg || "Minting Started"}</div>
                        </div>
                    ):(
                        showPopup && (
                            <div className='popup'>Minting NFT to your Wallet has been Started!</div>)
                    )}
                </div>
            )}
        </div>
    );
}

export default ShowNFT;

