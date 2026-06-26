import React from "react";
import AppointmentTable from "../components/appointments/AppointmentTable";

export default function DashboardPage({
  patients,
  appointments,
  invoices,
  medications,
  onCancelAppointment,
}) {
  const activePatientsCount = patients.length;
  const appointmentsTodayCount = appointments.filter((appt) => {
    try {
      const today = new Date().toDateString();
      const apptDate = new Date(appt.appointment_date).toDateString();
      return today === apptDate;
    } catch (e) {
      return false;
    }
  }).length;

  const pendingInvoicesSum = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const lowStockMedsCount = medications.filter(
    (med) => med.stock_quantity < 10,
  ).length;

  return (
    <div className="space-y-section-gap">
      {/* Page Title */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
          Dashboard Overview
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Welcome back, Dr. Mercer. Here's what's happening today.
        </p>
      </div>

      {/* Row 1: KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 hover:shadow-[0px_4px_6px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Active Patients
            </p>
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <span className="material-symbols-outlined !text-[20px]">
                group
              </span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            {activePatientsCount}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined !text-[16px] text-green-600">
              trending_up
            </span>
            <span className="text-green-600 font-medium">+4.2%</span>
            <span className="text-on-surface-variant text-xs">this week</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 hover:shadow-[0px_4px_6px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Appointments Today
            </p>
            <div className="p-1.5 bg-secondary-container rounded-md text-on-secondary-container">
              <span className="material-symbols-outlined !text-[20px]">
                event_available
              </span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            {appointmentsTodayCount}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined !text-[16px] text-tertiary-container">
              schedule
            </span>
            <span className="text-tertiary-container font-medium">Active</span>
            <span className="text-on-surface-variant text-xs">schedule</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 hover:shadow-[0px_4px_6px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Pending Invoices
            </p>
            <div className="p-1.5 bg-error-container/50 rounded-md text-error">
              <span className="material-symbols-outlined !text-[20px]">
                receipt_long
              </span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            ${pendingInvoicesSum.toFixed(2)}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined !text-[16px] text-error">
              error
            </span>
            <span className="text-error font-medium">Unpaid</span>
            <span className="text-on-surface-variant text-xs">balance</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 hover:shadow-[0px_4px_6px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Pharmacy Alerts
            </p>
            <div className="p-1.5 bg-tertiary-container/10 rounded-md text-tertiary-container">
              <span className="material-symbols-outlined !text-[20px]">
                medication
              </span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            {lowStockMedsCount} Items
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined !text-[16px] text-tertiary-container">
              warning
            </span>
            <span className="text-tertiary-container font-medium">
              Low stock
            </span>
            <span className="text-on-surface-variant text-xs">
              attention needed
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        {/* Area Chart (8/12) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg border border-outline-variant p-4 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Patient Admissions &amp; Appointments
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                6 Months Trend Analysis
              </p>
            </div>
          </div>
          {/* Pure CSS/SVG Area Chart Representation */}
          <div className="relative flex-1 min-h-[240px] w-full pt-4">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-on-surface-variant font-label-sm">
              <span>500</span>
              <span>375</span>
              <span>250</span>
              <span>125</span>
              <span>0</span>
            </div>
            {/* Grid Lines & Chart Area */}
            <div className="absolute left-8 right-0 top-2 bottom-6 border-l border-b border-outline-variant">
              {/* Horizontal Grid Lines */}
              <div className="absolute w-full h-full flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-outline-variant/30 h-0"></div>
                <div className="w-full border-t border-outline-variant/30 h-0"></div>
                <div className="w-full border-t border-outline-variant/30 h-0"></div>
                <div className="w-full border-t border-outline-variant/30 h-0"></div>
                <div className="w-full h-0"></div>
              </div>
              {/* SVG Chart Drawing */}
              <svg
                className="w-full h-full absolute inset-0"
                preserveAspectRatio="none"
                viewBox="0 0 1000 300"
              >
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#006194"
                      stopOpacity="0.2"
                    ></stop>
                    <stop
                      offset="100%"
                      stopColor="#006194"
                      stopOpacity="0.01"
                    ></stop>
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  className="opacity-80"
                  d="M 0,250 C 150,200 250,280 400,150 C 550,20 650,180 800,100 C 900,40 950,90 1000,80 L 1000,300 L 0,300 Z"
                  fill="url(#areaGradient)"
                ></path>
                {/* Line Stroke */}
                <path
                  className="animate-area-path"
                  d="M 0,250 C 150,200 250,280 400,150 C 550,20 650,180 800,100 C 900,40 950,90 1000,80"
                  fill="none"
                  stroke="#006194"
                  strokeWidth="3"
                ></path>
              </svg>
            </div>
            {/* X-Axis Labels */}
            <div className="absolute left-8 right-0 bottom-0 flex justify-between text-xs text-on-surface-variant font-label-sm pt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Donut Chart (4/12) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-lg border border-outline-variant p-4 flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
            Appointment Status
          </h3>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">
            Today's Distribution
          </p>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* SVG Donut */}
            <div className="relative w-48 h-48">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#f1f4fa"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#006194"
                  strokeDasharray="163.28 251.2"
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  {appointments.length}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Total
                </span>
              </div>
            </div>
            {/* Legend */}
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-on-surface">Scheduled</span>
                </div>
                <span className="font-medium">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Data Table */}
      <AppointmentTable
        appointments={appointments}
        onCancelAppointment={onCancelAppointment}
      />
    </div>
  );
}
