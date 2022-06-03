import { useContract } from "@thirdweb-dev/react";
import { useEffect } from 'react';

export const CustomContract = ({ setContract, contractAddress }) => {
  const { contract } = useContract(contractAddress);

  useEffect(() => {
    setContract(state => ({ ...state, contract }));
    console.log(contract);
  }, [contract, setContract, contractAddress]);

  return null;
};