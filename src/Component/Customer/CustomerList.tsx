import React, { useEffect, useState } from 'react';
import { useAxiosInstance } from '../../axiosInstance';
import CustomerDataList from '../Common/CustomerDataList';
import { Customer } from '../Common/types/Customer';
import UploadCustomer from './UploadCustomer';
// import { getCurrentAndSixMonthsLaterDate } from '../../util/dateUtils';
import { usePorts } from '../../contexts/PortContext';

const initialData: Customer[] = [
  {
    id: 1,
    fname: 'John',
    lname: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address1: '123 Business Road',
    address2: '123 Business Road',
    city: 'city',
    state: "state",
    zip: '983933',
    country: 'US',
    vessel: "vessel",
    loa: '12', 
    beam: '14',
    draft: '12',
    starttime: '08:00',
    endtime: '17:00',
    price: 1000,
    port: {
      id: 1,
      portName: 'portname'
    },
    companyAddress: '',
    envelopesId:'',
    status: 'Not started'
  }
  // Add more data as needed
];

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialData);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxiosInstance();
  const { selectedPort } = usePorts();

  const handleDelete = (id: number) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  const handleUpdate = (updatedCustomer: Customer) => {
    setCustomers(customers.map(customer =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  // const { currentDate, sixMonthsLaterDate } = getCurrentAndSixMonthsLaterDate();

  useEffect(() => {
    if (selectedPort != null) {
      axiosInstance.get('/customer/all/' + selectedPort)
        .then(response => {
          const customerArr = [];
          for (let customerD of response.data) {

            const resPonseObj: Customer = {
              id: customerD.id,
              fname: customerD.fname,
              lname: customerD.lname,
              email: customerD.email,
              phone: customerD.phone,
              address1: customerD.address1,
              address2: customerD.address2,
              city: customerD.city,
              state: customerD.state,
              zip: customerD.zip,
              country: customerD.country,
              vessel: customerD.vessel,
              loa: customerD.loa, 
              beam: customerD.beam,
              draft: customerD.draft,
              starttime: customerD.starttime,
              endtime: customerD.endtime,
              price: customerD.price,
              port: {
                id: customerD.port.id,
                portName: customerD.port.portName
              },
              companyAddress: customerD.user.companyAddress,
              envelopesId: (customerD.contracts && customerD.contracts.length>0)? (customerD.contracts[customerD.contracts.length-1].documentUrl).replace('/envelopes/', ''): '',
              status: (customerD.contracts && customerD.contracts.length>0)? customerD.contracts[customerD.contracts.length-1].status: 'Not Started'
            }

            customerArr.push(resPonseObj);
          }


          setCustomers(customerArr);
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the customers!", error);
          setLoading(false);
        });
    }
  }, [selectedPort]);

  return (
    <div className='data-section'>
      <div className='top-section'>
        <h2 style={{color: '#02158b'}}>Customer List</h2>
        <UploadCustomer />
      </div>

      <CustomerDataList data={customers} onDelete={handleDelete} onUpdate={handleUpdate} />
    </div>
  );
}

export default CustomerList;
