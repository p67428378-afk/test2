import React from 'react';
import ChooseCard from '../components/ChooseCard';
import ApplicationJourney from '../components/ApplicationJourney';
import PersonalDetails from '../components/PersonalDetails';
import FinancialStatus from '../components/FinancialStatus';
import EmploymentInfo from '../components/EmploymentInfo';
import FormFooter from '../components/FormFooter';

const ApplicationForm = () => {
  return (
    <>
      <ChooseCard />
      <section className='grid grid-cols-12 gap-12'>
        <ApplicationJourney />
        <div className='col-span-12 lg:col-span-9 space-y-16'>
          <PersonalDetails />
          <FinancialStatus />
          <EmploymentInfo />
          <FormFooter />
        </div>
      </section>
    </>
  );
};

export default ApplicationForm;
