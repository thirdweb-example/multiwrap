import {
  useAddress,
  useDisconnect,
  useMetamask,
  useMultiwrap,
  useNFTs,
  useSDK,
} from "@thirdweb-dev/react";
import { useState } from "react";

const multiwrapAddress = "0xc84A8236e5dE1F1DD67aa6156A93155A9B0B4f6a";

export default function Home() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const multiwrap = useMultiwrap(multiwrapAddress);
  const sdk = useSDK();
  const nfts = useNFTs(multiwrap)

  // Store the state of each input fields
  const [erc721, setErc721] = useState({
    tokenId: "",
    contractAddress: "",
  });
  const [erc1155, setErc1155] = useState({
    tokenId: "",
    contractAddress: "",
    quantity: "",
  });
  const [erc20, setErc20] = useState({
    contractAddress: "",
    quantity: "",
  });

  const wrap = async (e) => {
    e.preventDefault();
    // If there is a value for each erc721, erc1155, and erc20, include them in array
    const tokensToWrap = {
      erc20Tokens: erc20.contractAddress ? [erc20] : [],
      erc721Tokens: erc721.contractAddress ? [erc721]: [],
      erc1155Tokens: erc1155.contractAddress? [erc1155]: [],
    };

    try {
      // Approve each of the tokens for transfer into the multiwrap NFT
      const approvalCalls = [];

      // 1. ERC 20 tokens
      if (erc20.contractAddress && erc20.quantity) {
        const erc20Contract = sdk.getToken(erc20.contractAddress);
        approvalCalls.push(erc20Contract.setAllowance(multiwrapAddress, erc20.quantity));
      }
      // 2. ERC1155 tokens
      if (erc1155.contractAddress) {
        const erc1155Contract = sdk.getEdition(erc1155.contractAddress);
        approvalCalls.push(erc1155Contract.setApprovalForAll(multiwrapAddress, true));
      }

      // 3. ERC721 tokens
      if (erc721.contractAddress && erc721.tokenId) {
        const erc721Contract = sdk.getNFTCollection(erc721.contractAddress);
        approvalCalls.push(erc721Contract.setApprovalForToken(multiwrapAddress, erc721.tokenId));
      }

      // Execute all of the approvals
      await Promise.all(approvalCalls);

      // Now we have the approval, we can wrap them all together
      await multiwrap.wrap(tokensToWrap, {
        name: "My Wrapped Token",
      });

      alert("Successfully wrapped!");
    } catch (error) {
      console.log(error);
    }
  };

  if (!address) {
    return <button onClick={connectWithMetamask}>Connect with Metamask</button>;
  }

  return (
    <div>
      <button onClick={disconnectWallet}>Disconnect Wallet</button>
      <p>Your address: {address}</p>

      <form>
        <div>
          <input
            type="text"
            placeholder="ERC721 contract address"
            onChange={(e) => setErc721({ ...erc721, contractAddress: e.target.value })}
          />
          <input
            type="text"
            placeholder="ERC721 token ID"
            onChange={(e) => setErc721({ ...erc721, tokenId: e.target.value })}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="ERC1155 contract address"
            onChange={(e) =>
              setErc1155({ ...erc1155, contractAddress: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="ERC1155 token ID"
            onChange={(e) =>
              setErc1155({ ...erc1155, tokenId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="ERC1155 quantity"
            onChange={(e) =>
              setErc1155({ ...erc1155, quantity: e.target.value })
            }
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="ERC20 contract address"
            onChange={(e) => setErc20({ ...erc20, contractAddress: e.target.value })}
          />
          <input
            type="text"
            placeholder="ERC20 quantity"
            onChange={(e) => setErc20({ ...erc20, quantity: e.target.value })}
          />
        </div>

        <button type="submit" onClick={wrap}>
          Wrap
        </button>

        <hr />

        {(nfts.data || []).map(nft => nft.metadata.name)}
      </form>
    </div>
  );
}
