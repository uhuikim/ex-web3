import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import GreetingArtifact from "../artifacts/contracts/Greeting.sol/Greeting.json";
import styled from "styled-components";

const StyledDeployContractButton = styled.button`
    width: 180px;
    height: 2rem;
    border-radius: 1rem;
    border-color: blue;
    cursor: pointer;
    place-self: center;
`;
const StyledGreetingDiv = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;
const StyledLabel = styled.label`
    font-weight: bold;
`;

const ContractCall = () => {
    const { active, library } = useWeb3React();
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState("");
    const [singer, setSigner] = useState();
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        if (!library) {
            setSigner(null);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    const handelDeployContract = () => {
        if (greetingContract) {
            return;
        }

        async function deployGreetingContract() {
            const Greeting = new ethers.ContractFactory(GreetingArtifact.abi, GreetingArtifact.bytecode, singer);

            try {
                const greetingContract = await Greeting.deploy("hello");
                greetingContract.deployed();

                const greeting = await greetingContract.greet();

                setGreetingContract(greetingContract);
                setGreeting(greeting);
                setGreetingContractAddr(greetingContract.address);
                window.alert(`Greeting deployed to : ${greetingContract.address}`);
            } catch (err) {
                console.error(err);
                window.alert("error:", err && err.message ? `${err.message}` : "");
            }
        }

        deployGreetingContract();
    };
    return (
        <>
            <StyledDeployContractButton disabled={!active || greetingContract ? true : false} onClick={handelDeployContract}>
                Deploy Greeting Contract
            </StyledDeployContractButton>
            <StyledGreetingDiv>
                <StyledLabel>Contract Address</StyledLabel>
                <div>{greetingContractAddr ? greetingContractAddr : "Contract not yet deployed!"} </div>
            </StyledGreetingDiv>
            <StyledGreetingDiv>
                <StyledLabel>Greeting :</StyledLabel>
                <div> {greeting ? greeting : "Contract not yet deployed"}</div>
            </StyledGreetingDiv>
        </>
    );
};

export default ContractCall;
