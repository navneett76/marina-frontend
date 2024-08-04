// src/components/CustomTableCell.tsx
import React from 'react';
import { TextField, TableCell } from '@mui/material';
import { truncateString } from '../../util/stringUtils';
import { Customer } from './types/Customer';

import './TableCell.css';

interface CustomTableCellProps {
  editId: number | null;
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

const CustomTableCell: React.FC<CustomTableCellProps> = ({ editId, customer, onUpdate }) => {
    const fullAddress = customer.address1 +' '+ customer.address2 +' '+ customer.city +' '+ customer.state +' '+ customer.zip +' '+ customer.country
  return (
    
    <TableCell 
    sx={{
      fontSize: '.8rem', // Adjust font size as needed
    }}>
    {editId === customer.id ? (
        <>
            <TextField
            value={fullAddress}
            onChange={(e) => onUpdate({ ...customer, address1: e.target.value })} /> 
        </>
        
        ) : (
        
        <span className="table-cell"
        data-full-text={fullAddress} >{truncateString(fullAddress, 15)}</span>
        
        )}
    </TableCell>
    
  );
};

export default CustomTableCell;
