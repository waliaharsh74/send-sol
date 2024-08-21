import { useParams } from 'react-router-dom';
import axios from 'axios'

import React, { useEffect, useState } from 'react'


function ShowNFT() {
    const { templateId } = useParams();
    const [nft, setNft] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = {
                    collectionId: "d383cf76-23f5-4c1e-a97e-b9f6e9e0b112",
                    templateId
                }
                const { data } = await axios.post(`https://nft-backend-a3ah.onrender.com/wesol/v1/meta-data`, body)
                setNft(data.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()

    }, [])
    return (
        <div>

            {nft?.metadata?.name}

        </div>
    )
}

export default ShowNFT