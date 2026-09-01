import React, { useState, useEffect } from "react";
import { listInmates, listVisitors, createAppointment } from "../services/api";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
];

const AppointmentScheduler = ({
  initialVisitorId = "",
  onAppointmentCreated,
}) => {
  const [inmates, setInmates] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [visitorId, setVisitorId] = useState(initialVisitorId);
  const [inmateId, setInmateId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [slotDuration, setSlotDuration] = useState(30);
  const [relationship, setRelationship] = useState("Family");

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (initialVisitorId) {
      setVisitorId(initialVisitorId);
      autoSelectCategoryDuration(initialVisitorId);
    }
  }, [initialVisitorId, visitors]);

  const loadOptions = async () => {
    setFetchingData(true);
    try {
      const [inmateRes, visitorRes] = await Promise.all([
        listInmates({ status: "ACTIVE" }),
        listVisitors(),
      ]);
      setInmates(inmateRes || []);
      setVisitors(visitorRes || []);
      if (inmateRes?.length > 0 && !inmateId) {
        setInmateId(inmateRes[0].id);
      }
      if (visitorRes?.length > 0 && !visitorId && !initialVisitorId) {
        const firstV = visitorRes[0];
        setVisitorId(firstV.id);
        if (firstV.visitor_type === "LEGAL") {
          setSlotDuration(60);
          setRelationship("Attorney");
        }
      }
    } catch (err) {
      console.error("Error loading options:", err);
    } finally {
      setFetchingData(false);
    }
  };

  const autoSelectCategoryDuration = (vid) => {
    const selectedV = visitors.find((v) => v.id === vid);
    if (selectedV) {
      if (selectedV.visitor_type === "LEGAL") {
        setSlotDuration(60);
        setRelationship("Attorney");
      } else {
        setSlotDuration(30);
      }
    }
  };

  const handleVisitorChange = (e) => {
    const vid = e.target.value;
    setVisitorId(vid);
    autoSelectCategoryDuration(vid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!visitorId) {
      setError("Please select or register a visitor profile first.");
      setLoading(false);
      return;
    }
    if (!inmateId) {
      setError("Please select an eligible inmate.");
      setLoading(false);
      return;
    }
    if (!visitDate) {
      setError("Please select a valid visit date.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        visitor_id: visitorId,
        inmate_id: inmateId,
        visit_date: visitDate,
        start_time: startTime,
        slot_duration_minutes: parseInt(slotDuration, 10),
        relationship: relationship,
      };

      const result = await createAppointment(payload);
      setSuccessMsg(`Appointment requested successfully! ID: ${result.id}`);
      if (onAppointmentCreated) {
        onAppointmentCreated(result);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to schedule appointment.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Schedule Visit & Pass Request
          </h2>
          <p className="text-sm text-slate-500">
            Book visit slots with category quota enforcement & dynamic durations
          </p>
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start space-x-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Dynamic Quotas & Durations:</span>{" "}
          Standard Visitors (30-min slot, 2 visits/wk). Legal Counsel (60-min
          slot, 5 visits/wk quota).
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-xs font-semibold text-slate-700 uppercase mb-1"
            htmlFor="visitor_select"
          >
            Select Visitor Profile *
          </label>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-slate-400" />
            <select
              id="visitor_select"
              value={visitorId}
              onChange={handleVisitorChange}
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">-- Choose Registered Visitor --</option>
              {visitors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.full_name} ({v.national_id}) - [
                  {v.visitor_type || "STANDARD"}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            className="block text-xs font-semibold text-slate-700 uppercase mb-1"
            htmlFor="inmate_select"
          >
            Select Inmate Target *
          </label>
          <select
            id="inmate_select"
            value={inmateId}
            onChange={(e) => setInmateId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">-- Choose Eligible Inmate --</option>
            {inmates.map((i) => (
              <option key={i.id} value={i.id}>
                {i.full_name} (No: {i.inmate_number}) - Cell {i.cell_location}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="slot_duration"
            >
              Slot Duration
            </label>
            <select
              id="slot_duration"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
            >
              <option value={30}>30 Minutes (Standard Visitor)</option>
              <option value={60}>60 Minutes (Legal Counsel / Attorney)</option>
            </select>
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="relationship"
            >
              Relationship to Inmate *
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="Spouse">Spouse</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Sibling">Sibling</option>
              <option value="Attorney">Attorney / Legal Counsel</option>
              <option value="Friend">Friend / Relative</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="visit_date"
            >
              Visit Date *
            </label>
            <input
              id="visit_date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="start_time"
            >
              Start Time Slot *
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <select
                id="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading || fetchingData}
            className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg shadow transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Submitting Request...</span>
            ) : (
              <span>Submit Request & Issue Digital Pass</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentScheduler;
