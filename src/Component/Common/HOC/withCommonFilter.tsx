// withCommonFilter.tsx
import React, { useState } from 'react';
import CommonFilter, {FilterValues} from '../Filter/CommonFilter';

const withCommonFilter = <P extends object>(Component: React.ComponentType<P>, statusOptions: string[], searchByOptions: string[]) => {
  return (props: P) => {
    const [filters, setFilters] = useState<FilterValues>({
      status: '',
      searchBy: '',
      keyword: '',
      startDate: null,
      endDate: null,
    });

    const handleFilter = (newFilters: FilterValues) => {
      setFilters(newFilters);
    };

    return (
      <>
        <CommonFilter statusOptions={statusOptions} searchByOptions={searchByOptions} onFilter={handleFilter} />
        <Component {...props} filters={filters} />
      </>
    );
  };
};

export default withCommonFilter;
