import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import withCommonFilter from './withCommonFilter';
import { FilterValues } from '../Filter/CommonFilter';

interface Contract {
  id: number;
  customerName: string;
  startDate: string;
  endDate: string;
  status: string;
  details: string;
  // other fields...
}

interface ContractsProps {
  filters: FilterValues;
}

const ContractFilterContact: React.FC<ContractsProps> = ({ filters }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const fetchContracts = async () => {
      // Fetch contracts from API
      const fetchedContracts: Contract[] = [
        { id: 1, customerName: 'John Doe', startDate: '2023-01-01', endDate: '2023-02-01', status: 'Pending', details: 'Details 1' },
        { id: 2, customerName: 'Jane Smith', startDate: '2023-03-01', endDate: '2023-04-01', status: 'Completed', details: 'Details 2' },
      ];
      setContracts(fetchedContracts);
      setFilteredContracts(fetchedContracts);
    };

    fetchContracts();
  }, []);

  useEffect(() => {
    let filtered = contracts;

    if (filters.status) {
      filtered = filtered.filter(contract => contract.status === filters.status);
    }

    if (filters.searchBy && filters.keyword) {
      filtered = filtered.filter(contract =>
        contract[filters.searchBy as keyof Contract].toString().toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(contract => (filters.startDate!== null)? new Date(contract.startDate) >= filters.startDate: new Date(contract.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(contract => (filters.endDate !==null)? new Date(contract.endDate) <= filters.endDate: new Date(contract.endDate));
    }

    setFilteredContracts(filtered);
  }, [filters, contracts]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredContracts.map(contract => (
            <TableRow key={contract.id}>
              <TableCell>{contract.id}</TableCell>
              <TableCell>{contract.customerName}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>{contract.status}</TableCell>
              <TableCell>{contract.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// const statusOptions = ['Pending', 'Completed', 'Cancelled'];
// const searchByOptions = ['customerName', 'details'];

// export default withCommonFilter(ContractFilterContact, statusOptions, searchByOptions);
