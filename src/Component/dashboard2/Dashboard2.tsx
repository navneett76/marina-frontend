import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import "./Dashboard.css";
import { useAxiosInstance } from '../../axiosInstance';
import {
    Container, TextField, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, TableSortLabel, MenuItem, Grid
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLocation } from 'react-router-dom';
import { parseISO, format, isValid, parse } from 'date-fns';
import { usePorts } from '../../contexts/PortContext';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
const CommonFilter = lazy(()=> import('../Common/Filter/CommonFilter'));

interface Contract {
    customer_id: number;
    customer_fname: string;
    customer_lname: string;
    customer_email: string;
    customer_phone: string;
    customer_vessel: string;
    customer_starttime: string;
    customer_endtime: string;
    port_portName: string;
    port_id: number;
    all_contract_status: string;
    all_contract_envelopeId: string;
    all_contract_sentDateTime: string;
    all_contract_statusChangedDateTime: string;
    all_contract_id: number;
}

const Dashboard2: React.FC = () => {
    const axiosInstance = useAxiosInstance();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof Contract>('customer_id');
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [status, setStatus] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [filterFlag, setFilterFlag] = useState<boolean>(true);

    const location = useLocation();
    const { envelopesId } = (location.state) ? location.state : '';
    const { selectedPort } = usePorts();

    useEffect(() => {
        if (envelopesId !== '' && envelopesId !== null) {
            setKeyword(envelopesId);
            setTimeout(() => handleFilter(), 100);
        }
    }, [envelopesId])
    
    useEffect(() => {
        getRecordFromContractTable();
    }, [selectedPort]);


    const handleFilter = () => {
        setFilterFlag(!filterFlag);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property: keyof Contract) => {
        const isAsc = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useMemo(() => {
        let filterData: Contract[] = [];
        if (filterFlag && contracts !== null && contracts != undefined) {
            filterData = contracts;
            console.log("keyword: ", keyword);
            if (keyword !== null && keyword != undefined) {
                filterData = filterData.filter(contract =>
                    contract.customer_fname.toLowerCase().includes(keyword.toLowerCase()) ||
                    contract.customer_lname.toLowerCase().includes(keyword.toLowerCase()) ||
                    contract.customer_email.toLowerCase().includes(keyword.toLowerCase()) ||
                    contract.customer_phone.toLowerCase().includes(keyword.toLowerCase()) ||
                    contract.customer_vessel.toLowerCase().includes(keyword.toLowerCase()) ||
                    contract.all_contract_envelopeId.toLowerCase().includes(keyword.toLowerCase())
                );
            }

            if (status !== null && status != undefined) {
                filterData = filterData.filter(contract =>
                    contract.all_contract_status.toLowerCase().includes(status.toLowerCase())
                );
            }
            if (startDate !== null && startDate) {
                filterData = filterData.filter(contract =>
                    new Date(contract.all_contract_sentDateTime) >= new Date(startDate) ||
                    new Date(contract.all_contract_statusChangedDateTime) >= new Date(startDate)
                );
            }
            if (endDate !== null && endDate) {
                console.log("enddate is: ", new Date(endDate))
                filterData = filterData.filter(contract =>
                    new Date(contract.all_contract_sentDateTime) <= new Date(endDate) ||
                    new Date(contract.all_contract_statusChangedDateTime) <= new Date(endDate)
                );
            }

            setFilteredContracts(filterData);
            setPage(0);
            setFilterFlag(!filterFlag);
        }
    }, [filterFlag]);

    const sortedData = useMemo(() => {
        return filteredContracts.sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            setRefresh((refresh) ? false : true);
            if (typeof aValue === 'string' && typeof bValue === 'string') {

                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

            return 0;
        });

    }, [filteredContracts, orderBy, sortDirection]);

    const paginatedData = useMemo(() => {
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage, refresh]);

    const statusOptions = ['Sent', 'Completed', 'Delivered'];
    const searchByOptions = ['Sent', 'Completed', 'Delivered'];

    
    const getEnvalopContractStatus = async (envelopId: string) => {
        await axiosInstance.get('/contract/' + envelopId + '/status')
            .then(response => {
                console.log("testing response: ", response)
                getRecordFromContractTable();
                handleFilter();
            })
            .catch(error => {
                console.error("There was an error update the customers!", error);
            });
    }

    const downloadContract = async (customer: Contract, documentId: number = 1) => {
        try {
            // setLoading(true);
            const response = await axiosInstance.get('/contract/' + customer.all_contract_envelopeId + '/download/' + documentId, { responseType: 'arraybuffer' })
            if (response.data) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `document_${customer.customer_fname}_${customer.customer_id}.pdf`);
                document.body.appendChild(link);
                link.click();

            }
        }
        catch (error) {
            console.log("Some error in download. Please check the access token")
        }
    };

    const getRecordFromContractTable = () => {
        if (selectedPort != null) {
            // axiosInstance.get('/list/all/contracts')
            axiosInstance.get('/contract/all/' + selectedPort)
                .then(response => {
                    setContracts(response.data);
                    setFilteredContracts(response.data);
                    // setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching contracts:', error);
                    // setLoading(false);
                });
        }
    }

    const getRecordToRefresh = () => {
        axiosInstance.get('/getall/contracts')
            .then(response => {
                getRecordFromContractTable();
                handleFilter();
            })
            .catch(() => {
            })
    }
    
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

    return (
        <>

            <div className='Contract_list_container'>
                <div className='filter_area'>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<RefreshIcon />}
                            onClick={getRecordToRefresh}
                        >
                            Refresh
                        </Button>
                    </div>

                    <div className='filter_fields'>
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Grid container spacing={1} alignItems="center">

                                {/* <Grid item xs={9} sm={1.5}>
                        <TextField
                            select
                            label="Search By"
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            fullWidth
                        >
                            {searchByOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> 
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Keyword"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <TextField
                                        select
                                        label="Status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem key="blank" value="">
                                            -- Select Status --
                                        </MenuItem>
                                        {statusOptions.map((option) => (

                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6} sm={2.5}>
                                    <DatePicker
                                        label="From"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2.5}>
                                    <DatePicker
                                        label="To"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />

                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <Button variant="contained" color="primary" fullWidth onClick={() => handleFilter()}>
                                        Filter
                                    </Button>
                                </Grid>
                            </Grid>
                        </LocalizationProvider> */}
                        <Suspense fallback={<div>Loading...</div>}>
                        <CommonFilter statusOptions={statusOptions} searchByOptions={searchByOptions} onFilter={handleFilter} />
                        </Suspense>
                        
                    </div>

                </div>
                <div className='Contract_list_area'>
                    <Container>
                        
                        {/* {loading ? (
                            <CircularProgress />
                        ) : ( */}
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}>
                                                    <TableSortLabel
                                                        active={orderBy === 'customer_fname'}
                                                        direction={orderBy === 'customer_fname' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('customer_fname')}
                                                    >Customer Name</TableSortLabel></TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'customer_vessel'}
                                                        direction={orderBy === 'customer_vessel' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('customer_vessel')}
                                                    >Vessel</TableSortLabel></TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'customer_email'}
                                                        direction={orderBy === 'customer_email' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('customer_email')}
                                                    >Email</TableSortLabel></TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'customer_phone'}
                                                        direction={orderBy === 'customer_phone' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('customer_phone')}
                                                    >Phone</TableSortLabel></TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_status'}
                                                        direction={orderBy === 'all_contract_status' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_status')}
                                                    >Status</TableSortLabel></TableCell>
                                                <TableCell style={{ minWidth: '150px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_envelopeId'}
                                                        direction={orderBy === 'all_contract_envelopeId' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_envelopeId')}
                                                    >DocuSign EnvelopeID</TableSortLabel></TableCell>

                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_sentDateTime'}
                                                        direction={orderBy === 'all_contract_sentDateTime' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_sentDateTime')}
                                                    >Sent Date</TableSortLabel></TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_statusChangedDateTime'}
                                                        direction={orderBy === 'all_contract_statusChangedDateTime' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_statusChangedDateTime')}
                                                    >Last Updated</TableSortLabel></TableCell>
                                                <TableCell style={{ width: '100px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedData.map((contract, index) => (
                                                <TableRow key={contract.all_contract_envelopeId}>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{contract.customer_fname} {contract.customer_lname}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{contract.customer_vessel}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{contract.customer_email}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{contract.customer_phone}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{contract.all_contract_status}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{contract.all_contract_envelopeId}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{formatDateString(contract.all_contract_sentDateTime)}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>{formatDateString(contract.all_contract_statusChangedDateTime)}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.7rem', // Adjust font size as needed
                                                        }}>
                                                        <IconButton color="primary" onClick={() => downloadContract(contract)} aria-label="download">
                                                            <DownloadIcon color='primary' />
                                                        </IconButton>
                                                        <IconButton color="primary" onClick={() => getEnvalopContractStatus(contract.all_contract_envelopeId)} aria-label="Review Status">
                                                            <RefreshIcon color='primary' />
                                                        </IconButton>
                                                        {/* <Button color="primary" onClick={() => getEnvalopResendContract(contract.all_contract_envelopeId)}>Resend</Button> */}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredContracts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        {/* )} */}
                    </Container>
                </div>
            </div>
        </>
    );
};


export default Dashboard2;