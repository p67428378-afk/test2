import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import BillingPage from "./pages/BillingPage";
import PharmacyPage from "./pages/PharmacyPage";
import {
  patientService,
  doctorService,
  appointmentService,
  medicalRecordService,
  billingService,
  pharmacyService,
} from "./services/api";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        patientsData,
        doctorsData,
        appointmentsData,
        invoicesData,
        medicationsData,
      ] = await Promise.all([
        patientService.list(),
        doctorService.list(),
        appointmentService.list(),
        billingService.listInvoices(),
        pharmacyService.listMedications(),
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setInvoices(invoicesData);
      setMedications(medicationsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "Failed to load data from the server. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterPatient = async (patientData) => {
    const newPatient = await patientService.create(patientData);
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const handleBookAppointment = async (appointmentData) => {
    const newAppointment = await appointmentService.create(appointmentData);
    // Refresh appointments to get populated patient and doctor names
    const updatedAppointments = await appointmentService.list();
    setAppointments(updatedAppointments);
    return newAppointment;
  };

  const handleCancelAppointment = async (id) => {
    await appointmentService.cancel(id);
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "cancelled" } : appt,
      ),
    );
  };

  const handleCreateRecord = async (recordData) => {
    const newRecord = await medicalRecordService.create(recordData);
    return newRecord;
  };

  const handleCreatePrescription = async (prescriptionData) => {
    const newPrescription =
      await pharmacyService.createPrescription(prescriptionData);
    return newPrescription;
  };

  const handleCreateInvoice = async (invoiceData) => {
    const newInvoice = await billingService.createInvoice(invoiceData);
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const handleProcessPayment = async (paymentData) => {
    const payment = await billingService.createPayment(paymentData);
    // Refresh invoices to get updated status
    const updatedInvoices = await billingService.listInvoices();
    setInvoices(updatedInvoices);
    return payment;
  };

  const handleSubmitClaim = async (invoiceId) => {
    const result = await billingService.submitClaim(invoiceId);
    // Refresh invoices to get updated status
    const updatedInvoices = await billingService.listInvoices();
    setInvoices(updatedInvoices);
    return result;
  };

  const handleCreateMedication = async (medicationData) => {
    const newMedication =
      await pharmacyService.createMedication(medicationData);
    setMedications((prev) =>
      [...prev, newMedication].sort((a, b) => a.name.localeCompare(b.name)),
    );
    return newMedication;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant font-medium">
            Loading CareFlow HMS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppLayout>
        {error && (
          <div
            className="p-4 bg-error-container text-error rounded-lg text-sm font-medium mb-6"
            role="alert"
          >
            {error}
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                patients={patients}
                appointments={appointments}
                invoices={invoices}
                medications={medications}
                onCancelAppointment={handleCancelAppointment}
              />
            }
          />
          <Route
            path="/patients"
            element={
              <PatientsPage
                patients={patients}
                onRegisterPatient={handleRegisterPatient}
              />
            }
          />
          <Route
            path="/appointments"
            element={
              <AppointmentsPage
                patients={patients}
                doctors={doctors}
                appointments={appointments}
                onBookAppointment={handleBookAppointment}
                onCancelAppointment={handleCancelAppointment}
              />
            }
          />
          <Route
            path="/medical-records"
            element={
              <MedicalRecordsPage
                patients={patients}
                doctors={doctors}
                medications={medications}
                onCreateRecord={handleCreateRecord}
                onCreatePrescription={handleCreatePrescription}
              />
            }
          />
          <Route
            path="/billing"
            element={
              <BillingPage
                patients={patients}
                appointments={appointments}
                invoices={invoices}
                onCreateInvoice={handleCreateInvoice}
                onProcessPayment={handleProcessPayment}
                onSubmitClaim={handleSubmitClaim}
              />
            }
          />
          <Route
            path="/pharmacy"
            element={
              <PharmacyPage
                medications={medications}
                onCreateMedication={handleCreateMedication}
              />
            }
          />
        </Routes>
      </AppLayout>
    </Router>
  );
}
