import React, { useEffect, useState } from 'react'
import axios from 'axios'

function MintNft() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const apiKey = 'sk_staging_21j2imXjoPfjqbAyJjWCSUS6tSsvNupsZHVd9C7d6byoHEavk2w7DW5akrFB51sHQmwPtgrnFmfStpHEauKwJAwNbwDvaD3ft5DC8oq9ufnYmoFgiBqspwufb7mbfXiKTtiF5o6gjtXe5FcrfFEeBmVyWMe7Sx3uVEp1NdMGDvG9kMMMe63EV3qbqAqtVJEM25BnQhupmfmnNRPWzcAbk8h'; // Replace with your actual API key
            const collectionId = 'd383cf76-23f5-4c1e-a97e-b9f6e9e0b112'; // Replace with your actual collectionId
            const templateId = 'abacd1e6-8e14-4c9c-9297-cd5e10fb79f9'; // Replace with your actual templateId

            try {

                const response = await axios.get(
                    `https://proxy.cors.sh/https://staging.crossmint.com/api/2022-06-09/collections/${collectionId}/templates/${templateId}`,
                    {
                        headers: {
                            'X-API-KEY': apiKey
                        }
                    }
                );
                console.log(response.data);
                setData(response.data);
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, []);
    if (error) {
        console.log(error);
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    const postNFTData = async () => {
        const apiKey = 'sk_staging_21j2imXjoPfjqbAyJjWCSUS6tSsvNupsZHVd9C7d6byoHEavk2w7DW5akrFB51sHQmwPtgrnFmfStpHEauKwJAwNbwDvaD3ft5DC8oq9ufnYmoFgiBqspwufb7mbfXiKTtiF5o6gjtXe5FcrfFEeBmVyWMe7Sx3uVEp1NdMGDvG9kMMMe63EV3qbqAqtVJEM25BnQhupmfmnNRPWzcAbk8h'; // Replace with your actual API key
        const collectionId = 'd383cf76-23f5-4c1e-a97e-b9f6e9e0b112'; // Replace with your actual collectionId
        const templateId = 'abacd1e6-8e14-4c9c-9297-cd5e10fb79f9';
        const url = `https://staging.crossmint.com/api/2022-06-09/collections/${collectionId}/nfts`;

        const payload = {
            metadata: {
                name: "Crossmint Example NFT",
                image: "https://www.crossmint.com/assets/crossmint/logo.png",
                description: "My NFT created via the mint API!",
                animation_url: "<string>",
                attributes: [
                    {
                        display_type: "boost_number",
                        trait_type: "<string>",
                        value: "<string>"
                    }
                ]
            },
            recipient: "solana:testy@crossmint.com:polygon",
            reuploadLinkedFiles: true,
            compressed: true
        };

        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error making the request:', error);
        }
    };

    // Call the function where you need to use it
    postNFTData();
    return (
        <div>  <h1>Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre></div>
    )
}

export default MintNft
