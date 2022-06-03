## Getting Started

First, intall the required dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

On `pages/_app.js`, you'll find our `ThirdwebProvider` wrapping your app, this is necessary for our hooks to work.

on `pages/index.js`, you'll find the `useMetamask` hook that we use to connect the user's wallet to MetaMask, `useDisconnect` that we use to disconnect it, and `useAddress` to check the user's wallet address once connected. 


# Multiwrap Example

## Introduction

In this guide, we will utilize the [**Multiwrap**](https://portal.thirdweb.com/typescript/sdk.multiwrap) contract.

Multiwrap lets you wrap any number of ERC20, ERC721 and ERC1155 tokens you own into a single wrapped token bundle.

The single wrapped token received on bundling up multiple assets, as mentioned above, is an ERC721 NFT. It can be transferred, sold on any NFT Marketplace, and generate royalties just like any other NFTs.


**Check out the Demo here**: https://multiwrap-demo.vercel.app/
## Tools:
- [**thirdweb Multiwrap**](https://portal.thirdweb.com/typescript/sdk.multiwrap)


- [**thirdweb React SDK**](https://docs.thirdweb.com/react): The use of hooks such as [useMetamask](https://portal.thirdweb.com/react/react.usemetamask), [useAddress](https://portal.thirdweb.com/react/react.useaddress), [useNFTs](https://portal.thirdweb.com/react/react.usenfts) and a few others.

## Using This Repo

- Create a Multiwrap contract via the thirdweb dashboard on the Ethereum Rinkeby (RINKEBY) test network.

- Clone this repository.

```bash
npm install
# or
yarn install
```

# Guide

### Getting the Multiwrap contract

```js
const multiwrap = useMultiwrap(multiwrapAddress);
```

### Give permission to your multiwrap contract to move your assets
```js
// Get the contracts
const erc20Contract = sdk.getToken(erc20TokenAddress);
const erc721Contract = sdk.getNFTCollection(erc721TokenAddress);
const erc1155Contract = sdk.getEdition(erc1155TokenAddress);

// Give permissions to the Multiwrap contract
await tokenContract.setAllowance(multiwrapAddress, 20);
await erc721Contract.setApprovalForToken(multiwrapAddress, tokenId);
await erc1155Contract.setApprovalForAll(multiwrapAddress, true)
```

### Wrapping Tokens

The SDK takes in a structure containing the tokens to be wrapped. This array is further grouped into the individual types of tokens.

```js
const tokensToWrap = {
    erc20Tokens: [
        {
            contractAddress: "0x.....",
            quantity: 20,
        },
    ],
    erc721Tokens: [
        {
            contractAddress: "0x.....",
            tokenId: "0",
        },
    ],
    erc1155Tokens: [
        {
            contractAddress: "0x.....",
            tokenId: "0",
            quantity: 1,
        },
    ],
}
```

We then pass these tokens to the contracts wrap function along with the NFT Metadata for our wrapped tokens.

```jsx
const nftMetadata = {
    name: "Wrapped bundle",
    description: "This is a wrapped bundle of tokens and NFTs",
    image: "ipfs://...",
}
```

```jsx
const tx = await multiwrapContract.wrap(tokensTowrap, nftMetadata)

const receipt = tx.receipt(); // the transaction receipt
const wrappedTokenId = tx.id; // the id of the wrapped token bundle
```


## Unwrapping Tokens

To unwrap tokens, we call [.unwrap](https://portal.thirdweb.com/typescript/sdk.multiwrap.unwrap). It will return the tokens in the same structure we used in the input.

```jsx
await multiwrapContract.unwrap(wrappedTokenId);
```
```jsx
const tokensToWrap = {
    erc20Tokens: [
        {
            contractAddress: "0x.....",
            quantity: 20,
        },
    ],
    erc721Tokens: [
        {
            contractAddress: "0x.....",
            tokenId: "0",
        },
    ],
    erc1155Tokens: [
        {
            contractAddress: "0x.....",
            tokenId: "0",
            quantity: 1,
        },
    ],
}
```

## Get wrapped Contents

Get the contents of a wrapped token bundle.

```jsx
const contents = await multiwrapContract.getWrappedContents(wrappedTokenId);
console.log(contents.erc20Tokens);
console.log(contents.erc721Tokens);
console.log(contents.erc1155Tokens);
```

## Learn More

To learn more about thirdweb and Next.js, take a look at the following resources:

- [thirdweb React Documentation](https://docs.thirdweb.com/react) - learn about our React SDK.
- [thirdweb JavaScript Documentation](https://docs.thirdweb.com/react) - learn about our JavaScript/TypeScript SDK.
- [thirdweb Portal](https://docs.thirdweb.com/react) - check our guides and development resources.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

You can check out [the thirdweb GitHub organization](https://github.com/thirdweb-dev) - your feedback and contributions are welcome!


## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/cd thirdweb](https://discord.gg/thirdweb).

