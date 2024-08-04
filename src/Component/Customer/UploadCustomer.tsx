// src/components/UploadCustomer.tsx
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAxiosInstance } from '../../axiosInstance';
import { usePorts } from '../../contexts/PortContext';
import { styled } from '@mui/system';

const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#02158b', // custom color
    color: '#fff', // text color
    '&:hover': {
      backgroundColor: '#02158b', // custom hover color
    },
    '&:disabled': {
        backgroundColor: '#fff', 
        color: '#777a7a',
        border: '1px solid #777a7a'
    }
  }));

const UploadCustomer: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const axiosInstance = useAxiosInstance();
    const { selectedPort } = usePorts();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFile(null); // Reset the file input
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            
            const response = await axiosInstance.post('/customer/upload/'+selectedPort, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            handleClose();
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <CustomButton variant="contained" color='primary' onClick={handleClickOpen}
            sx={{
                fontSize: '16px',
                padding: '12px 24px',
              }}>
                Upload Customer
            </CustomButton>
            <Dialog open={open} onClose={handleClose}
            maxWidth="lg" // Change this to 'sm', 'md', 'lg', 'xl' based on your need
            PaperProps={{
                sx: {
                  minWidth: '400px', // Custom width
                  minHeight: '250px', // Custom height
                },
              }}
            >
                <DialogTitle style={{background: '#02158b', color: '#fff'}} >
                    Upload Customer
                    <IconButton
                        
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <input
                        accept=".xlsx, .xls"
                        style={{ display: 'none', color: '#02158b' }}
                        id="upload-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file">
                        <Button variant="outlined" component="span" style={{color: '#02158b', border:'1px solid #02158b' }}>
                            Choose File
                        </Button>
                    </label>
                    {file && (
                        <TextField
                            margin="dense"
                            label="Selected File"
                            fullWidth
                            value={file.name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <CustomButton className="btn_custom_color"  onClick={handleClose} >
                        Cancel
                    </CustomButton>
                    <CustomButton className="btn_custom_color"  onClick={handleUpload} disabled={!file}>
                        Upload
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UploadCustomer;
