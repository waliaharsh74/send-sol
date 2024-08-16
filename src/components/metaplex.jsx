import { create } from '@metaplex-foundation/mpl-core'
import { createGenericFile, generateSigner, signerIdentity, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// Ensure you have a connected wallet public key


const createNft = async (walletPublicKey) => {
    // ** Setting Up Umi **
    const umi = createUmi('https://api.devnet.solana.com')

    // Ensure Phantom wallet is connected
    const signer = generateSigner(umi)
    umi.use(signerIdentity(signer))

    // Airdrop SOL
    await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

    // ** Upload Image to Arweave **
    const imageFilePath = path.resolve(__dirname, '../../public/ape.jpeg')
    const imageFile = fs.readFileSync(imageFilePath)

    const umiImageFile = createGenericFile(imageFile, 'ape.jpeg', {
        tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
    })

    const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
        throw new Error(`Image upload failed: ${err.message}`)
    })

    console.log('Image URI: ' + imageUri[0])

    // ** Upload Metadata to Arweave **
    const metadata = {
        name: 'My NFT',
        description: 'This is an NFT on Solana',
        image: imageUri[0],
        external_url: 'https://example.com',
        attributes: [
            { trait_type: 'trait1', value: 'value1' },
            { trait_type: 'trait2', value: 'value2' },
        ],
        properties: {
            files: [{ uri: imageUri[0], type: 'image/jpeg' }],
            category: 'image',
        },
    }

    const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
        throw new Error(`Metadata upload failed: ${err.message}`)
    })

    // ** Creating the NFT **
    const nftSigner = generateSigner(umi)
    const tx = await create(umi, {
        asset: nftSigner,
        name: 'My NFT',
        uri: metadataUri,
    }).sendAndConfirm(umi)

    const signature = base58.deserialize(tx.signature)
    console.log('Transaction Signature: ' + signature)
}

export default createNft
