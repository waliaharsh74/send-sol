import React, { useState, useEffect } from 'react';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Metaplex, keypairIdentity, toMetaplexFile } from '@metaplex-foundation/js';

const MintNft = () => {
    const { publicKey, sendTransaction, wallet, connect, disconnect, connected } = useWallet();
    const [minting, setMinting] = useState(false);
    const [nftUri, setNftUri] = useState('https://gateway.pinata.cloud/ipfs/QmTD1jp3jxa3dn1UX8xucWQVuXotwbsbbD1YSXqPsjyRkX');
    const [error, setError] = useState(null);

    const connection = new Connection('https://api.devnet.solana.com');

    const metaplex = Metaplex.make(connection).use(keypairIdentity(publicKey));
    // const metaplex = Metaplex.make(connection)

    useEffect(() => {
        if (wallet && !connected) {
            connect().catch(console.error);
        }
    }, [wallet, connect, connected]);

    const mintNFT = async () => {
        if (!publicKey || !nftUri) {
            setError('Wallet not connected or NFT URI not provided.');
            return;
        }

        setMinting(true);
        setError(null);

        try {

            const file = toMetaplexFile('/', 'ape.jpeg');
            const imageUri = await metaplex.storage().upload(file);

            const { uri } = await metaplex.nfts().uploadMetadata({
                name: "My NFT",
                description: "My description",
                image: imageUri,
            });

            const { nft } = await metaplex.nfts().create(
                {
                    uri: uri,
                    name: "My NFT",
                    sellerFeeBasisPoints: 0,
                },
                { commitment: "finalized" },
            );
            // console.log(nft);

            // await wallet.connect()
            // const { nft, txId } = await metaplex.nfts().create({
            //     uri: nftUri,
            //     name: 'Bored Ape',
            //     symbol: '',
            //     sellerFeeBasisPoints: 500,
            //     creators: null,
            // }, { commitment: "finalized" });

            console.log(nft);

            // // Prepare the transaction to be sent
            // const transaction = new Transaction().add(txId);

            // // Sign and send transaction using Phantom wallet
            // const txHash = await sendTransaction(transaction, connection);

            // // Confirm transaction
            // await connection.confirmTransaction(txHash);

            alert('NFT minted successfully!');
        } catch (err) {
            console.error(err);
            setError('Minting failed. Please try again.');
        } finally {
            setMinting(false);
        }
    };

    return (
        <div>
            <h2>Mint a New NFT</h2>
            <input
                type="text"
                placeholder="Enter metadata URI"
                value={nftUri}
                onChange={(e) => setNftUri(e.target.value)}
            />
            <button onClick={mintNFT} disabled={minting}>
                {minting ? 'Minting...' : 'Mint NFT'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default MintNft;
