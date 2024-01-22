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
  const [interactionCode, setInteractionCode] = useState('');
  const [disconnectCode, setDisconnectCode] = useState('');
  const [connectCode, setConnectCode] = useState('');

  useEffect(() => {
    if (contractAddress && abi.length > 0) {
      const contract = new ethers.Contract(contractAddress, abi);
      const writeFunctions = contract.interface.fragments
        .filter((fragment) => fragment.type === 'function' && fragment.stateMutability !== 'view')
        .map((fragment) => fragment.name);

      setWriteFunctions(writeFunctions);
    }
  }, [contractAddress, abi]);

  useEffect(() => {
    if (contractAddress && selectedFunction && abi.length > 0) {
      const contract = new ethers.Contract(contractAddress, abi);
      const functionFragment = abi.find((fragment) => fragment.name === selectedFunction);

      const inputs = functionFragment.inputs || [];
      const args = inputs.map((input) => functionInputs[input.name]);

      const interactionCode = `

const runFunction = async () => {
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract('${contractAddress}', ${JSON.stringify(abi)}, provider.getSigner());

// Call the selected function
const tx = await contract.${selectedFunction}(${args.join(', ')});
await tx.wait();
console.log(\`Function ${selectedFunction} called successfully!\`);
} catch (error) {
  console.error(error);
}
};
`;

      setInteractionCode(interactionCode);
    } else {
      setInteractionCode('');
    }
  }, [contractAddress, selectedFunction, abi, functionInputs]);

  useEffect(() => {
    const connectCode = `

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

const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
    disconnectWallet();
  } else {
    setAccount(accounts[0]);
    setStatus('Connected');
  }
};
`;
    setConnectCode(connectCode);
  }, []);

  useEffect(() => {
    const disconnectCode = `

const disconnectWallet = () => {
  setAccount('');
  setStatus('Not Connected');
};
`;
    setDisconnectCode(disconnectCode);
  }, []);

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
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px',margin:'inherit' }}>
      <Paper style={{ padding: '20px',background:'black',border:'1px solid gray', maxWidth: '500px', margin: 'auto', ...(status === 'Connected' ? { height: '108vh', overflowY: 'auto' } : {}) }}>
      <Typography variant="h4" gutterBottom sx={{fontFamily:'__Days_One_cad049',color:'white'}}>
        Main Section
      </Typography>
      <div style={{display:'grid',justifyContent:'space-around',padding:'10px',borderRadius:'5px',background:'#3c3e41',marginBottom:'15px'}}>
      <Typography sx={{color:'white'}} variant="subtitle1">Status: {status}</Typography>
      <Typography sx={{color:'white'}} variant="subtitle1">Address: {account}</Typography>
      </div> 

      {status === 'Connected' && (
        <>
        <Typography sx={{color:'white',margin:'0'}} variant="h6">Contract Address:</Typography>
          <TextField
            sx={{background:'#3c3e41',borderRadius:'5px',marginBottom:'15px',color:'white'}}
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            fullWidth
            InputProps={{
              style: {
                color: 'white',
              },
            }}
          />
          <Collapse in={!showFullAbi} collapsedHeight={60}>
          <Typography sx={{color:'white'}} variant="h6">ABI:</Typography>
            <TextField
              sx={{background:'#3c3e41',borderRadius:'5px',marginBottom:'10px',color:'white'}}
              multiline
              rows={showFullAbi ? 10 : 2}
              value={JSON.stringify(abi, null, 2)}
              onChange={(e) => setAbi(JSON.parse(e.target.value))}
              fullWidth
              InputProps={{
                style: {
                  color: 'white',
                },
              }}
            />
          </Collapse>
        {/*  <Button
            onClick={() => setShowFullAbi(!showFullAbi)}
            size="small"
            color="primary"
            style={{ marginTop: '5px' }}
          >
            {showFullAbi ? 'Show More' : 'Show Less'}
      </Button> */}

          {writeFunctions.length > 0 && (
            <FormControl fullWidth margin="normal" sx={{marginBottom:'15px'}}>
              <Typography sx={{color:'white'}} variant="h6">Select Function:</Typography>
             
              <Select sx={{background:'#3c3e41',borderRadius:'5px'}}  value={selectedFunction} onChange={(e) => setSelectedFunction(e.target.value)}>
                <MenuItem  sx={{color:'white'}} value="">Select a function</MenuItem>
                {writeFunctions.map((func) => (
                  <MenuItem   key={func} value={func}>
                    {func}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedFunction && (
            <div>
              <Typography sx={{color:'white'}} variant="h6">Function Inputs:</Typography>
              {abi
                .find((fragment) => fragment.name === selectedFunction)
                .inputs.map((input) => (
                  <div key={input.name} style={{ marginBottom: '10px',background:'#3c3e41',borderRadius:'5px' }}>
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
                      InputProps={{
                        style: {
                          color: 'white',
                        },
                      }}
                    />
                  </div>
                ))}
            </div>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={claimAirdrop}
            style={{ margin: '20px auto',display:'flex',fontFamily:'__Days_One_cad049',background:'#ff5200' }}
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
            style={{ margin: '10px auto',fontFamily:'__Days_One_cad049',display:'flex',color:'#ff5200',border:'2px solid #ff5200' }}
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
          style={{ margin: '20px auto',fontFamily:'__Days_One_cad049',background:'#ff5200',display:'flex' }}
        >
          Connect Wallet
        </Button>
      )}
    </Paper>


    {status === 'Connected' && (
        <>
    <Paper style={{ padding: '20px',background:'black',border:'1px solid gray', maxWidth: '500px', margin: 'auto',width:'-webkit-fill-available',height:'108vh',overflowY:'auto' }}>
    {interactionCode && (
            <>
              <Typography variant="h6" style={{ marginTop: '20px',fontFamily:'__Days_One_cad049',color:'white' }}>
                Interaction Code:
              </Typography>
              <TextField
                multiline
                rows={8}
                sx={{background:'#3c3e41',borderRadius:'5px'}}
                value={interactionCode}
                fullWidth
                variant="outlined"
                InputProps={{
                  style: {
                    color: 'white',
                  },
                  readOnly: true,
                }}
                style={{ marginTop: '10px' }}
              />
                 <Button
                    sx={{margin:'10px auto',fontFamily:'__Days_One_cad049',display:'flex',background:'#ff5200',color:'white',width:'-webkit-fill-available'}}
                      onClick={() => {
                        navigator.clipboard.writeText(interactionCode);
                        alert('Code copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
            </>
          )}
               {connectCode && (
            <>
              <Typography variant="h6" style={{ marginTop: '20px',fontFamily:'__Days_One_cad049',color:'white'}}>
                Connect Wallet Code:
              </Typography>
              <TextField
                multiline
                rows={4}
                sx={{background:'#3c3e41',borderRadius:'5px',color:'white'}}
                value={connectCode}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: {
                    color: 'white',
                  },
                }}
                style={{ marginTop: '10px' }}
              />
               <Button
                sx={{margin:'10px auto',fontFamily:'__Days_One_cad049',display:'flex',background:'#ff5200',color:'white',width:'-webkit-fill-available'}}
                      onClick={() => {
                        navigator.clipboard.writeText(connectCode);
                        alert('Code copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
            </>
          )}

          {/* Display disconnect code */}
          {disconnectCode && (
            <>
              <Typography variant="h6" style={{ marginTop: '20px',fontFamily:'__Days_One_cad049',color:'white' }}>
                Disconnect Wallet Code:
              </Typography>
              <TextField
                multiline
                sx={{background:'#3c3e41',borderRadius:'5px',color:'white'}}
                rows={4}
                value={disconnectCode}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: {
                    color: 'white',
                  },
                }}
                style={{ marginTop: '10px' }}
              />
              <Button
              sx={{margin:'10px auto',fontFamily:'__Days_One_cad049',display:'flex',background:'#ff5200',color:'white',width:'-webkit-fill-available'}}
                      onClick={() => {
                        navigator.clipboard.writeText(disconnectCode);
                        alert('Code copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
            </>
          )}
    </Paper>
    </>
      )}
    </div>
  );
}

export default MetaMaskComponent;
