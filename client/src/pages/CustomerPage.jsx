import React, { useEffect, useState } from 'react';
import { getCustomers, createCustomer, updateCustomer } from '../services/api';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFilteredCustomers(
      customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    contact_information: Yup.object({
        email: Yup.string().email('Invalid email'),
        phone: Yup.string()
    })
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, values);
      } else {
        await createCustomer(values);
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
    setSubmitting(false);
  };

  const headers = ['Name', 'Email', 'Phone', 'Actions'];

  const renderRow = (customer) => (
    <tr key={customer.id}>
      <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{customer.contact_information.email}</td>
      <td className="px-6 py-4 whitespace-nowrap">{customer.contact_information.phone}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => openModal(customer)} className="bg-yellow-500 hover:bg-yellow-600">Edit</Button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={() => openModal()}>Add New Customer</Button>
      </div>
      <div className="mb-4">
        <SearchBar placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <DataTable headers={headers} data={filteredCustomers} renderRow={renderRow} />

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}>
        <Formik
          initialValues={editingCustomer || { name: '', contact_information: { email: '', phone: '' } }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
            <Form>
              <FormInput name="name" label="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} touched={touched.name} />
              <FormInput name="contact_information.email" label="Email" type="email" value={values.contact_information.email} onChange={handleChange} onBlur={handleBlur} error={errors.contact_information?.email} touched={touched.contact_information?.email} />
              <FormInput name="contact_information.phone" label="Phone" value={values.contact_information.phone} onChange={handleChange} onBlur={handleBlur} error={errors.contact_information?.phone} touched={touched.contact_information?.phone} />
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">{isSubmitting ? 'Saving...' : 'Save'}</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default CustomerPage;
