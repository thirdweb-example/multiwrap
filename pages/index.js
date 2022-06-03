import { useAddress, useDisconnect, useMetamask, useMultiwrap } from '@thirdweb-dev/react';
import { CustomContract } from '../components/CustomContract';
import { useState } from 'react';
import {BigNumber, ethers} from "ethers";

const multiwrapAddress = "0xc84A8236e5dE1F1DD67aa6156A93155A9B0B4f6a";

export default function Home() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const multiwrap = useMultiwrap(multiwrapAddress);

  const [erc721, setErc721] = useState({ contract: null, tokenId: null, address: null });
  const [erc1155, setErc1155] = useState({ contract: null, tokenId: null, address: null, quantity: null });
  const [erc20, setErc20] = useState({ contract: null, address: null, quantity: null });

  const wrap = async (e) => {
    e.preventDefault();
    const tokensToWrap = {
      erc20Tokens: [
        {
          contractAddress: erc20.address,
          quantity: erc20.quantity,
        },
      ],
      erc721Tokens: [
        {
          contractAddress: erc721.address,
          tokenId: erc721.tokenId,
        },
      ],
      erc1155Tokens: [
        {
          contractAddress: erc1155.address,
          tokenId: erc1155.tokenId,
          quantity: erc1155.quantity,
        },
      ],
    };

    try {
      if (erc20.contract !== null ) {
        //@TODO Get contract decimals dynamically
        const balance = await erc20.contract.call("balanceOf", address);
        console.log(ethers.utils.parseUnits(erc20.quantity, 18));
        const perm = await erc20.contract.call("approve", multiwrapAddress, ethers.utils.parseUnits(erc20.quantity, 18));
        console.log("Permission Request", perm);
      }
      if (erc1155.contract !== null) {
        await erc1155.contract.call("approve", multiwrapAddress, erc1155.tokenId);
      }
      if (erc721.contract !== null) {
        console.log("It's trying stupid")
        await erc721.contract.call("approve", multiwrapAddress, erc721.tokenId);
      }

      await multiwrap.wrap(tokensToWrap, { name: "My Wrapped Token" });
    } catch (error) {
      console.log(error);
    }
  };


  if (!address) {
    return (
      <button onClick={connectWithMetamask}>Connect with Metamask</button>
    );
  }

  return (
    <div>
      <button onClick={disconnectWallet}>Disconnect Wallet</button>
      <p>Your address: {address}</p>

      <form>
        <div>
          <CustomContract setContract={setErc721} contractAddress={erc721.address} />
          <input type="text" placeholder="ERC721 contract address" onChange={(e) => setErc721({ ...erc721, address: e.target.value })} />
          <input type="text" placeholder="ERC721 token ID" onChange={(e) => setErc721({ ...erc721, tokenId: e.target.value })} />
        </div>
        <div>
          <CustomContract setContract={setErc1155} contractAddress={erc1155.address} />
          <input type="text" placeholder="ERC1155 contract address" onChange={(e) => setErc1155({ ...erc1155, address: e.target.value })} />
          <input type="text" placeholder="ERC1155 token ID" onChange={(e) => setErc1155({ ...erc1155, tokenId: e.target.value })} />
          <input type="text" placeholder="ERC1155 quantity" onChange={(e) => setErc1155({ ...erc1155, quantity: e.target.value })} />
        </div>
        <div>
          <CustomContract setContract={setErc20} contractAddress={erc20.address} />
          <input type="text" placeholder="ERC20 contract address" onChange={(e) => setErc20({ ...erc20, address: e.target.value })} />
          <input type="text" placeholder="ERC20 quantity" onChange={(e) => setErc20({ ...erc20, quantity: e.target.value })} />
        </div>
        <button type="submit" onClick={wrap}>Wrap</button>
      </form>
    </div>
  );
}
