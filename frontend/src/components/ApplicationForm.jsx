import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from './InputField';
import SelectField from './SelectField';
import PrimaryButton from './PrimaryButton';
import { submitApplication } from '../services/api';

const ApplicationForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const initialValues = {
    full_name: 'Jane Doe',
    date_of_birth: '1990-05-15',
    ssn: '123-45-6789',
    address: '456 Oak Ave, Cityville, State, 12345',
    employment_status: 'employed',
    annual_income: 85000,
    credit_score: 730,
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required('Full Name is required'),
    date_of_birth: Yup.date().required('Date of Birth is required'),
    ssn: Yup.string()
      .required('SSN is required')
      .matches(/^\d{3}-\d{2}-\d{4}$/, 'Invalid SSN format. Use XXX-XX-XXXX'),
    address: Yup.string().required('Address is required'),
    employment_status: Yup.string().required('Employment Status is required'),
    annual_income: Yup.number()
      .required('Annual Income is required')
      .positive('Annual Income must be positive'),
    credit_score: Yup.number()
      .required('Credit Score is required')
      .min(300, 'Credit Score must be at least 300')
      .max(850, 'Credit Score must be at most 850'),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const data = await submitApplication(values);
      setSubmissionStatus({ success: true, data });
      setStatus({ success: true });
    } catch (error) {
      setSubmissionStatus({ success: false, message: error.response?.data?.detail || error.message });
      setStatus({ success: false });
    }
    setSubmitting(false);
  };

  return (
    <div className='w-full max-w-3xl bg-surface-container-lowest rounded-xl p-8 md:p-12 card-ambient relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-1 h-full bg-primary'></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className='space-y-10'>
            <section>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>01</span>
                <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Personal Identity</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <InputField name='full_name' label='Full Name' type='text' placeholder='John Doe' error={touched.full_name && errors.full_name} />
                <InputField name='date_of_birth' label='Date of Birth' type='date' error={touched.date_of_birth && errors.date_of_birth} />
                <div className='md:col-span-2'>
                  <InputField name='ssn' label='Social Security Number (SSN)' type='password' placeholder='XXX-XX-XXXX' error={touched.ssn && errors.ssn} />
                </div>
              </div>
            </section>

            <section>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>02</span>
                <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Residency Details</h2>
              </div>
              <InputField name='address' label='Current Address' type='text' error={touched.address && errors.address} />
            </section>

            <section>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>03</span>
                <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Financial Profile</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <SelectField name='employment_status' label='Employment Status' error={touched.employment_status && errors.employment_status}>
                  <option value='employed'>Employed</option>
                  <option value='unemployed'>Unemployed</option>
                  <option value='student'>Student</option>
                  <option value='retired'>Retired</option>
                </SelectField>
                <InputField name='annual_income' label='Annual Income ($)' type='number' error={touched.annual_income && errors.annual_income} />
                <div className='md:col-span-2'>
                  <InputField name='credit_score' label='Estimated Credit Score' type='number' error={touched.credit_score && errors.credit_score} />
                </div>
              </div>
            </section>

            {submissionStatus && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${submissionStatus.success ? 'bg-green-100' : 'bg-error-container'}`}>
                <span className={`material-symbols-outlined ${submissionStatus.success ? 'text-green-700' : 'text-error'}`}>
                  {submissionStatus.success ? 'check_circle' : 'error'}
                </span>
                <div className={`text-sm ${submissionStatus.success ? 'text-green-700' : 'text-on-error-container'}`}>
                  <p className='font-bold'>{submissionStatus.success ? 'Success' : 'Error'}</p>
                  <p>{submissionStatus.success ? `Application ${submissionStatus.data.status}. ${submissionStatus.data.decision_message}` : submissionStatus.message}</p>
                </div>
              </div>
            )}

            <div className='pt-6 border-t border-outline-variant/10'>
              <PrimaryButton isSubmitting={isSubmitting} />
              <p className='text-center mt-4 text-xs text-on-surface-variant'>By clicking submit, you agree to our <a className='text-primary underline' href='#'>Terms of Service</a> and Privacy Policy.</p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ApplicationForm;
