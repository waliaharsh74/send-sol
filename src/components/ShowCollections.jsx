import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShowNFT from './ShowNFT';
import { Link } from 'react-router-dom';
import ShimmerPlaceholder from '../utils/ShimmerPlaceholder';
import Masonry from 'react-masonry-css';
import './ShowCollections.css';

function ShowCollections() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = {
                    collectionId: 'd383cf76-23f5-4c1e-a97e-b9f6e9e0b112',
                };
                const { data } = await axios.post('https://nft-backend-a3ah.onrender.com/wesol/v1/all-templates', body);
                setTemplates(data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="collection-container">
            <h3>Browse these NFTs</h3>
            {loading ? (
                <ShimmerPlaceholder count={6} />
            ) : (
                <Masonry
                    breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column"
                >
                    {templates.map((item) => (
                        <div key={item.templateId} className="masonry-item">
                            <div className="image-container">
                                <img src={item.metadata.image} alt={item.metadata.name} className="nft-image" />
                                <div className="overlay">
                                    <div className="info">
                                        <div className="info-text">
                                            <h3>{item.metadata.name}</h3>
                                            <p>{item.metadata.description}</p>
                                            <Link to={`/nfts/${item.templateId}`} className="view-btn">View NFT</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            )}
        </div>
    );
}

export default ShowCollections;
