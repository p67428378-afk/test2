import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/common/FormInput';

const inventoryData = [
    { id: 1, name: 'Gold Ring', type: 'Ring', material: 'Gold', weight: 5.5, cost: 250, selling_price: 450, stock_level: 10, location: 'Store A', status: 'Available' },
    { id: 2, name: 'Diamond Necklace', type: 'Necklace', material: 'Diamond', weight: 10.2, cost: 1200, selling_price: 2500, stock_level: 5, location: 'Store B', status: 'Available' },
];

const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Material', accessor: 'material' },
    { Header: 'Stock', accessor: 'stock_level' },
    { Header: 'Status', accessor: 'status' },
];

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    type: Yup.string().required('Required'),
    material: Yup.string().required('Required'),
    stock_level: Yup.number().required('Required'),
});

const InventoryPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (query) => {
        console.log('Searching for:', query);
    };

    const handleAddItem = (values) => {
        console.log('New item:', values);
        setIsModalOpen(false);
    };

  return (
    <div>
        <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold'>Inventory</h2>
            <div className='flex items-center space-x-4'>
                <SearchBar onSearch={handleSearch} placeholder="Search inventory..." />
                <Button onClick={() => setIsModalOpen(true)}>Add Item</Button>
            </div>
        </div>
        <DataTable columns={columns} data={inventoryData} />

        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} title="Add New Item">
            <Formik
                initialValues={{ name: '', type: '', material: '', stock_level: 0 }}
                validationSchema={validationSchema}
                onSubmit={handleAddItem}
            >
                <Form>
                    <FormInput label="Name" name="name" type="text" />
                    <FormInput label="Type" name="type" type="text" />
                    <FormInput label="Material" name="material" type="text" />
                    <FormInput label="Stock Level" name="stock_level" type="number" />
                    <Button type="submit">Submit</Button>
                </Form>
            </Formik>
        </Modal>
    </div>
  );
};

export default InventoryPage;
