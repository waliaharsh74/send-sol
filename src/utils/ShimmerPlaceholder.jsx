import React from 'react';
import './ShimmerPlaceholder.css'; // Import CSS for shimmer effect

const shimmerSizes = [
    { width: '32%', height: '200px' },
    { width: '32%', height: '200px' },
    { width: '32%', height: '200px' },
    { width: '32%', height: '200px' }
];

const getRandomSize = () => {
    return shimmerSizes[Math.floor(Math.random() * shimmerSizes.length)];
};

const ShimmerPlaceholder = ({ count = 5 }) => {
    const placeholders = Array.from({ length: count }, (_, index) => {
        const size = getRandomSize();
        return <div key={index} className="shimmer-placeholder-item" style={size}></div>

        
    });

    return (
        <div className="shimmer-placeholder">
            {placeholders}
        </div>
    );
};

export default ShimmerPlaceholder;
