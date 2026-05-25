import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/common/FormInput';

const customerData = [
    { id: 'C001', name: 'John Doe', contact_information: { email: 'john.doe@example.com' } },
    { id: 'C002', name: 'Jane Smith', contact_information: { email: 'jane.smith@example.com' } },
];

const columns = [
    { Header: 'Customer ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'contact_information.email' },
];

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

const CustomerPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (query) => {
        console.log('Searching for:', query);
    };

    const handleAddCustomer = (values) => {
        console.log('New customer:', values);
        setIsModalOpen(false);
    };

  return (
    <div>
        <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold'>Customers</h2>
            <div className='flex items-center space-x-4'>
                <SearchBar onSearch={handleSearch} placeholder="Search customers..." />
                <Button onClick={() => setIsModalOpen(true)}>Add Customer</Button>
            </div>
        </div>
        <DataTable columns={columns} data={customerData.map(c => ({...c, 'contact_information.email': c.contact_information.email}))} />

        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} title="Add New Customer">
            <Formik
                initialValues={{ name: '', email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleAddCustomer}
            >
                <Form>
                    <FormInput label="Name" name="name" type="text" />
                    <FormInput label="Email" name="email" type="email" />
                    <Button type="submit">Submit</Button>
                </Form>
            </Formik>
        </Modal>
    </div>
  );
};

export default CustomerPage;
