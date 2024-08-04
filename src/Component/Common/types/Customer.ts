// src/types/Customer.ts
export interface Customer {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    vessel: string;
    loa: string;
    beam: string;
    draft: string;
    starttime: string;
    endtime: string;
    price: number;
    port: {
      id: number;
      portName: string;
    },
    companyAddress: string;
    envelopesId: string;
    status: string;
  }
  