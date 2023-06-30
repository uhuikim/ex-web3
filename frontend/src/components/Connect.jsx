import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected } from "../utils/connectors";
import { useState } from "react";
import { useInactiveListener, useWeb3Connect } from "../utils/hooks";
import styled from "styled-components";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";

const StyledActivateButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: green;
  cursor: pointer;
`;
const StyledDeactivateButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: red;
  cursor: pointer;
`;

const Activate = () => {
  const { activate, active } = useWeb3React();
  const [activating, setActivating] = useState(false);

  const handleActivate = async (e) => {
    setActivating(true);
    await activate(injected);
    setActivating(false);
  };

  const connectionSuccessful = useWeb3Connect();
  useInactiveListener(!connectionSuccessful);

  return (
    <StyledActivateButton
      disabled={active}
      onClick={handleActivate}
      style={{
        borderColor: activating ? "orange" : active ? "unset" : "green",
      }}
    >
      connect
    </StyledActivateButton>
  );
};
const DeActivate = () => {
  const { active, deactivate } = useWeb3React();

  const handleDeactivate = () => {
    deactivate();
  };
  return (
    <StyledDeactivateButton
      disabled={!active}
      onClick={handleDeactivate}
      style={{
        borderColor: active ? "red" : "unset",
      }}
    >
      disconnect
    </StyledDeactivateButton>
  );
};

function getErrorMessage(error) {
  let errorMessage;

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage =
        "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
      break;

    case UnsupportedChainIdError:
      errorMessage = "You're connected to an unsupported network";
      break;

    case UserRejectedRequestError:
      errorMessage =
        "Please authorize this website to access your Ethereum account.";
      break;

    default:
      errorMessage = error.message;
  }

  return errorMessage;
}

export const Connect = () => {
  const { error } = useWeb3React();

  if (error) {
    window.alert(getErrorMessage(error));
  }

  return (
    <>
      <Activate />
      <DeActivate />
    </>
  );
};
