'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [smartContractSource, setSmartContractSource] = useState('');
  const [deployedContractResponse, setDeployedContractResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const deployContract = async () => {
    try {
      setLoading(true);

      const response = await axios.post('http://localhost:3002/compile-and-deploy', {
        smartContractSource,
      });

      setDeployedContractResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error deploying contract:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '66rem',
        margin: 'auto',
        border: '2px solid #7042f88b',
        borderRadius: '8px',
        width: '-webkit-fill-available',
        background: 'linear-gradient(45deg, #2a0e61, #010108)',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '20px', color: 'white', fontWeight: 'medium', marginTop: '10px', marginBottom: '15px' }}>
          Smart Contract Source Code:
        </p>
        <textarea
          rows="8"
          value={smartContractSource}
          onChange={(e) => setSmartContractSource(e.target.value)}
          placeholder="Enter your smart contract source code here..."
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
          }}
        />
      </div>
   
      <button
        onClick={deployContract}
        style={{
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          width: '100%',
          background: '#4109af',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Deploying...' : 'Deploy Contract'}
      </button>
      {deployedContractResponse && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {deployedContractResponse.message}
          </h2>
          <p style={{ fontSize: '14px', color: 'white' }}>
            Contract Address: {deployedContractResponse.deployedContractAddress.contractAddress}
          </p>
        </div>
      )}
    </div>
  );
}
