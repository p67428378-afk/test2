import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ButtonPrimary from '../components/common/ButtonPrimary';

const ApplicationFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    annual_income: '',
    employment_status: 'Employed',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/v1/applications/', formData);
      navigate(`/result/${response.data.id}`);
    } catch (error) {
      console.error('Application submission failed', error);
      // Handle error display to user
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-[2.75rem] font-extrabold tracking-[-0.02em] leading-tight mb-4">Elevate your financial journey.</h1>
        <p className="max-w-xl mx-auto">Complete your application in minutes. Experience a credit service designed for the modern architect of wealth.</p>
      </div>
      <Card className="bg-white rounded-[2rem] p-10 md:p-16 shadow-lg">
        <form className="space-y-12" onSubmit={handleSubmit}>
          <section>
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input id="first_name" label="First Name" value={formData.first_name} onChange={handleChange} required placeholder="John" />
              <Input id="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} required placeholder="Doe" />
              <Input id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required placeholder="john.doe@example.com" />
              <Input id="phone_number" label="Phone Number" type="tel" value={formData.phone_number} onChange={handleChange} required placeholder="555-123-4567" />
              <div className="md:col-span-2">
                <Input id="address" label="Residential Address" value={formData.address} onChange={handleChange} required placeholder="123 Main St, Anytown, USA" />
              </div>
              <Input id="date_of_birth" label="Date of Birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-6">Financial Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input id="annual_income" label="Annual Gross Income" type="number" value={formData.annual_income} onChange={handleChange} required placeholder="65000" />
              <Select id="employment_status" label="Employment Status" value={formData.employment_status} onChange={handleChange} required>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
              </Select>
            </div>
          </section>
          <div className="pt-6 flex flex-col items-center gap-4">
             <p className="text-xs text-gray-500">By submitting, you agree to our Terms and Conditions.</p>
            <ButtonPrimary type="submit">Submit Application</ButtonPrimary>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApplicationFormPage;
