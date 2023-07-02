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

const StyledInput = styled.input`
    padding: 0.4rem 0.6rem;
`;

const StyledButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: blue;
    cursor: pointer;
`;

const ContractCall = () => {
    const { active, library } = useWeb3React();
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState("");
    const [singer, setSigner] = useState();
    const [greeting, setGreeting] = useState("");
    const [greetingInput, setGreetingInput] = useState("");

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
                window.alert("error:" + err && err.message ? `${err.message}` : "");
            }
        }

        deployGreetingContract();
    };

    useEffect(() => {
        if (!greetingContract) {
            return;
        }
        async function getGreeting(greetingContract) {
            const _greeting = await greetingContract.greet();

            if (_greeting !== greeting) {
                setGreeting(_greeting);
            }
        }

        getGreeting(greetingContract);
    }, [greeting, greetingContract]);

    const handleGreetingChange = (e) => {
        setGreetingInput(e.target.value);
    };

    const handleGreetingSubmit = () => {
        if (!greetingContract) {
            window.alert("Undefined greeting Contract!");
            return;
        }

        if (!greetingInput) {
            window.alert("Greeting cannot be empty");
        }

        async function submitGreeting(greetingContract) {
            try {
                const setGreetingTxn = await greetingContract.setGreeting(greetingInput);
                await setGreetingTxn.wait();

                const newGreeting = await greetingContract.greet();
                window.alert(`Success : ${newGreeting}`);

                if (newGreeting !== greeting) {
                    setGreeting(newGreeting);
                }
            } catch (err) {
                window.alert("error:" + err && err.message ? `${err.message}` : "");
            }
        }
        submitGreeting(greetingContract);
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
            <StyledGreetingDiv>
                <StyledLabel>Set new Greeting</StyledLabel>
                <StyledInput id="greetingInput" type="text" placeholder={greeting ? "" : "Contract not yet deployed"} onChange={handleGreetingChange} />
                <StyledButton disabled={!active || !greetingContract ? true : false} onClick={handleGreetingSubmit}>
                    Submit
                </StyledButton>
            </StyledGreetingDiv>
        </>
    );
};

export default ContractCall;
