import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/common/FormInput';

const salesData = [
    { id: 1, date: '2024-05-10', customer_id: 'C001', total_amount: 450, profit: 200 },
    { id: 2, date: '2024-05-11', customer_id: 'C002', total_amount: 2500, profit: 1300 },
];

const columns = [
    { Header: 'Sale ID', accessor: 'id' },
    { Header: 'Date', accessor: 'date' },
    { Header: 'Customer ID', accessor: 'customer_id' },
    { Header: 'Total Amount', accessor: 'total_amount' },
    { Header: 'Profit', accessor: 'profit' },
];

const validationSchema = Yup.object({
    customer_id: Yup.string().required('Required'),
    item_id: Yup.string().required('Required'),
    quantity: Yup.number().required('Required'),
});

const SalesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRecordSale = (values) => {
        console.log('New sale:', values);
        setIsModalOpen(false);
    };

  return (
    <div>
        <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold'>Sales History</h2>
            <Button onClick={() => setIsModalOpen(true)}>Record Sale</Button>
        </div>
        <DataTable columns={columns} data={salesData} />

        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} title="Record New Sale">
            <Formik
                initialValues={{ customer_id: '', item_id: '', quantity: 1 }}
                validationSchema={validationSchema}
                onSubmit={handleRecordSale}
            >
                <Form>
                    <FormInput label="Customer ID" name="customer_id" type="text" />
                    <FormInput label="Item ID" name="item_id" type="text" />
                    <FormInput label="Quantity" name="quantity" type="number" />
                    <Button type="submit">Submit</Button>
                </Form>
            </Formik>
        </Modal>
    </div>
  );
};

export default SalesPage;
