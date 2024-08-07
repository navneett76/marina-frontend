// src/components/ContractPreview.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, IconButton, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Customer } from '../Common/types/Customer';
import { useAxiosInstance } from '../../axiosInstance';
import "./ContractPreview.css";
import Loader from '../Common/Loader';
import { parseISO, format, isValid, parse } from 'date-fns';
import { styled } from '@mui/system';
import ContractPreviewMooring from './ContractPreview-mooring';
import ContractPreviewSlips from './ContractPreview-slips';
import ContractPreviewIndoorStorage from './ContractPreview-IndoorStorage';
import ContractPreviewRockStorage from './ContractPreview-RockStorage';
import ContractPreviewOutdoorStorage from './ContractPreview-OutdoorStorage';

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

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({

    '&.Mui-checked': {
        color: '#02158b',
    },
    color: 'gray'
}));


interface ContractPreviewProps {
    open: boolean;
    onClose: () => void;
    customer: Customer;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ open, onClose, customer }) => {
    console.log("customer: ", customer);
    const [review, setReview] = useState<Record<number, boolean>>({});
    const [sendContract, setSendContract] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState('');

    const handleCheckboxChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setReview(prevState => ({ ...prevState, [id]: event.target.checked }));
    };


    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedOption(event.target.value as string);
    };


    const formatDateString = (dateString: string) => {
        let date;

        // Check if the input is just a time (e.g., "08:00")
        if (/^\d{2}:\d{2}$/.test(dateString)) {
            // If it's a time, combine it with the current date
            const today = new Date();
            date = parse(`${today.toISOString().split('T')[0]}T${dateString}`, "yyyy-MM-dd'T'HH:mm", new Date());
        } else {
            // Otherwise, parse it as a full ISO date string
            date = parseISO(dateString);
        }

        // Validate the date
        if (!isValid(date)) {
            throw new Error('Invalid date value');
        }

        return format(date, 'MM/dd/yyyy');
    };

    const axiosInstance = useAxiosInstance();
    const sendContractToCustomer = (customer: Customer) => {
        setLoading(true);
        axiosInstance.post('/contracts/' + customer.id)
            .then(response => {
                setLoading(false);
                console.log("testing response: ", response)
                setSendContract(prevState => ({ ...prevState, [customer.id]: true }));
                onClose();
            })
            .catch(error => {
                setLoading(false);
                console.error("There was an error update the customers!", error);
            });


    };

    return (
        <>


            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle style={{ backgroundColor: '#02158b', color: '#fff' }}>Customer Contract Preview
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
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

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Options</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedOption}
                            label="Options"
                            onChange={handleChange}
                        >
                            <MenuItem value="Mooring">Mooring</MenuItem>
                            <MenuItem value="Slips">Slips</MenuItem>
                            <MenuItem value="IndoorStorage">Indoor Storage</MenuItem>
                            <MenuItem value="RockStorage">Rack Storage</MenuItem>
                            <MenuItem value="OutdoorStorage">Outdoor Storage</MenuItem>
                        </Select>
                        <div>
                            {selectedOption === 'Mooring' && <ContractPreviewMooring customer={customer} />}
                            {selectedOption === 'Slips' && <ContractPreviewSlips customer={customer} />}
                            {selectedOption === 'IndoorStorage' && <ContractPreviewIndoorStorage customer={customer} />}
                            {selectedOption === 'RockStorage' && <ContractPreviewRockStorage customer={customer} />}
                            {selectedOption === 'OutdoorStorage' && <ContractPreviewOutdoorStorage customer={customer} />}
                        </div>
                    </FormControl>


                    {selectedOption && 
                    <>
                    <CustomCheckbox checked={review[customer.id] || false} onChange={handleCheckboxChange(customer.id)} />
                    <strong style={{ fontSize: '18px' }}>Please check to confirm that you have review the contract and want to send to client.</strong>
                    </>
                    }

                    {sendContract[customer.id] &&
                        <div className='send_contract'> Contract sent successfully</div>
                    }
                </DialogContent>
                {selectedOption && 
                <DialogActions>
                    <Loader loading={loading} />
                    <CustomButton className="btn_custom_color" onClick={onClose} >Close</CustomButton>
                    <CustomButton className="btn_custom_color" disabled={!review[customer.id] || loading} onClick={() => sendContractToCustomer(customer)}>
                        {loading ? 'Please wait ...' : 'Send Contract'}
                    </CustomButton>
                </DialogActions>
}
            </Dialog>
        </>
    );
};

const Component1: React.FC = () => {
    return <div>Component 1 Content</div>;
};

const Component2: React.FC = () => {
    return <div>Component 2 Content</div>;
};

const Component3: React.FC = () => {
    return <div>Component 3 Content</div>;
};

export default ContractPreview;
