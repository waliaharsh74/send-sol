import React, { useEffect, useRef, useState } from 'react';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, mintTo, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import './TokenLaunchPad.css'

const TokenLaunchPad = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState('');
    const { publicKey } = useWallet();
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const { connection } = useConnection();
    const wallet = useWallet();
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [metaData, setMetaData] = useState('');
    const [supply, setSupply] = useState(0);
    const sup = 1000000000

    const uploadDataToCloudinary = async (data) => {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

        const formData = new FormData();
        formData.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }), 'data.json');
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log('Data upload result:', result);
            setMetaData(result.url)
            return result;
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    async function createToken() {
        const mintKeypair = Keypair.generate();
        const metadata = {
            mint: mintKeypair.publicKey,
            name: name,
            symbol: symbol,
            uri: metaData,
            additionalMetadata: [],
        };

        try {

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
                createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                }),
            );

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            await wallet.sendTransaction(transaction, connection);
            console.log("metaData: ", metadata);

            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

            console.log(associatedToken.toBase58());

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
            );

            await wallet.sendTransaction(transaction2, connection);


            const transaction3 = new Transaction().add(
                createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, sup, [], TOKEN_2022_PROGRAM_ID)
            );

            await wallet.sendTransaction(transaction3, connection);
            setTransactionStatus(`Minting started it will show in your wallet after some time`);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);

            console.log("Minted!")
        } catch (error) {
            console.error('Error sending transaction:', error);
            setTransactionStatus('Transaction failed! ' + error.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        }
    }

    const handleUploadSuccess = (info) => {
        console.log("Uploaded image URL:", info.secure_url);
        setUploadedImageUrl(info.secure_url);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !symbol) {
            alert('Please fill all fields.');
            return;
        }

        // Process the form data as needed
        const formData = {
            name,
            symbol,
            description,
            image: uploadedImageUrl,
        };

        console.log('Form submitted with data:', formData);
        await uploadDataToCloudinary(formData);


        // You can add additional logic here, like sending the data to a server.
    };

    return (
        <div className="p-4">
            {publicKey ? (<div>



                <h1 className="text-2xl font-bold mb-4">Token Launch Pad</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-lg font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="symbol" className="block text-lg font-medium">Symbol</label>
                        <input
                            type="text"
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>


                    {!uploadedImageUrl && <div>
                        <label htmlFor="description" className="block text-lg font-medium">Upload Token Image </label>
                        <CloudinaryUpload
                            cloudName={cloudName}
                            uploadPreset={uploadPreset}
                            onUploadSuccess={handleUploadSuccess}
                        />
                    </div>}

                    {uploadedImageUrl && (
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold mb-2">Uploaded Image:</h2>
                            <img src={uploadedImageUrl} alt="Uploaded" className="max-w-md" height={100} width={100} />

                        </div>

                    )}

                    {!metaData &&
                        <button
                            type="submit"
                            className="btn minting-button"
                            style={{ marginTop: '50px!important' }}
                            onClick={(e) => handleSubmit(e)}
                        >
                            Submit MetaData
                        </button>
                    }
                </div>
                {metaData &&
                    <div>
                        <h2>MetaData uploaded successfully!</h2>
                        <button onClick={createToken} className='minting-button' >Create Your token</button>
                    </div>
                }
                {showPopup && (
                    <div className='popup'>
                        <p>{transactionStatus}</p>
                    </div>
                )}
            </div>) : (
                <p>Please connect your wallet.</p>
            )}
        </div>
    );
}

const CloudinaryUpload = ({ cloudName, uploadPreset, onUploadSuccess }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [widget, setWidget] = useState(null);

    useEffect(() => {
        if (!isScriptLoaded) {
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            script.onload = () => setIsScriptLoaded(true);
            script.onerror = () => console.error('Failed to load Cloudinary script');
            document.body.appendChild(script);
        }

        return () => {
            if (isScriptLoaded) {
                const script = document.querySelector('script[src="https://upload-widget.cloudinary.com/global/all.js"]');
                if (script) document.body.removeChild(script);
            }
        };
    }, [isScriptLoaded]);

    useEffect(() => {
        if (isScriptLoaded && window.cloudinary) {
            const myWidget = window.cloudinary.createUploadWidget(
                {
                    cloudName: cloudName,
                    uploadPreset: uploadPreset,
                },
                (error, result) => {
                    if (!error && result && result.event === "success") {
                        console.log('Upload Success:', result.info);
                        onUploadSuccess(result.info);
                    }
                }
            );
            setWidget(myWidget);
        }
    }, [isScriptLoaded, cloudName, uploadPreset, onUploadSuccess]);

    const openWidget = () => {
        if (widget) {
            widget.open();
        } else {
            console.error('Cloudinary widget is not initialized');
        }
    };

    return (
        <button
            onClick={openWidget}
            disabled={!isScriptLoaded}
            className={`minting-button`}
        >
            {isScriptLoaded ? 'Upload Image' : 'Loading...'}
        </button>
    );
};

export default TokenLaunchPad;