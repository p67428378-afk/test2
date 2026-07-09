import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ShieldAlert,
  Users,
  Heart,
  FileText,
} from "lucide-react";
import { authService, petService, applicationService } from "../services/api";
import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  // Login state
  const [loginEmail, setLoginEmail] = useState("admin@example.com");
  const [loginPassword, setLoginPassword] = useState("adminpassword");
  const [loginError, setLoginError] = useState("");

  // Dashboard tabs: 'pets' or 'applications'
  const [activeTab, setActiveTab] = useState("pets");

  // Data states
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pet Form Modal state
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petFormData, setPetFormData] = useState({
    name: "",
    breed: "",
    age: "",
    location: "",
    status: "Available",
    photo_url: "",
    description: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "pets") {
        const data = await petService.getPets();
        setPets(data.items || []);
      } else {
        const data = await applicationService.getApplications();
        setApplications(data.items || []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await authService.login({ email: loginEmail, password: loginPassword });
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  // Pet CRUD operations
  const handleOpenPetModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setPetFormData({
        name: pet.name,
        breed: pet.breed,
        age: pet.age.toString(),
        location: pet.location,
        status: pet.status,
        photo_url: pet.photo_url || "",
        description: pet.description || "",
      });
    } else {
      setEditingPet(null);
      setPetFormData({
        name: "",
        breed: "",
        age: "",
        location: "",
        status: "Available",
        photo_url: "",
        description: "",
      });
    }
    setShowPetModal(true);
  };

  const handlePetFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...petFormData,
        age: parseFloat(petFormData.age),
      };

      if (editingPet) {
        await petService.updatePet(editingPet.id, payload);
      } else {
        await petService.createPet(payload);
      }
      setShowPetModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error saving pet:", err);
      setError("Failed to save pet record. Please check your inputs.");
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet record?")) {
      try {
        await petService.deletePet(petId);
        fetchDashboardData();
      } catch (err) {
        console.error("Error deleting pet:", err);
        setError("Failed to delete pet record.");
      }
    }
  };

  // Application status updates
  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating application status:", err);
      setError("Failed to update application status.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-slate-100">
            <div className="text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-indigo-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                Admin Portal
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Please sign in to manage pets and applications.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {loginError}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-600 space-y-1">
                <p className="font-semibold">Test Credentials:</p>
                <p>
                  Email: <span className="font-mono">admin@example.com</span>
                </p>
                <p>
                  Password: <span className="font-mono">adminpassword</span>
                </p>
              </div>

              <div>
                <Button type="submit" className="w-full py-3">
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage pet records and review adoption applications.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {activeTab === "pets" && (
              <Button
                onClick={() => handleOpenPetModal()}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pet</span>
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("pets")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === "pets"
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Manage Pets</span>
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === "applications"
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Adoption Applications</span>
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 animate-pulse">
            Loading dashboard data...
          </div>
        ) : activeTab === "pets" ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Breed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {pets.map((pet) => (
                    <tr key={pet.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {pet.photo_url ? (
                              <img
                                src={pet.photo_url}
                                alt={pet.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Heart className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900">
                              {pet.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {pet.breed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {pet.age} yrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {pet.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            pet.status === "Available" ? "success" : "warning"
                          }
                        >
                          {pet.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleOpenPetModal(pet)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pets.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No pet records found. Click "Add Pet" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">
                          {app.applicant_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {app.pet_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {app.visit_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            app.status === "Approved"
                              ? "success"
                              : app.status === "Rejected"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {app.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateAppStatus(app.id, "Approved")
                              }
                              className="text-green-600 hover:text-green-900 inline-flex items-center mr-2"
                            >
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateAppStatus(app.id, "Rejected")
                              }
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" /> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No adoption applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pet Form Modal */}
        {showPetModal && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {editingPet ? "Edit Pet Record" : "Add New Pet"}
              </h3>
              <form onSubmit={handlePetFormSubmit} className="space-y-4">
                <Input
                  label="Pet Name"
                  value={petFormData.name}
                  onChange={(e) =>
                    setPetFormData({ ...petFormData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Breed"
                  value={petFormData.breed}
                  onChange={(e) =>
                    setPetFormData({ ...petFormData, breed: e.target.value })
                  }
                  required
                />
                <Input
                  label="Age (years)"
                  type="number"
                  step="any"
                  value={petFormData.age}
                  onChange={(e) =>
                    setPetFormData({ ...petFormData, age: e.target.value })
                  }
                  required
                />
                <Input
                  label="Location"
                  value={petFormData.location}
                  onChange={(e) =>
                    setPetFormData({ ...petFormData, location: e.target.value })
                  }
                  required
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={petFormData.status}
                    onChange={(e) =>
                      setPetFormData({ ...petFormData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
                <Input
                  label="Photo URL"
                  value={petFormData.photo_url}
                  onChange={(e) =>
                    setPetFormData({
                      ...petFormData,
                      photo_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/photo.jpg"
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={petFormData.description}
                    onChange={(e) =>
                      setPetFormData({
                        ...petFormData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => setShowPetModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Pet</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
