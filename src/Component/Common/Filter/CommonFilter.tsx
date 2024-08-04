// CommonFilter.tsx
import React, { useState } from 'react';
import { TextField, MenuItem, Button, Grid } from '@mui/material';
import { DatePicker, LocalizationProvider, DatePickerProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// import { TextField, MenuItem, Select, SelectChangeEvent } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

interface CommonFilterProps {
  statusOptions: string[];
  searchByOptions: string[];
  onFilter: (filters: FilterValues) => void;
}

export interface FilterValues {
  status: string;
  searchBy: string;
  keyword: string;
  startDate: Date | null;
  endDate: Date | null;
}
interface FilterProps {
    filters: any;
    setFilters: (filters: any) => void;
  }
  
//   const MyDatePicker: React.FC<DatePickerProps<Date>> = (props) => {
//     return (
//       <DatePicker
//         {...props}
//         renderInput={(params: any) => <TextField {...params} fullWidth />}
//       />
//     );
//   };

const CommonFilter: React.FC<CommonFilterProps> = ({ statusOptions, searchByOptions, onFilter }) => {
  const [status, setStatus] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleFilter = () => {
    onFilter({ status, searchBy, keyword, startDate, endDate });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
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
        <Grid item xs={12} sm={3}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          {/* <MyDatePicker
        label="Start Date"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue)}
      />
      <MyDatePicker
        label="End Date"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue)}
      /> */}
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>
            Filter
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default CommonFilter;
