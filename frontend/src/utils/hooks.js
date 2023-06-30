import { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";

export function useWeb3Connect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  const tryActivate = useCallback(async () => {
    const isAuthorized = await injected.isAuthorized();

    if (isAuthorized) {
      try {
        await activate(injected, undefined, true);
      } catch (err) {
        window.alert(`err : ${err && err.message} `);
      }
    }
    setTried(true);
  }, [activate]);

  useEffect(() => {
    tryActivate();
  }, [tryActivate]);

  useEffect(() => {
    if (tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

// chain 변경, accout 변경 등 이더리움 이벤트 감지 => web3 리액트 반영
export function useInactiveListener(suppress = false) {
  const { activate, active, error } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        console.log(chainId);
        activate(injected);
      };
      const handleAccountChanged = (accounts) => {
        console.log(accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountChanged);
        }
      };
    }
  }, [active, error, activate, suppress]);
}
