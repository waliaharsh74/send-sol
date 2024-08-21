// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';


const PrivateRoute = ({ element: Component, ...rest }) => {
    const { publicKey } = useWallet();
    console.log(publicKey);

    return publicKey ? <Component {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
