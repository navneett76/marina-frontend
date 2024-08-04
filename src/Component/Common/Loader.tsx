// src/components/Loader.tsx

import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '3vh',
      }}
    >
      <CircularProgress size={25}/>
    </Box>
  );
};

export default Loader;
