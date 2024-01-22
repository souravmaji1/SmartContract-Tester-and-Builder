// pages/index.js (for adding NFT and content)
'use client'
import { useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

const AddNFTPage = () => {
  const [nftContract, setNftContract] = useState('');
  const [content, setContent] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    const uniqueId = uuidv4();

    // Save data to your database or state management system
    // In a real application, you might use a backend to handle data storage.

    // Example data saving (replace with your actual data saving logic):
    const saveData = async () => {
      try {
        const response = await fetch('/api/saveData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: uniqueId,
            nftContract,
            content,
          }),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error saving data:', error);
        throw new Error('Failed to save data');
      }
    };

    try {
      // Save data and get confirmation
      const savedData = await saveData();

      // Generate link to the restricted page
      const generatedLink = `${window.location.origin}/restricted/${uniqueId}`;

      // Update state to display the generated link
      setGeneratedLink(generatedLink);
    } catch (error) {
      // Handle error while saving data
      console.error('Error while saving data:', error);
    }
  };

  return (
    <div>
      <label>NFT Contract Address:</label>
      <input type="text" value={nftContract} onChange={(e) => setNftContract(e.target.value)} />
      
      <label>Restricted Content:</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />

      <button onClick={handleSave}>Save</button>

      {generatedLink && (
        <div>
          <p>Generated Link:</p>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer">
            {generatedLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default AddNFTPage;
