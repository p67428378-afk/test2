import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Heart, CheckCircle } from "lucide-react";
import { petService, applicationService } from "../services/api";
import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export const AdoptionFormPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    reason: "",
    has_other_pets: false,
    visit_date: "",
    visit_time: "",
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await petService.getPet(petId);
        setPet(data);
      } catch (err) {
        console.error("Error fetching pet details:", err);
        setError(
          "Failed to load pet details. Please return to the browse page.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        pet_id: petId,
      };
      await applicationService.submitApplication(payload);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to submit adoption application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-slate-500 text-lg animate-pulse">
            Loading pet details...
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-3xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center text-center">
          <div className="bg-green-100 p-4 rounded-full text-green-600 mb-6">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Application Submitted!
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            Thank you for your interest in adopting {pet?.name || "this pet"}.
            We have received your application and scheduled visit details. Our
            team will review it shortly.
          </p>
          <div className="space-x-4">
            <Link to="/">
              <Button variant="primary">Browse More Pets</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Browse
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pet Summary Card */}
          <div className="md:col-span-1">
            {pet && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden sticky top-24">
                <div className="h-48 bg-slate-100 relative">
                  {pet.photo_url ? (
                    <img
                      src={pet.photo_url}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Heart className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {pet.name}
                  </h2>
                  <p className="text-indigo-600 font-semibold text-sm mb-3">
                    {pet.breed}
                  </p>
                  <div className="space-y-2 text-sm text-slate-500 border-t border-slate-50 pt-3">
                    <p>
                      <strong>Age:</strong> {pet.age}{" "}
                      {pet.age === 1 ? "year" : "years"}
                    </p>
                    <p>
                      <strong>Location:</strong> {pet.location}
                    </p>
                    <p className="text-slate-600 mt-2 italic">
                      "{pet.description || "No description provided."}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Adoption Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Adoption Application & Visit Scheduler
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="applicant_name"
                    value={formData.applicant_name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    name="applicant_email"
                    type="email"
                    value={formData.applicant_email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <Input
                  label="Phone Number"
                  name="applicant_phone"
                  value={formData.applicant_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(123) 456-7890"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Why do you want to adopt {pet?.name || "this pet"}?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Please share your experience with pets and why you are a good fit..."
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="has_other_pets"
                    name="has_other_pets"
                    checked={formData.has_other_pets}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="has_other_pets"
                    className="ml-2 block text-sm text-slate-700"
                  >
                    I currently have other pets in my household
                  </label>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                    Schedule a Visit
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Preferred Visit Date"
                      name="visit_date"
                      type="date"
                      value={formData.visit_date}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Preferred Visit Time"
                      name="visit_time"
                      type="text"
                      value={formData.visit_time}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 10:00 AM or Afternoon"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting Application..."
                      : `Submit Application to Adopt ${pet?.name || ""}`}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdoptionFormPage;
