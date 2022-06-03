import {
  useAddress,
  useDisconnect,
  useMetamask,
  useMultiwrap,
  useToken,
} from "@thirdweb-dev/react";
import { CustomContract } from "../components/CustomContract";
import { useState } from "react";
import { ethers } from "ethers";

const multiwrapAddress = "0xc84A8236e5dE1F1DD67aa6156A93155A9B0B4f6a";

export default function Home() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const multiwrap = useMultiwrap(multiwrapAddress);

  // Store the state of each input fields
  const [erc721, setErc721] = useState({
    contract: null,
    tokenId: null,
    address: null,
  });
  const [erc1155, setErc1155] = useState({
    contract: null,
    tokenId: null,
    address: null,
    quantity: null,
  });
  const [erc20, setErc20] = useState({
    contract: null,
    address: null,
    quantity: null,
  });

  const wrap = async (e) => {
    // If there is a value for each erc721, erc1155, and erc20, include them in array

    e.preventDefault();
    const tokensToWrap = {
      erc20Tokens: erc20.contract
        ? [
            {
              contractAddress: erc20.address,
              quantity: erc20.quantity,
            },
          ]
        : [],
      erc721Tokens: erc721.contract
        ? [
            {
              contractAddress: erc721.address,
              tokenId: erc721.tokenId,
            },
          ]
        : [],
      erc1155Tokens: erc1155.contract
        ? [
            {
              contractAddress: erc1155.address,
              tokenId: erc1155.tokenId,
              quantity: erc1155.quantity,
            },
          ]
        : [],
    };

    try {
      // Approve each of the tokens for transfer into the multiwrap NFT

      // 1. ERC 20 tokens
      if (erc20.contract !== null) {
        const approveErc20Transfer = await erc20.contract.call(
          "approve",
          multiwrapAddress,
          // This is formatting the quantity to 18 decimal places
          ethers.utils.parseUnits(erc20.quantity, 18)
        );
      }

      // 2. ERC1155 tokens
      if (erc1155.contract !== null) {
        await erc1155.contract.call(
          "approve",
          multiwrapAddress,
          erc1155.tokenId
        );
      }

      // 3. ERC721 tokens
      if (erc721.contract !== null) {
        await erc721.contract.call("approve", multiwrapAddress, erc721.tokenId);
      }

      // Now we have the approval, we can wrap them all together
      const newToken = await multiwrap.wrap(tokensToWrap, {
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
          <CustomContract
            setContract={setErc721}
            contractAddress={erc721.address}
          />
          <input
            type="text"
            placeholder="ERC721 contract address"
            onChange={(e) => setErc721({ ...erc721, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="ERC721 token ID"
            onChange={(e) => setErc721({ ...erc721, tokenId: e.target.value })}
          />
        </div>

        <div>
          <CustomContract
            setContract={setErc1155}
            contractAddress={erc1155.address}
          />
          <input
            type="text"
            placeholder="ERC1155 contract address"
            onChange={(e) =>
              setErc1155({ ...erc1155, address: e.target.value })
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
          <CustomContract
            setContract={setErc20}
            contractAddress={erc20.address}
            useFunction={useToken}
          />
          <input
            type="text"
            placeholder="ERC20 contract address"
            onChange={(e) => setErc20({ ...erc20, address: e.target.value })}
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

        {/* TODO Get all */}
      </form>
    </div>
  );
}
