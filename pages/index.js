'use client'
// Import the Supabase client
import Navbar from '../component/navbar';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import UnlockPage from './main.js';


const AddNFTPage = () => {
  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );
  return (
    <div>
    
    <Card sx={{ minWidth: 100, background:'black', margin:'16px', border:'1px solid gray' }}>
    <Navbar />
    <UnlockPage />
    </Card>
  </div>
  );
};

export default AddNFTPage;
