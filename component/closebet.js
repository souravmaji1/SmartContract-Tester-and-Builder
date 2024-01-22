import React, { useState } from "react";
import { useContract, useContractWrite } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("0xc1FaB1F6f3726f28d0f306864FADCf7739EAD215");
  const { mutateAsync: closeBet, isLoading } = useContractWrite(contract, "closeBet");
  const [betId, setBetId] = useState(""); // State to store user input

  const call = async () => {
    try {
      const data = await closeBet({ args: [betId] });
      console.info("Contract call success", data);
    } catch (err) {
      console.error("Contract call failure", err);
    }
  }

  return (
    <div>
      <h2>Close Bet</h2>
      <label htmlFor="betIdInput">Bet ID: </label>
      <input
        type="text"
        id="betIdInput"
        value={betId}
        onChange={(e) => setBetId(e.target.value)}
      />
      <button onClick={call} disabled={isLoading}>
        {isLoading ? "Calling..." : "Close Bet"}
      </button>
    </div>
  );
}
