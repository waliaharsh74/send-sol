import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';

const FetchSolana = () => {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [nfts, setNfts] = useState([]);
    // console.log(publicKey);
    // console.log(connected);
    // const publicKey = 'DcJxE53h1NvzjNQNSmNv6hvaGv7rUCL3jj3aUVoiX2LY'

    useEffect(() => {
        const fetchNFTs = async () => {
            if (publicKey) {
                try {
                    // Initialize Metaplex
                    const metaplex = Metaplex.make(connection);


                    // Get the token accounts for the wallet

                    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                        publicKey,
                        { programId: new PublicKey('TokenkegQfeZwsUe8tSe4F8EDUpA2zJZJwXZqxJpCF8g') }
                    );

                    // Extract NFT metadata
                    const nftData = await Promise.all(
                        tokenAccounts.value.map(async (account) => {
                            const mintAddress = new PublicKey(account.account.data.parsed.info.mint);
                            try {
                                // Fetch the NFT metadata
                                const nft = await metaplex.nfts().findByMint(mintAddress);
                                const metadataUri = nft.uri ? await (await fetch(nft.uri)).json() : null;
                                return {
                                    ...nft,
                                    image: metadataUri ? metadataUri.image : null
                                };
                            } catch (error) {
                                console.error('Error fetching NFT metadata:', error);
                                return null;
                            }
                        })
                    );
                    setNfts(nftData.filter(nft => nft)); // Filter out null results
                } catch (error) {
                    console.error('Error fetching NFTs:', error);
                }
            }
        };

        fetchNFTs();
    }, [publicKey, connection]);

    return (
        <div>
            <h1>My Solana NFTs</h1>
            {connected ? (
                <div>
                    {nfts.length > 0 ? (
                        <div>
                            {nfts.map((nft, index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    {nft.image && <img src={nft.image} alt={`NFT ${index}`} style={{ maxWidth: '200px' }} />}
                                    <p>{nft.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No NFTs found</p>
                    )}
                </div>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
};

export default FetchSolana;