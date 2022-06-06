import {
  useAddress,
  useDisconnect,
  useMetamask,
  useMultiwrap,
  useNFTs,
  useSDK,
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

const multiwrapAddress = "0x0638C4f2FB4C9f85219BDAd85fE0297095F9a4D8";

export default function Home() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const multiwrap = useMultiwrap(multiwrapAddress);
  const sdk = useSDK();
  const nfts = useNFTs(multiwrap);

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
      erc721Tokens: erc721.contractAddress ? [erc721] : [],
      erc1155Tokens: erc1155.contractAddress ? [erc1155] : [],
    };

    try {
      // Approve each of the tokens for transfer into the multiwrap NFT
      const approvalCalls = [];

      // 1. ERC 20 tokens
      if (erc20.contractAddress && erc20.quantity) {
        const erc20Contract = sdk.getToken(erc20.contractAddress);
        approvalCalls.push(
          erc20Contract.setAllowance(multiwrapAddress, erc20.quantity)
        );
      }
      // 2. ERC1155 tokens
      if (erc1155.contractAddress) {
        const erc1155Contract = sdk.getEdition(erc1155.contractAddress);
        approvalCalls.push(
          erc1155Contract.setApprovalForAll(multiwrapAddress, true)
        );
      }

      // 3. ERC721 tokens
      if (erc721.contractAddress && erc721.tokenId) {
        const erc721Contract = sdk.getNFTCollection(erc721.contractAddress);
        approvalCalls.push(
          erc721Contract.setApprovalForToken(multiwrapAddress, erc721.tokenId)
        );
      }

      // Execute all of the approvals
      await Promise.all(approvalCalls);
      console.log("Approvals complete");

      // Now we have the approval, we can wrap them all together
      console.log("Wrapping token");
      await multiwrap.wrap(tokensToWrap, {
        name: "My Wrapped Token",
      });
      console.log("Wrapping complete");

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
      <hr />
      <h3>
        Enter the contract addresses (Rinkeby only) and token ids to wrap:
      </h3>

      <form>
        <div>
          <input
            type="text"
            placeholder="ERC721 contract address"
            onChange={(e) =>
              setErc721({ ...erc721, contractAddress: e.target.value })
            }
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
            onChange={(e) =>
              setErc20({ ...erc20, contractAddress: e.target.value })
            }
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
        <h3>Multiwrap contract info:</h3>
        <p>{multiwrap.getAddress()} (Rinkeby)</p>
        {(nfts.data || []).map((nft) => (
          <WrappedNFT key={nft.metadata.id} multiwrap={multiwrap} nft={nft} />
        ))}
      </form>
    </div>
  );
}

function WrappedNFT({ multiwrap, nft }) {
  const [wrappedContents, setContents] = useState();
  useEffect(() => {
    const fetchContents = async () => {
      return await multiwrap.getWrappedContents(0);
    };
    fetchContents()
      .then((contents) => setContents(contents))
      .catch((error) => console.log(error));
  }, [multiwrap, nft]);

  if (!nft || !wrappedContents) {
    return null;
  }

  return (
    <div>
      <h4>
        #{nft.metadata.id.toString()} - {nft.metadata.name}
      </h4>
      <p>
        wrapped ERC20s: {wrappedContents.erc20Tokens.length}
        <br />
        wrapped ERC721s: {wrappedContents.erc721Tokens.length}
        <br />
        wrapped ERC1166s: {wrappedContents.erc1155Tokens.length}
      </p>
    </div>
  );
}
