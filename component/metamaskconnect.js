'use client'
import { useState } from 'react';
import { ethers } from 'ethers';

function MetaMaskComponent() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Not Connected');
  const [error, setError ] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setStatus('Not Connected');
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      setStatus('Connected');
    }
  };

  // Function to claim airdrop
const claimAirdrop = async () => {
  // Connect to the Ethereum provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (!provider) return;

  const contractAddress = "0xc13DA26790C4A2fFeF9a9a509c6B7a0B578c1810";
  const abi = [];

  // Create a new instance of the contract
  const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

  try {
    // Call the claimAirdrop function
    const tx = await contract.claimAirdrop();
    
    // Wait for the transaction to be mined
    await tx.wait();

    console.log('Airdrop claimed successfully!');
  } catch (error) {
    setError(error.reason);
    console.error('Error claiming airdrop:', error.message);
  }
};

  return (
    <div>
      <h1>MetaMask Account</h1>
      <p>Status: {status}</p>
      <p>Address: {account}</p>
      {status === 'Connected' && (
        <>
        <button onClick={disconnectWallet}>Disconnect Wallet</button>
        <button onClick={claimAirdrop}>Claim Airdrop</button>
        {error}
        </>
      )}
      {status !== 'Connected' && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default MetaMaskComponent;
