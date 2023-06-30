import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 3rem;
  border-color: blue;
  cursor: poiter;
`;

export function SignMessage() {
  const { account, active, library } = useWeb3React();
  const handleSignMessage = () => {
    if (!library || !account) {
      window.alert("wallet is not connected");
      return;
    }

    async function SignMessage() {
      try {
        const signature = await library
          .getSigner(account)
          .signMessage("Hello~!");
        window.alert(`success!${signature}`);
      } catch (err) {
        console.error(err);
      }
    }
    SignMessage();
  };

  return (
    <StyledButton
      disabled={!active ? true : false}
      style={{
        borderColor: !active ? "unset" : "blue",
      }}
      onClick={handleSignMessage}
    >
      Sing Message
    </StyledButton>
  );
}
