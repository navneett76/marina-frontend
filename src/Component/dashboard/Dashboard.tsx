import React, { useEffect, useState, useMemo } from 'react';
import "./Dashboard.css";
import { useAxiosInstance } from '../../axiosInstance';
import {
    Container, TextField, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, TableSortLabel, MenuItem, Grid
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
// import DateInput from '../Common/DateInput';
import { useLocation } from 'react-router-dom';
import { parseISO, format, isValid, parse } from 'date-fns';
import { usePorts } from '../../contexts/PortContext';
import DownloadIcon from '@mui/icons-material/Download';
// import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Tooltip } from '@mui/material';
import { DatePicker, LocalizationProvider, DatePickerProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#02158b', // custom color
    color: '#fff', // text color
    '&:hover': {
        backgroundColor: '#02158b', // custom hover color
    },
    marginRight: '5px',
}));

const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#02158b', // custom color
    color: '#fff', // text color
    '&:hover': {
        backgroundColor: '#02158b', // custom hover color
    },
    marginRight: '5px',
}));

const CustomTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: '#02158b', // custom color
    color: '#ffffff',
    '&:hover': {
        color: '#ffffff',
    },
    '&:.Mui-active': {
        color: '#ffffff',
    },
    '& .MuiTableCell-root': {
        color: '#ffffff', // custom text color
        fontWeight: 'bold', // make the text bold
    },
    '& .MuiButtonBase-root:hover': {
        color: '#ffffff',
    }
}));




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


// interface RefreshButtonProps {
//     onClick: () => void;
// }

const Dashboard: React.FC = () => {
    const axiosInstance = useAxiosInstance();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
    // const [filter, setFilter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState<keyof Contract>('customer_id');
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [status, setStatus] = useState<string>('');
    // const [searchBy, setSearchBy] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [filterFlag, setFilterFlag] = useState<boolean>(true);

    const handleFilter = () => {
        setFilterFlag(!filterFlag);
    };

    const resetFilterVal = () => {
        setKeyword('')
        setStartDate(null)
        setEndDate(null)
        setStatus('')
        handleFilter();
    };


    const location = useLocation();
    const { envelopesId } = (location.state) ? location.state : '';
    const { selectedPort } = usePorts();

    useEffect(() => {
        if (envelopesId !== '' && envelopesId !== null) {
            setKeyword(envelopesId);
            setTimeout(() => handleFilter(), 100);
        }
    }, [envelopesId])



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getEnvalopContractStatus = async (envelopId: string) => {
        await axiosInstance.get('/contract/' + envelopId + '/status')
            .then(response => {
                console.log("testing response: ", response)
                getRecordFromContractTable();
                setTimeout(() => handleFilter(), 100);
            })
            .catch(error => {
                console.error("There was an error update the customers!", error);
            });
    }

    const getEnvalopResendContract = async (envelopId: string) => {
        await axiosInstance.get('/contract/' + envelopId + '/resend')
            .then(response => {
                console.log("testing response: ", response)
                getRecordFromContractTable();
            })
            .catch(error => {
                console.error("There was an error in resend contract!", error);
            });
    }

    const downloadContract = async (customer: Contract, documentId: number = 1) => {
        try {
            // setLoading(true);
            const response = await axiosInstance.get('/contract/' + customer.all_contract_envelopeId + '/download/' + documentId, { responseType: 'arraybuffer' })
            if (response.data) {
                // setLoading(false);
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
            // setLoading(false);
            console.log("Some error in download. Please check the access token")
        }
        // link.parentNode.removeChild(link); // Clean up the DOM
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


    // const [selectedDate, setSelectedDate] = useState('');

    // const handleDateChange = (date: string) => {
    //     setSelectedDate(date);
    //     // Add your logic to fetch data based on the selected date here
    // };

    const getRecordFromContractTable = () => {
        // console.log("selectedPort : ", selectedPort);
        if (selectedPort != null) {
            // axiosInstance.get('/list/all/contracts')
            axiosInstance.get('/contract/all/' + selectedPort)
                .then(response => {
                    setContracts(response.data);
                    setFilteredContracts(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching contracts:', error);
                    setLoading(false);
                });
        }
    }

    const getRecordToRefresh = () => {
        axiosInstance.get('/getall/contracts')
            .then(response => {
                getRecordFromContractTable();
                setTimeout(() => handleFilter(), 100);
            })
            .catch(() => {
            })
    }


    useEffect(() => {
        // axiosInstance.get('/getall/contracts' )
        getRecordFromContractTable();
    }, [selectedPort]);

    // useEffect(() => {
    //     let filterData: Contract[] = []
    //     if (filter !== null && filter != undefined && contracts !== null && contracts != undefined) {
    //         filterData = contracts.filter(contract =>
    //             contract.customer_fname.toLowerCase().includes(filter.toLowerCase()) ||
    //             contract.customer_lname.toLowerCase().includes(filter.toLowerCase()) ||
    //             contract.customer_email.toLowerCase().includes(filter.toLowerCase()) ||
    //             contract.customer_phone.toLowerCase().includes(filter.toLowerCase()) ||
    //             contract.customer_vessel.toLowerCase().includes(filter.toLowerCase()) ||
    //             // contract.all_contract_status.toLowerCase().includes(filter.toLowerCase()) ||
    //             contract.all_contract_envelopeId.toLowerCase().includes(filter.toLowerCase())
    //             // contract.all_contract_sentDateTime.toLowerCase().includes(filter.toLowerCase()) ||
    //             // contract.all_contract_statusChangedDateTime.toLowerCase().includes(filter.toLowerCase())
    //         )
    //         // debugger;


    //         setFilteredContracts(filterData);
    //         setPage(0);
    //     }


    // }, [filter, contracts]);


    const handleRequestSort = (property: keyof Contract) => {
        const isAsc = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useMemo(() => {
        let filterData: Contract[] = [];
        if (filterFlag && contracts !== null && contracts != undefined) {
            filterData = contracts;
            // setFilteredContracts(contracts);
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
                // let filteredVal = (filteredContracts.length > 0) ? filteredContracts : contracts;
                filterData = filterData.filter(contract =>
                    contract.all_contract_status.toLowerCase().includes(status.toLowerCase())
                );
            }
            if (startDate !== null && startDate) {
                // let filteredVal = (filteredContracts.length > 0) ? filteredContracts : contracts;
                filterData = filterData.filter(contract =>
                    new Date(contract.all_contract_sentDateTime) >= new Date(startDate) ||
                    new Date(contract.all_contract_statusChangedDateTime) >= new Date(startDate)
                );
            }
            if (endDate !== null && endDate) {
                console.log("enddate is: ", new Date(endDate))
                // let filteredVal = (filteredContracts.length > 0) ? filteredContracts : contracts;
                filterData = filterData.filter(contract =>
                    new Date(contract.all_contract_sentDateTime) <= new Date(endDate) ||
                    new Date(contract.all_contract_statusChangedDateTime) <= new Date(endDate)
                );
            }

            setFilteredContracts(filterData);
            // console.log("filteredContracts: ", filterData);
            setPage(0);
            setFilterFlag(!filterFlag);
        }
        // return 1
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
        // console.log("filteredData: ", filteredContracts);
        // console.log("sortedData: ", sortedData);
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage, refresh]);

    const statusOptions = ['Sent', 'Completed', 'Delivered'];
    const searchByOptions = ['customerName', 'details'];

    // console.log("paginatedData: ", paginatedData);
    return (
        <>

            <div className='Contract_list_container'>
                <div className='filter_area'>

                    <div className='refreshBtn'>
                        <CustomButton
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={getRecordToRefresh}
                        >
                            Refresh
                        </CustomButton>

                    </div>

                    <div className='filter_fields'>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                    </Grid> */}
                                <Grid item xs={12} sm={4.5}>
                                    <TextField
                                        label="Search name, email etc..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        fullWidth
                                        placeholder='Search name, email etc...'
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
                                <Grid item xs={6} sm={2}>
                                    <DatePicker
                                        label="From"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <DatePicker
                                        label="To"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />

                                </Grid>
                                <Grid item xs={6} sm={.75}>
                                    <CustomIconButton onClick={() => handleFilter()} aria-label="download">
                                        <FilterListIcon onClick={() => handleFilter()} />
                                    </CustomIconButton>
                                </Grid>
                                <Grid item xs={6} sm={.75}>
                                    <CustomIconButton onClick={() => resetFilterVal()} aria-label="download">
                                        <RestartAltIcon />
                                    </CustomIconButton>

                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </div>

                </div>
                <div className='Contract_list_area'>
                    <Container>
                        {/* <TextField
                            label="Filter contracts"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={filter || ''}
                            onChange={e => setFilter(e.target.value)}
                        /> */}
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <CustomTableHead>
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
                                                    >Customer</TableSortLabel></TableCell>
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
                                                <TableCell style={{ minWidth: '160px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_status'}
                                                        direction={orderBy === 'all_contract_status' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_status')}
                                                    >Contract Status</TableSortLabel></TableCell>
                                                <TableCell style={{ minWidth: '160px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_status'}
                                                        direction={orderBy === 'all_contract_status' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_status')}
                                                    >Payment Method</TableSortLabel></TableCell>
                                                <TableCell style={{ minWidth: '160px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_status'}
                                                        direction={orderBy === 'all_contract_status' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_status')}
                                                    >Payment Status</TableSortLabel></TableCell>
                                                {/* <TableCell style={{ minWidth: '150px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}>
                                                        <TableSortLabel
                                                        active={orderBy === 'all_contract_envelopeId'}
                                                        direction={orderBy === 'all_contract_envelopeId' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_envelopeId')}
                                                    >DocuSign EnvelopeID</TableSortLabel></TableCell> */}

                                                <TableCell style={{ minWidth: '120px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_sentDateTime'}
                                                        direction={orderBy === 'all_contract_sentDateTime' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_sentDateTime')}
                                                    >Sent Date</TableSortLabel></TableCell>
                                                <TableCell style={{ minWidth: '130px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}><TableSortLabel
                                                        active={orderBy === 'all_contract_statusChangedDateTime'}
                                                        direction={orderBy === 'all_contract_statusChangedDateTime' ? sortDirection : 'asc'}
                                                        onClick={() => handleRequestSort('all_contract_statusChangedDateTime')}
                                                    >Last Updated</TableSortLabel></TableCell>
                                                <TableCell style={{ minWidth: '100px' }}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem', // Adjust font size as needed
                                                    }}>Action</TableCell>
                                            </TableRow>
                                        </CustomTableHead>
                                        <TableBody>
                                            {paginatedData.map((contract, index) => (
                                                <TableRow key={contract.all_contract_envelopeId}>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{contract.customer_fname} {contract.customer_lname}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{contract.customer_vessel}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{contract.customer_email}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{contract.customer_phone}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                            textTransform: 'capitalize'
                                                        }}>{contract.all_contract_status}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                            textTransform: 'capitalize'
                                                        }}>{contract.all_contract_status}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                            textTransform: 'capitalize'
                                                        }}>{contract.all_contract_status}</TableCell>
                                                    {/* <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{contract.all_contract_envelopeId}</TableCell> */}
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{formatDateString(contract.all_contract_sentDateTime)}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>{formatDateString(contract.all_contract_statusChangedDateTime)}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '.8rem', // Adjust font size as needed
                                                        }}>
                                                        <CustomIconButton onClick={() => downloadContract(contract)} aria-label="download">
                                                            <DownloadIcon />
                                                        </CustomIconButton>
                                                        {contract.all_contract_status != 'comleted' &&
                                                            <CustomIconButton onClick={() => getEnvalopContractStatus(contract.all_contract_envelopeId)} aria-label="Review Status">
                                                                <RefreshIcon />
                                                            </CustomIconButton>
                                                        }
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
                        )}
                    </Container>
                </div>
            </div>
        </>
    );
};


export default Dashboard;

// const statusOptions = ['Pending', 'Completed', 'Cancelled'];
// const searchByOptions = ['customerName', 'details'];

// export default withCommonFilter(Dashboard, statusOptions, searchByOptions);
