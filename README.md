// Assuming your dependencies are imported here
'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Collapse,
} from '@mui/material';

function MetaMaskComponent() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Not Connected');
  const [error, setError] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [abi, setAbi] = useState([]);
  const [writeFunctions, setWriteFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [functionInputs, setFunctionInputs] = useState({});
  const [showFullAbi, setShowFullAbi] = useState(false);

  useEffect(() => {
    if (contractAddress && abi.length > 0) {
      const contract = new ethers.Contract(contractAddress, abi);
      const writeFunctions = contract.interface.fragments
        .filter((fragment) => fragment.type === 'function' && fragment.stateMutability !== 'view')
        .map((fragment) => fragment.name);

      setWriteFunctions(writeFunctions);
    }
  }, [contractAddress, abi]);

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

  const claimAirdrop = async () => {
    if (!contractAddress || abi.length === 0) {
      setError('Contract address and ABI are required.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!provider) return;

    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

    try {
      if (!selectedFunction) {
        setError('Please select a function to call.');
        return;
      }

      const selectedFunctionFragment = abi.find(
        (fragment) => fragment.type === 'function' && fragment.name === selectedFunction
      );

      const inputs = selectedFunctionFragment.inputs || [];
      const args = inputs.map((input) => functionInputs[input.name]);

      const tx = await contract[selectedFunction](...args);
      await tx.wait();

      console.log(`Function ${selectedFunction} called successfully!`);
    } catch (error) {
      setError(error.reason || error.message);
      console.error(`Error calling function ${selectedFunction}:`, error.message);
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        MetaMask Account
      </Typography>
      <Typography variant="subtitle1">Status: {status}</Typography>
      <Typography variant="subtitle1">Address: {account}</Typography>

      {status === 'Connected' && (
        <>
          <TextField
            label="Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Collapse in={!showFullAbi} collapsedHeight={60}>
            <TextField
              label="ABI"
              multiline
              rows={showFullAbi ? 10 : 2}
              value={JSON.stringify(abi, null, 2)}
              onChange={(e) => setAbi(JSON.parse(e.target.value))}
              fullWidth
              margin="normal"
            />
          </Collapse>
          <Button
            onClick={() => setShowFullAbi(!showFullAbi)}
            size="small"
            color="primary"
            style={{ marginTop: '5px' }}
          >
            {showFullAbi ? 'Show Less' : 'Show More'}
          </Button>

          {writeFunctions.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Function</InputLabel>
              <Select value={selectedFunction} onChange={(e) => setSelectedFunction(e.target.value)}>
                <MenuItem value="">Select a function</MenuItem>
                {writeFunctions.map((func) => (
                  <MenuItem key={func} value={func}>
                    {func}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedFunction && (
            <div>
              <Typography variant="h6">Function Inputs:</Typography>
              {abi
                .find((fragment) => fragment.name === selectedFunction)
                .inputs.map((input) => (
                  <div key={input.name} style={{ marginBottom: '10px' }}>
                    <TextField
                      label={input.name}
                      value={functionInputs[input.name] || ''}
                      onChange={(e) =>
                        setFunctionInputs({
                          ...functionInputs,
                          [input.name]: e.target.value,
                        })
                      }
                      fullWidth
                    />
                  </div>
                ))}
            </div>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={claimAirdrop}
            style={{ marginTop: '20px' }}
          >
            Call Selected Function
          </Button>
          {error && (
            <Typography color="error" style={{ marginTop: '10px' }}>
              Error: {error}
            </Typography>
          )}
          <Button
            variant="outlined"
            color="secondary"
            onClick={disconnectWallet}
            style={{ marginTop: '10px' }}
          >
            Disconnect Wallet
          </Button>
        </>
      )}

      {status !== 'Connected' && (
        <Button
          variant="contained"
          color="primary"
          onClick={connectWallet}
          style={{ marginTop: '20px' }}
        >
          Connect Wallet
        </Button>
      )}
    </Paper>
  );
}

export default MetaMaskComponent;
