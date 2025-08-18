import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PlayerModalProps {
  open: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="player-modal"
      aria-describedby="player-modal-iframe"
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          bgcolor: '#111111',
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          boxSizing: 'border-box',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <iframe 
          src="https://calm-cajeta-e4e541.netlify.app/"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '20px',
          }}
          title="External Content"
        ></iframe>
      </Box>
    </Modal>
  );
};

export default PlayerModal;
