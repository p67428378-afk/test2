import React, { useEffect, useState } from 'react';
import { getItems, createItem, updateItem } from '../services/api';
import DataTable from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    type: Yup.string().required('Required'),
    material: Yup.string().required('Required'),
    weight: Yup.number().required('Required').positive(),
    cost: Yup.number().required('Required').positive(),
    selling_price: Yup.number().required('Required').positive(),
    stock_level: Yup.number().required('Required').integer().min(0),
    location: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, values);
      } else {
        await createItem(values);
      }
      fetchItems();
      closeModal();
    } catch (error) {
      console.error("Error saving item:", error);
    }
    setSubmitting(false);
  };

  const headers = ['Name', 'Type', 'Material', 'Stock', 'Price', 'Location', 'Actions'];

  const renderRow = (item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
      <td className="px-6 py-4 whitespace-nowrap">{item.material}</td>
      <td className="px-6 py-4 whitespace-nowrap">{item.stock_level}</td>
      <td className="px-6 py-4 whitespace-nowrap">${item.selling_price}</td>
      <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => openModal(item)} className="bg-yellow-500 hover:bg-yellow-600">Edit</Button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory</h2>
        <Button onClick={() => openModal()}>Add New Item</Button>
      </div>
      <div className="mb-4">
        <SearchBar placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <DataTable headers={headers} data={filteredItems} renderRow={renderRow} />

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} title={editingItem ? 'Edit Item' : 'Add New Item'}>
        <Formik
          initialValues={editingItem || { name: '', type: '', material: '', weight: '', cost: '', selling_price: '', stock_level: '', location: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
            <Form>
              <FormInput name="name" label="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} touched={touched.name} />
              <FormInput name="type" label="Type" value={values.type} onChange={handleChange} onBlur={handleBlur} error={errors.type} touched={touched.type} />
              <FormInput name="material" label="Material" value={values.material} onChange={handleChange} onBlur={handleBlur} error={errors.material} touched={touched.material} />
              <FormInput name="weight" label="Weight (g)" type="number" value={values.weight} onChange={handleChange} onBlur={handleBlur} error={errors.weight} touched={touched.weight} />
              <FormInput name="cost" label="Cost" type="number" value={values.cost} onChange={handleChange} onBlur={handleBlur} error={errors.cost} touched={touched.cost} />
              <FormInput name="selling_price" label="Selling Price" type="number" value={values.selling_price} onChange={handleChange} onBlur={handleBlur} error={errors.selling_price} touched={touched.selling_price} />
              <FormInput name="stock_level" label="Stock Level" type="number" value={values.stock_level} onChange={handleChange} onBlur={handleBlur} error={errors.stock_level} touched={touched.stock_level} />
              <FormInput name="location" label="Location" value={values.location} onChange={handleChange} onBlur={handleBlur} error={errors.location} touched={touched.location} />
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">{isSubmitting ? 'Saving...' : 'Save'}</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default InventoryPage;
