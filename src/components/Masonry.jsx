
import React, { useState, useEffect, useRef } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios'
import './masonry.css'
import ShimmerPlaceholder from '../utils/ShimmerPlaceholder';
function Masonry() {
    const { publicKey } = useWallet();
    const [collections, setCollection] = useState([])
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getNFT(publicKey.toString())

    }, [])
    const getNFT = async (walletAddress) => {
        try {

            const url = `https://nft-backend-a3ah.onrender.com/wesol/v1/fetch-nft`

            const body = {
                walletAddress
            }

            const { data } = await axios.post(url, body)
            setCollection(data.data)
            const imagesArr = data.data.map((item) => item.metadata.image)

            setImages(imagesArr)
            setLoading(false);
            console.log(imagesArr);

            return data
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: '20px' }}>

            {loading ? (
                <ShimmerPlaceholder count={5} />
            ) : (
                <div>
                    <h1>Your NFT Collections</h1>
                    <MasonryLayout images={images} />
                </div>
            )}
        </div>
    );
}


export default Masonry




// const MasonryLayout = ({ images, columns = 3, gap = '16px' }) => {
//     const containerRef = useRef(null);
//     const [columnWrappers, setColumnWrappers] = useState(Array.from({ length: columns }, () => []));

//     useEffect(() => {
//         const newColumnWrappers = Array.from({ length: columns }, () => []);

//         images.forEach((img, index) => {
//             const columnIndex = index % columns;
//             newColumnWrappers[columnIndex].push(img);
//         });

//         setColumnWrappers(newColumnWrappers);
//     }, [images, columns]);

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 display: 'flex',
//                 gap: gap,
//             }}
//         >
//             {columnWrappers.map((column, columnIndex) => (
//                 <div
//                     key={columnIndex}
//                     style={{
//                         flex: 1,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: gap,
//                     }}
//                 >
//                     {column.map((image, index) => (
//                         <img key={index} src={image} alt={`Masonry item ${index}`} style={{ width: '100%', display: 'block' }} />
//                     ))}
//                 </div>
//             ))}
//         </div>
//     );
// };

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

const MasonryLayout = ({ images }) => {
    const containerRef = useRef(null);
    const [columnWrappers, setColumnWrappers] = useState([]);

    useEffect(() => {
        const columns = 3;
        const newColumnWrappers = Array.from({ length: columns }, () => []);
        images.forEach((img, index) => {
            const columnIndex = index % columns;
            newColumnWrappers[columnIndex].push(img);
        });
        setColumnWrappers(newColumnWrappers);
    }, [images]);

    return (
        <div
            ref={containerRef}
            className="masonry-container"
        >
            {columnWrappers.map((column, columnIndex) => (
                <div
                    key={columnIndex}
                    className="masonry-column"
                >
                    {column.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Masonry item ${index}`}
                            className="masonry-image"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

