import React, { useEffect, useState } from 'react';
import { getSalesHistory, recordSale, getItems, getCustomers } from '../services/api';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/common/FormInput';
import Dropdown from '../components/common/Dropdown';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSales();
    fetchDropdownData();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await getSalesHistory();
      setSales(res.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const itemsRes = await getItems();
      setItems(itemsRes.data.map(i => ({ value: i.id, label: i.name })));
      const customersRes = await getCustomers();
      setCustomers(customersRes.data.map(c => ({ value: c.id, label: c.name })));
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const validationSchema = Yup.object({
    customer_id: Yup.string().required('Customer is required'),
    items: Yup.array()
      .of(
        Yup.object({
          item_id: Yup.string().required('Item is required'),
          quantity: Yup.number().required('Quantity is required').integer().min(1),
          price: Yup.number().required('Price is required').positive(),
        })
      )
      .min(1, 'At least one item is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await recordSale(values);
      fetchSales();
      closeModal();
    } catch (error) {
      console.error("Error recording sale:", error);
    }
    setSubmitting(false);
  };

  const headers = ['Sale ID', 'Date', 'Customer', 'Total Amount', 'Profit'];

  const renderRow = (sale) => (
    <tr key={sale.id}>
      <td className="px-6 py-4 whitespace-nowrap">{sale.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap">{sale.customer_id}</td>
      <td className="px-6 py-4 whitespace-nowrap">${sale.total_amount.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap">${sale.profit.toFixed(2)}</td>
    </tr>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sales History</h2>
        <Button onClick={openModal}>Record New Sale</Button>
      </div>
      <DataTable headers={headers} data={sales} renderRow={renderRow} />

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} title="Record New Sale">
        <Formik
          initialValues={{ customer_id: '', items: [{ item_id: '', quantity: 1, price: '' }] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Dropdown name="customer_id" options={customers} onSelect={(value) => handleChange({ target: { name: 'customer_id', value } })} placeholder="Select Customer" error={errors.customer_id} touched={touched.customer_id} />

              <FieldArray name="items">
                {({ push, remove }) => (
                  <div>
                    {values.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 my-2">
                        <div className="w-1/2">
                           <Dropdown name={`items.${index}.item_id`} options={items} onSelect={(value) => handleChange({ target: { name: `items.${index}.item_id`, value } })} placeholder="Select Item" />
                        </div>
                        <FormInput name={`items.${index}.quantity`} type="number" value={item.quantity} onChange={handleChange} onBlur={handleBlur} />
                        <FormInput name={`items.${index}.price`} type="number" value={item.price} onChange={handleChange} onBlur={handleBlur} />
                        <Button type="button" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600">X</Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => push({ item_id: '', quantity: 1, price: '' })} className="mt-2">Add Item</Button>
                  </div>
                )}
              </FieldArray>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">{isSubmitting ? 'Recording...' : 'Record Sale'}</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default SalesPage;
