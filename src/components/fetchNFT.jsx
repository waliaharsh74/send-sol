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

            const url = `https://nft-backend-a3ah.onrender.com/wesol/v1/fetch-nft`
            // const url = `https://api.shyft.to/sol/v1/wallet/collections?network=mainnet-beta&wallet_address=${walletAddress}`
            // const headers = {
            //     'x-api-key': 'y0k0hu9943Lj3p2r'
            // }

            const body = {
                walletAddress
            }

            const { data } = await axios.post(url, body)
            // console.log(data);
            // setNftData(data)
            // console.log(data.result.collections);
            // const newArr = data.result.collections.flatMap((item) => item.nfts);
            // setCollection(newArr);





            // console.log(newArr);
            setCollection(data.data)

            return data
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
    const add = 'A6Mr3Ej6Cf75uRjhzWFSz8eAU3BMwF2PbhB7jQUuvBBt'

    useEffect(() => {
        getNFT(add)



    }, [])
    // useEffect(() => {
    //     if (collections.length > 0) {
    //         fetchImages();
    //     }
    // }, [collections]);
    return (
        <div>
            Your NFTs
            {console.log(collections)}
            {(

                <div>
                    {collections.map((im, index) => (
                        <img key={index} src={im?.metadata?.image} alt={`NFT ${index}`} width={200} height={100} />
                    ))}
                </div>
            )}
        </div>

    )
}


export default FetchNFT