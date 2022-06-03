import { useContract } from "@thirdweb-dev/react";
import { useEffect } from "react";

export const CustomContract = ({ setContract, contractAddress }) => {
  // Fetch the contract from the blockchain by its address
  const { contract } = useContract(contractAddress);

  // Whenever the contract is passed in, fetch the contract and set it in the state
  useEffect(() => {
    setContract((state) => ({ ...state, contract }));
  }, [contract, setContract, contractAddress]);

  return null;
};
