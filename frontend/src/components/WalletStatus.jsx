import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import styled from "styled-components";

const StyledWalletStatusDiv = styled.div`
  display: flex;
  gap: 20px;
`;

const ChainId = () => {
  const { chainId } = useWeb3React();

  return (
    <>
      <span>Chain Id</span>
      <span>{chainId}</span>
    </>
  );
};

const BlockNumber = () => {
  const { chainId, library } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    if (!library) return;

    let stale = false;
    async function getBlockNumber() {
      try {
        const blockNumber = await library.getBlockNumber();
        if (!stale) {
          setBlockNumber(blockNumber);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getBlockNumber();

    library.on("block", setBlockNumber);

    return () => {
      stale = true;
      //   library.removeListner("block", setBlockNumber);
      setBlockNumber(null);
    };
  }, [library, chainId]);

  return (
    <>
      <span>Block Number</span>
      <span>{blockNumber}</span>
    </>
  );
};

const Account = () => {
  const { account } = useWeb3React();

  return (
    <>
      <span>Account : </span>
      <span>
        {account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ""}
      </span>
    </>
  );
};

const Balance = () => {
  const { account, library, chainId } = useWeb3React();
  const [balance, setBalance] = useState();

  useEffect(() => {
    if (typeof account === "undefined" || account === null || !library) {
      return;
    }

    let stale = false;

    async function getBalance() {
      try {
        const balance = await library.getBalance(account);

        if (!stale) {
          setBalance(balance);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getBalance();

    library.on("block", getBalance);

    return () => {
      stale = true;
      //   library.removeListner("block", getBalance);
      setBalance(null);
    };
  }, [account, library, chainId]);

  console.log(balance);
  return (
    <>
      <span>Balance : </span>
      <span>{balance ? `${ethers.utils.formatEther(balance)} ETH` : ""}</span>
    </>
  );
};
const NextNonce = () => {
  const { account, library, chainId } = useWeb3React();
  const [nextNonce, setNextNonce] = useState();

  useEffect(() => {
    if (typeof account === "undefined" || account === null || !library) {
      return;
    }

    let stale = false;
    async function getNextNonce() {
      try {
        const nextNonce = await library.getTransactionCount(account);
        if (!stale) {
          setNextNonce(nextNonce);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getNextNonce();
    library.on("block", getNextNonce);
    return () => {
      stale = true;
      //   library.removeListner("block", getNextNonce);
      setNextNonce(null);
    };
  }, [account, library, chainId]);

  return (
    <>
      <span>NextNonce : </span>
      <span>{nextNonce || ""}</span>
    </>
  );
};

const WalletStatus = () => {
  return (
    <StyledWalletStatusDiv>
      <ChainId />
      <BlockNumber />
      <Account />
      <Balance />
      <NextNonce />
    </StyledWalletStatusDiv>
  );
};

export default WalletStatus;
