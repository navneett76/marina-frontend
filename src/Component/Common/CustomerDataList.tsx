// src/components/CustomerList.tsx
import React, { useState, useMemo } from 'react';
import { Customer } from './types/Customer';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, Paper } from '@mui/material';

import {styled} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';

import CustomTableCell from './CustomTableCell';
import ContractPreview from '../Customer/ContractPreview';
import { useAxiosInstance } from '../../axiosInstance';
import { parseISO, format, isValid, parse } from 'date-fns';

import "./TableCell.css";

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#02158b', // custom color
  color: '#fff', // text color
  '&:hover': {
    backgroundColor: '#02158b', // custom hover color
  },
  marginRight: '5px'
}));

const CustomTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#02158b', // custom color
  '& .MuiTableCell-root': {
    color: '#ffffff', // custom text color
    fontWeight: 'bold', // make the text bold
  },
  '& .MuiButtonBase-root:hover': {
    color: '#ffffff',
  }
}));


interface CustomerListProps {
  data: Customer[];
  onDelete: (id: number) => void;
  onUpdate: (customer: Customer) => void;
}

const CustomerDataList: React.FC<CustomerListProps> = ({ data, onUpdate }) => {
  const [searchInput, setSearchInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Customer>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refresh, setRefresh] = useState(false);

  const axiosInstance = useAxiosInstance();
  const handleRequestSort = (property: keyof Customer) => {

    const isAsc = orderBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (customer: Customer) => {
    setEditId(customer.id);
  };

  const handleSave = (customer: Customer) => {

    if (customer.id !== undefined && customer.id !== null) {
      axiosInstance.post('/customer/update/' + customer.id, {
        id: customer.id,
        fname: customer.fname,
        lname: customer.lname,
        email: customer.email,
        phone: customer.phone,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        country: customer.country,
        vessel: customer.vessel,
        loa: customer.loa,
        beam: customer.beam,
        draft: customer.draft,
        starttime: customer.starttime,
        endtime: customer.endtime,
        price: customer.price
      })
        .then(response => {
          onUpdate(customer);
          setEditId(null);
        })
        .catch(error => {
          console.error("There was an error update the customers!", error);
        });
    }

    onUpdate(customer);
    setEditId(null);
  };

  const navigate = useNavigate();

  const redirectToDashobard = (customer: Customer) => {
    navigate('/contracts', { state: { envelopesId: customer.envelopesId } });
  }

  const handleCancel = () => {
    setEditId(null);
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

  // const previewSendAction = (customer: Customer) => {
  //   // Add your custom functionality here
  //   // console.log(`Button clicked for customer: ${customer.fname} ${customer.lname}`);
  // }

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handlePreviewClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsPreviewOpen(true);
  };

  const handleClose = () => {
    setIsPreviewOpen(false);
    setSelectedCustomer(null);
  };

  const filteredData = useMemo(
    () => data.filter(customer =>
      Object.values(customer).some(val =>
        String(val).toLowerCase().includes(searchInput.toLowerCase())
      )
    ),
    [searchInput, data]
  );

  const sortedData = useMemo(() => {
    // console.log("orderBy: ", orderBy);
    // console.log("sortDirection: ", sortDirection);
    return filteredData.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      setRefresh((refresh)? false: true);
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

      return 0;
    });

  }, [filteredData, orderBy, sortDirection]);

  const paginatedData = useMemo(() => {
    // console.log("filteredData: ", filteredData);
    // console.log("sortedData: ", sortedData);
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, refresh]);

  return (
    <Paper>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
      <TableContainer>
        <Table>
          <CustomTableHead>
            <TableRow>
              {/* <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell> */}
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'fname'}
                  direction={orderBy === 'fname' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('fname')}
                >
                  FName
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'lname'}
                  direction={orderBy === 'lname' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('lname')}
                >
                  LName
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'vessel'}
                  direction={orderBy === 'vessel' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('vessel')}
                >
                  Vessel
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'phone'}
                  direction={orderBy === 'phone' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('phone')}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell style={{minWidth: '120px'}}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                Address
              </TableCell>
              
              <TableCell style={{minWidth: '80px'}}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                Beam
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'starttime'}
                  direction={orderBy === 'starttime' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('starttime')}
                >Start</TableSortLabel>
                
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'endtime'}
                  direction={orderBy === 'endtime' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('endtime')}
                >End</TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel style={{ minWidth: '80px' }}
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? sortDirection : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >Status</TableSortLabel>
                
              </TableCell>
              <TableCell style={{ minWidth: '140px' }}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem', // Adjust font size as needed
                }}
              >Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {paginatedData.map((customer, index) => (
              <TableRow key={customer.id}>
                {/* <TableCell>{index + 1}</TableCell> */}
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}
                >
                  {editId === customer.id ? (
                    <TextField
                      value={customer.fname}
                      onChange={(e) => onUpdate({ ...customer, fname: e.target.value })}
                    // onBlur={(e) => handleSave(customer)}
                    />
                  ) : (
                    customer.fname
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.lname}
                      onChange={(e) => onUpdate({ ...customer, lname: e.target.value })}
                    // onBlur={() => handleSave(customer)}
                    />
                  ) : (
                    customer.lname
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.vessel}
                      onChange={(e) => onUpdate({ ...customer, vessel: e.target.value })}
                    // onBlur={() => handleSave(customer)}
                    />
                  ) : (
                    customer.vessel
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.email}
                      onChange={(e) => onUpdate({ ...customer, email: e.target.value })}
                    // onBlur={() => handleSave(customer)}
                    />
                  ) : (
                    customer.email
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.phone}
                      onChange={(e) => onUpdate({ ...customer, phone: e.target.value })}
                    // onBlur={() => handleSave(customer)}
                    />
                  ) : (
                    customer.phone
                  )}
                </TableCell>
              
                <CustomTableCell editId={editId} customer={customer} onUpdate={onUpdate} />
                
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <div className='beam_container'>
                      <TextField
                        type="number"
                        value={customer.loa} className='beam_dimention'
                        onChange={(e) => onUpdate({ ...customer, loa: e.target.value })}
                      />
                      X
                      <TextField
                        type="number"
                        value={customer.beam} className='beam_dimention'
                        onChange={(e) => onUpdate({ ...customer, beam: e.target.value })}
                      />
                      X
                      <TextField
                        type="number"
                        value={customer.draft} className='beam_dimention'
                        onChange={(e) => onUpdate({ ...customer, draft: e.target.value })}
                      />
                    </div>

                  ) : (
                    customer.loa + " X " + customer.beam + " X " + customer.draft
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.starttime}
                      name="starttime"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}

                      onChange={(e) => onUpdate({ ...customer, starttime: e.target.value })}
                    />
                  ) : (
                    formatDateString(customer.starttime)
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.endtime}
                      name="endtime"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}

                      onChange={(e) => onUpdate({ ...customer, endtime: e.target.value })}
                    />
                  ) : (
                    formatDateString(customer.endtime)
                  )}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <TextField
                      value={customer.price}
                      type="number"
                      onChange={(e) => onUpdate({ ...customer, price: +(e.target.value) })}
                    />
                  ) : (
                    customer.price
                  )}

                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {customer.status}
                </TableCell>
                <TableCell
                sx={{
                  fontSize: '.8rem', // Adjust font size as needed
                }}>
                  {editId === customer.id ? (
                    <>
                      <Button className='btn_custom_color1' onClick={() => handleSave(customer)}>Save</Button>
                      <Button className='btn_custom_color1' onClick={handleCancel}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <CustomIconButton onClick={() => handleEdit(customer)}>
                        <EditIcon />
                      </CustomIconButton>

                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePreviewClick(customer)}
                      >
                        Preview
                      </Button> */}
                      <CustomIconButton onClick={() => handlePreviewClick(customer)} aria-label="preview">
                      <DescriptionIcon aria-label="Preview"  />
                      </CustomIconButton>

                      {customer.status === 'sent' &&
                        <CustomIconButton onClick={() => redirectToDashobard(customer)}>
                          <ArrowForwardIcon aria-label="View" />
                        </CustomIconButton>

                      }

                      {selectedCustomer &&
                        <ContractPreview open={isPreviewOpen} onClose={handleClose} customer={selectedCustomer} />
                      }
                      {/* <IconButton onClick={() => onDelete(customer.id)}>
                        <DeleteIcon />
                      </IconButton> */}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
  );
};

export default CustomerDataList;
