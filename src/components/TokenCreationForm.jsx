import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

const SOLANA_NETWORK = 'https://api.devnet.solana.com';


const TokenCreationForm = () => {
    const { publicKey } = useWallet();

    const [walletAddress, setWalletAddress] = useState('');
    const [setFreezeAuthority, setSetFreezeAuthority] = useState(false);
    const [decimal, setDecimal] = useState(" ");
    const [supply, setSupply] = useState("");
    const [message, setMessage] = useState('');



    async function createToken() {

        try {
            setMessage('Processing... It may take some time');
            const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, decimal);
            const connection = new web3.Connection(web3.clusterApiUrl("devnet"));


            const mintAuthority = web3.Keypair.fromSecretKey(Uint8Array.from([102, 144, 169, 42, 220, 87, 99, 85, 100, 128, 197, 17, 41, 234, 250, 84, 87, 98, 161, 74, 15, 249, 83, 6, 120, 159, 135, 22, 46, 164, 204, 141, 234, 217, 146, 214, 61, 187, 254, 97, 124, 111, 61, 29, 54, 110, 245, 186, 11, 253, 11, 127, 213, 20, 73, 8, 25, 201, 22, 107, 4, 75, 26, 120]));
            const payer = mintAuthority

            // Airdrop some SOL to the mint authority
            // await connection.requestAirdrop(mintAuthority.publicKey, web3.LAMPORTS_PER_SOL);


            const mint = await splToken.createMint(
                connection,
                payer,
                payer.publicKey,
                setFreezeAuthority ? publicKey : null,
                decimal > 0 ? decimal : 9

            );
            console.log(mint?.toString());



            const tokenMintAccount = new web3.PublicKey(payer.publicKey);
            const recipientAccount = new web3.PublicKey(publicKey);

            const recipientTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
                connection,
                payer,
                mint,
                mintAuthority.publicKey,
            );
            const destinationTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
                connection,
                payer,
                mint,
                recipientAccount
            );
            console.log(recipientTokenAccount.address?.toString());


            const toMint = await splToken.mintTo(
                connection,
                payer,
                mint,
                recipientTokenAccount.address,
                payer,
                supply > 0 ? supply * 10 * MINOR_UNITS_PER_MAJOR_UNITS : 100000 * MINOR_UNITS_PER_MAJOR_UNITS,

            );
            console.log("min happend to ", toMint?.toString());
            console.log(destinationTokenAccount, tokenMintAccount);

            const transfered = await splToken.transfer(
                connection,
                payer,
                recipientTokenAccount.address,
                destinationTokenAccount.address,
                payer,
                supply > 0 ? supply * MINOR_UNITS_PER_MAJOR_UNITS : 1000 * MINOR_UNITS_PER_MAJOR_UNITS

            );

            console.log("Token created:", transfered)
            setMessage("Token created:" + transfered)
        } catch (error) {

            console.error('An unexpected error occurred:', error);
            setMessage('An unexpected error occurred:' + error)

        }



    }


    return (
        <div className='token-form'>
            <h2>Token Manager</h2>
            <div className='input'>

                {/* <div>Decimal:</div> */}
                <input
                    type="number"
                    placeholder="Decimal"
                    value={decimal}

                    max={100}
                    onChange={(e) => setDecimal(parseInt(e.target.value))}
                />
            </div>
            <div className='input'>

                {/* <div>Supply of Tokens:</div> */}
                <input
                    type="number"
                    placeholder="Supply"
                    value={supply}

                    max={1000000000}
                    onChange={(e) => setSupply(parseInt(e.target.value))}
                />
            </div>

            <button className='minting-button' onClick={createToken}>Create Token and Transfer</button>
            <p>{message}</p>
        </div>
    );
};

export default TokenCreationForm;
