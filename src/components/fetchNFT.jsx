import React, { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import axios from 'axios'

function FetchNFT() {
    const [nftData, setNftData] = useState({})
    const [collections, setCollection] = useState([])
    const [images, setImages] = useState([])
    const { publicKey, connected } = useWallet();
    const getNFT = async (walletAddress) => {
        try {
            const url = `https://api.shyft.to/sol/v1/wallet/collections?network=mainnet-beta&wallet_address=${walletAddress}`
            const headers = {
                'x-api-key': 'y0k0hu9943Lj3p2r'
            }
            const { data } = await axios.get(url, { headers })
            setNftData(data)
            // console.log(data.result.collections);
            const newArr = data.result.collections.flatMap((item) => item.nfts);
            setCollection(newArr);





            // console.log(newArr);
            return newArr
        } catch (error) {
            console.log(error);
        }
    }

    const fetchImages = async () => {
        try {
            const imagePromises = collections.map(async (item) => {
                const im = await axios.get(item.metadata_uri);
                return im.data.image;
            });
            const allImages = await Promise.all(imagePromises);
            setImages(allImages);
        } catch (error) {
            console.log(error);
        }
    };
    const add = 'DcJxE53h1NvzjNQNSmNv6hvaGv7rUCL3jj3aUVoiX2LY'

    useEffect(() => {
        setCollection(getNFT(add))

    }, [])
    useEffect(() => {
        if (collections.length > 0) {
            fetchImages();
        }
    }, [collections]);
    return (
        <div>
            Your NFTs
            {images.length > 0 && (

                <div>
                    {images.map((im, index) => (
                        <img key={index} src={im} alt={`NFT ${index}`} width={200} height={100} />
                    ))}
                </div>
            )}
        </div>

    )
}


export default FetchNFT