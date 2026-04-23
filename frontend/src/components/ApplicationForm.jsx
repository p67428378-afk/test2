import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import SelectField from './SelectField';
import PrimaryButton from './PrimaryButton';
import { submitApplication } from '../services/api';

const ApplicationForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    full_name: Yup.string().required('Full name is required'),
    ssn: Yup.string()
      .required('SSN is required')
      .matches(/^(\d{3}-\d{2}-\d{4})$/, 'Invalid SSN format (XXX-XX-XXXX)'),
    date_of_birth: Yup.date().required('Date of birth is required'),
    address: Yup.string().required('Address is required'),
    annual_income: Yup.number()
      .required('Annual income is required')
      .positive('Annual income must be positive'),
    employment_status: Yup.string().required('Employment status is required'),
    credit_score: Yup.number()
      .required('Credit score is required')
      .integer('Credit score must be an integer')
      .min(300, 'Credit score must be at least 300')
      .max(850, 'Credit score must be at most 850'),
  });

  return (
    <div className='w-full max-w-3xl bg-surface-container-lowest rounded-xl p-8 md:p-12 card-ambient relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-1 h-full bg-primary'></div>
      <Formik
        initialValues={{
          full_name: '',
          ssn: '',
          date_of_birth: '',
          address: '',
          annual_income: '',
          employment_status: 'employed',
          credit_score: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const result = await submitApplication(values);
            navigate('/status', { state: { applicationResult: result } });
          } catch (error) {
            setStatus({ error: 'An unexpected error occurred. Please try again.' });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors, touched, status }) => (
          <Form className='space-y-10'>
            <section>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>01</span>
                <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Personal Identity</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <InputField
                  name='full_name'
                  label='Full Name'
                  type='text'
                  placeholder='John Doe'
                  error={touched.full_name && errors.full_name}
                />
                <div className='space-y-2'>
                  <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Date of Birth</label>
                  <div className='relative'>
                    <InputField
                      name='date_of_birth'
                      type='date'
                      error={touched.date_of_birth && errors.date_of_birth}
                    />
                    <span className='material-symbols-outlined text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>calendar_today</span>
                  </div>
                </div>
                <div className='space-y-2 md:col-span-2'>
                  <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Social Security Number (SSN)</label>
                  <div className='relative'>
                    <InputField
                      name='ssn'
                      type='password'
                      placeholder='XXX-XX-XXXX'
                      error={touched.ssn && errors.ssn}
                    />
                    <div className='absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-on-surface-variant/80'>
                      <span className='material-symbols-outlined text-sm'>lock</span>
                      <span className='text-xs font-medium'>Your data is encrypted.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>02</span>
                <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Residency Details</h2>
              </div>
              <InputField
                name='address'
                label='Current Address'
                type='text'
                error={touched.address && errors.address}
              />
            </section>
            <section>
              <div className='flex items-center gap-2 mb-6'>
                <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>03</span>
                <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Financial Profile</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <SelectField
                  name='employment_status'
                  label='Employment Status'
                  error={touched.employment_status && errors.employment_status}
                >
                  <option value='employed'>Employed</option>
                  <option value='unemployed'>Unemployed</option>
                  <option value='student'>Student</option>
                  <option value='retired'>Retired</option>
                </SelectField>
                <InputField
                  name='annual_income'
                  label='Annual Income ($)'
                  type='number'
                  error={touched.annual_income && errors.annual_income}
                />
                <div className='space-y-2 md:col-span-2'>
                  <InputField
                    name='credit_score'
                    label='Estimated Credit Score'
                    type='number'
                    error={touched.credit_score && errors.credit_score}
                  />
                </div>
              </div>
            </section>
            {status && status.error && (
              <div className='bg-error-container p-4 rounded-lg flex items-start gap-3'>
                <span className='material-symbols-outlined text-error'>error</span>
                <div className='text-on-error-container text-sm'>
                  <p className='font-bold'>Error</p>
                  <p>{status.error}</p>
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
