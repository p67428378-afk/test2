import React, { useState, useEffect } from "react";
import {
  Shield,
  Activity,
  AlertTriangle,
  MapPin,
  Plus,
  Search,
  Bell,
  HelpCircle,
  FileText,
  Heart,
  Navigation,
  Trash2,
  Edit,
  CheckCircle,
  Lock,
  RefreshCw,
} from "lucide-react";
import { apiService } from "./services/api";

export default function App() {
  // Navigation state: 'dashboard' | 'health' | 'zones' | 'reports' | 'password-reset'
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Data states
  const [animals, setAnimals] = useState([]);
  const [locations, setLocations] = useState([]);
  const [healthExams, setHealthExams] = useState([]);
  const [protectedZones, setProtectedZones] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [migrationPath, setMigrationPattern] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    species: "",
    gps_tag_id: "",
  });

  const [showExamModal, setShowExamModal] = useState(false);
  const [newExam, setNewExam] = useState({
    animal_id: "",
    examination_date: new Date().toISOString().split("T")[0],
    veterinarian: "",
    health_status: "Healthy",
    notes: "",
  });

  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: "", area: "" });
  const [editingZone, setEditingZone] = useState(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    gps_tag_id: "",
    latitude: 0.0,
    longitude: 0.0,
    timestamp: new Date().toISOString(),
  });

  // Password Reset Flow States
  const [resetStep, setResetStep] = useState(1); // 1: Initiate, 2: OTP, 3: Security Question, 4: New Password, 5: Success
  const [resetForm, setResetForm] = useState({
    login_id: "",
    mobile_number: "",
    otp_code: "",
    otp_session_id: "",
    security_question: "",
    security_question_session_id: "",
    answer: "",
    password_reset_session_id: "",
    new_password: "",
    login_link: "",
  });
  const [resetError, setResetError] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [animalsData, locationsData, examsData, zonesData] =
        await Promise.all([
          apiService.getAnimals(),
          apiService.getLatestLocations(),
          apiService.getHealthExaminations(),
          apiService.getProtectedZones(),
        ]);
      setAnimals(animalsData || []);
      setLocations(locationsData || []);
      setHealthExams(examsData || []);
      setProtectedZones(zonesData || []);

      if (animalsData && animalsData.length > 0) {
        setSelectedAnimal(animalsData[0]);
      }
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

  // Fetch migration pattern when selected animal changes
  useEffect(() => {
    if (selectedAnimal) {
      apiService
        .getMigrationPattern(selectedAnimal.id)
        .then((data) => setMigrationPattern(data || []))
        .catch((err) =>
          console.error("Error fetching migration pattern:", err),
        );
    }
  }, [selectedAnimal]);

  // Handlers
  const handleCreateAnimal = async (e) => {
    e.preventDefault();
    try {
      const created = await apiService.createAnimal(newAnimal);
      setAnimals([...animals, created]);
      setShowAnimalModal(false);
      setNewAnimal({ name: "", species: "", gps_tag_id: "" });
      setSelectedAnimal(created);
    } catch (err) {
      alert(
        "Failed to create animal: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const created = await apiService.createHealthExamination(newExam);
      setHealthExams([created, ...healthExams]);
      setShowExamModal(false);
      setNewExam({
        animal_id: "",
        examination_date: new Date().toISOString().split("T")[0],
        veterinarian: "",
        health_status: "Healthy",
        notes: "",
      });
    } catch (err) {
      alert(
        "Failed to log health exam: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleCreateOrUpdateZone = async (e) => {
    e.preventDefault();
    try {
      if (editingZone) {
        const updated = await apiService.updateProtectedZone(
          editingZone.id,
          newZone,
        );
        setProtectedZones(
          protectedZones.map((z) => (z.id === editingZone.id ? updated : z)),
        );
      } else {
        const created = await apiService.createProtectedZone(newZone);
        setProtectedZones([...protectedZones, created]);
      }
      setShowZoneModal(false);
      setEditingZone(null);
      setNewZone({ name: "", area: "" });
    } catch (err) {
      alert(
        "Failed to save protected zone: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (
      window.confirm("Are you sure you want to delete this protected zone?")
    ) {
      try {
        await apiService.deleteProtectedZone(zoneId);
        setProtectedZones(protectedZones.filter((z) => z.id !== zoneId));
      } catch (err) {
        alert(
          "Failed to delete zone: " +
            (err.response?.data?.detail || err.message),
        );
      }
    }
  };

  const handleRecordLocation = async (e) => {
    e.preventDefault();
    try {
      const created = await apiService.recordLocation(newLocation);
      setLocations([created, ...locations]);
      setShowLocationModal(false);
      setNewLocation({
        gps_tag_id: "",
        latitude: 0.0,
        longitude: 0.0,
        timestamp: new Date().toISOString(),
      });
      fetchData(); // Refresh map markers
    } catch (err) {
      alert(
        "Failed to record location: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleExportReport = async () => {
    try {
      const report = await apiService.getConservationReport();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(report, null, 2),
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", "conservation_report.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert("Failed to generate report: " + err.message);
    }
  };

  // Password Reset Flow Handlers
  const handleResetInitiate = async (e) => {
    e.preventDefault();
    setResetError(null);
    try {
      const res = await apiService.initiatePasswordReset(
        resetForm.login_id,
        resetForm.mobile_number,
      );
      setResetForm({
        ...resetForm,
        otp_session_id: res.otp_session_id,
        security_question: res.security_question,
      });
      setResetStep(2);
    } catch (err) {
      setResetError(
        err.response?.data?.detail || "Failed to initiate password reset.",
      );
    }
  };

  const handleResetVerifyOtp = async (e) => {
    e.preventDefault();
    setResetError(null);
    try {
      const res = await apiService.verifyOtp(
        resetForm.otp_code,
        resetForm.otp_session_id,
      );
      setResetForm({
        ...resetForm,
        security_question_session_id: res.security_question_session_id,
      });
      setResetStep(3);
    } catch (err) {
      setResetError(err.response?.data?.detail || "Invalid OTP code.");
    }
  };

  const handleResetVerifySecurityQuestion = async (e) => {
    e.preventDefault();
    setResetError(null);
    try {
      const res = await apiService.verifySecurityQuestion(
        resetForm.answer,
        resetForm.security_question_session_id,
      );
      setResetForm({
        ...resetForm,
        password_reset_session_id: res.password_reset_session_id,
      });
      setResetStep(4);
    } catch (err) {
      setResetError(
        err.response?.data?.detail || "Incorrect answer to security question.",
      );
    }
  };

  const handleResetSetNewPassword = async (e) => {
    e.preventDefault();
    setResetError(null);
    try {
      const res = await apiService.setNewPassword(
        resetForm.new_password,
        resetForm.password_reset_session_id,
      );
      setResetForm({
        ...resetForm,
        login_link: res.login_link,
      });
      setResetStep(5);
    } catch (err) {
      setResetError(
        err.response?.data?.detail || "Failed to set new password.",
      );
    }
  };

  // Filtered lists
  const filteredAnimals = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.gps_tag_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex bg-[#051424] text-[#d4e4fa] font-sans w-full">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full w-[260px] bg-[#0d1c2d] border-r border-[#3c4a42] flex flex-col py-4 px-2 z-50">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center emerald-glow">
            <Activity className="text-[#00422b] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#4edea3]">EcoTrack</h1>
            <p className="text-xs text-[#bbcabf]">Biodiversity Monitoring</p>
          </div>
        </div>

        <button
          onClick={() => {
            setNewExam({ ...newExam, animal_id: animals[0]?.id || "" });
            setShowExamModal(true);
          }}
          className="w-full bg-[#10b981] text-[#00422b] font-semibold rounded-lg py-2 px-4 flex items-center justify-center gap-2 mb-6 hover:bg-[#6ffbbe] transition-colors duration-200 emerald-glow hover:shadow-[0_0_20px_-2px_rgba(16,185,129,0.5)]"
        >
          <Plus className="w-4 h-4" />
          New Exam Entry
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center gap-4 rounded-lg p-3 transition-all ${currentTab === "dashboard" ? "bg-[#0566d9] text-[#e6ecff] shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : "text-[#bbcabf] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]"}`}
          >
            <Navigation className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab("health")}
            className={`flex items-center gap-4 rounded-lg p-3 transition-all ${currentTab === "health" ? "bg-[#0566d9] text-[#e6ecff] shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : "text-[#bbcabf] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]"}`}
          >
            <Heart className="w-5 h-5" />
            <span className="font-medium text-sm">Health Records</span>
          </button>

          <button
            onClick={() => setCurrentTab("zones")}
            className={`flex items-center gap-4 rounded-lg p-3 transition-all ${currentTab === "zones" ? "bg-[#0566d9] text-[#e6ecff] shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : "text-[#bbcabf] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]"}`}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium text-sm">Zone Management</span>
          </button>

          <button
            onClick={() => setCurrentTab("reports")}
            className={`flex items-center gap-4 rounded-lg p-3 transition-all ${currentTab === "reports" ? "bg-[#0566d9] text-[#e6ecff] shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : "text-[#bbcabf] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]"}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium text-sm">Reports</span>
          </button>

          <button
            onClick={() => {
              setResetStep(1);
              setResetError(null);
              setCurrentTab("password-reset");
            }}
            className={`flex items-center gap-4 rounded-lg p-3 transition-all ${currentTab === "password-reset" ? "bg-[#0566d9] text-[#e6ecff] shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : "text-[#bbcabf] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]"}`}
          >
            <Lock className="w-5 h-5" />
            <span className="font-medium text-sm">Password Reset</span>
          </button>
        </div>

        <div className="mt-auto border-t border-[#3c4a42] pt-4 flex flex-col gap-1">
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-4 text-[#bbcabf] hover:text-[#d4e4fa] p-3 hover:bg-[#1c2b3c] rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="font-medium text-sm">Sync Data</span>
          </button>
          <div className="flex items-center gap-4 text-[#bbcabf] p-3 rounded-lg">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium text-sm">v1.0.0</span>
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 h-[64px] left-[260px] bg-[#051424] border-b border-[#3c4a42] z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 bg-[#1c2b3c] px-4 py-1.5 rounded-full border border-[#3c4a42] focus-within:border-[#10b981] transition-all">
            <Search className="text-[#bbcabf] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, Species, Zone..."
              className="bg-transparent border-none focus:outline-none text-[#d4e4fa] placeholder:text-[#bbcabf] w-64 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full hover:bg-[#273647] transition-all flex items-center justify-center text-[#bbcabf]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-[#3c4a42]"></div>
            <div className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-[#273647] transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-[#00422b] font-bold text-sm">
                ER
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#d4e4fa]">
                  Dr. E. Rostova
                </span>
                <span className="text-[10px] text-[#bbcabf]">
                  Lead Biologist
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="mt-[64px] p-8 flex-1 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
          {error && (
            <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-4 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB: DASHBOARD */}
          {currentTab === "dashboard" && (
            <>
              {/* Row 1: KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#273647] flex items-center justify-center border border-[#3c4a42]">
                      <MapPin className="text-[#4edea3] w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs text-[#bbcabf] uppercase tracking-wider">
                      Active GPS Tags
                    </h3>
                    <p className="text-3xl font-bold text-[#d4e4fa] mt-1">
                      {locations.length}
                    </p>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#273647] flex items-center justify-center border border-[#3c4a42]">
                      <Shield className="text-[#adc6ff] w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs text-[#bbcabf] uppercase tracking-wider">
                      Protected Zones
                    </h3>
                    <p className="text-3xl font-bold text-[#d4e4fa] mt-1">
                      {protectedZones.length}
                    </p>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#273647] flex items-center justify-center border border-[#3c4a42]">
                      <Heart className="text-[#ffb95f] w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs text-[#bbcabf] uppercase tracking-wider">
                      Health Exams
                    </h3>
                    <p className="text-3xl font-bold text-[#d4e4fa] mt-1">
                      {healthExams.length}
                    </p>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group border-[#ffb4ab]/30">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#93000a]/20 flex items-center justify-center border border-[#ffb4ab]/30">
                      <AlertTriangle className="text-[#ffb4ab] w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-1 rounded-full">
                      Alerts
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs text-[#ffb4ab] uppercase tracking-wider">
                      Critical Status
                    </h3>
                    <p className="text-3xl font-bold text-[#d4e4fa] mt-1">
                      {
                        healthExams.filter(
                          (e) => e.health_status.toLowerCase() === "critical",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Map & Detail Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                {/* Interactive Map Area */}
                <div className="lg:col-span-8 glass-card rounded-xl overflow-hidden relative border border-[#3c4a42] flex flex-col">
                  <div className="absolute top-4 left-4 z-10 glass-card px-4 py-1.5 rounded-lg flex items-center gap-2">
                    <Navigation className="text-[#4edea3] w-4 h-4" />
                    <span className="text-xs font-semibold text-[#d4e4fa]">
                      Live GPS Tracking Map
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={() => setShowLocationModal(true)}
                      className="bg-[#10b981] text-[#00422b] font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#6ffbbe] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Record GPS Ping
                    </button>
                  </div>

                  {/* Map Background Placeholder */}
                  <div className="flex-1 relative bg-[#010f1f] flex items-center justify-center overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                    {/* Render active locations */}
                    {locations.map((loc, idx) => {
                      // Map lat/lng to simple visual coordinates on screen
                      const x = 50 + ((parseFloat(loc.longitude) * 10) % 40);
                      const y = 50 - ((parseFloat(loc.latitude) * 10) % 40);
                      return (
                        <div
                          key={loc.id || idx}
                          style={{ left: `${x}%`, top: `${y}%` }}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                          onClick={() => {
                            const matchedAnimal = animals.find(
                              (a) => a.gps_tag_id === loc.gps_tag_id,
                            );
                            if (matchedAnimal) setSelectedAnimal(matchedAnimal);
                          }}
                        >
                          <div className="w-4 h-4 bg-[#4edea3] rounded-full emerald-glow pulse-dot border-2 border-[#051424]"></div>
                          <div className="mt-1 glass-card px-2 py-0.5 rounded text-[10px] text-[#4edea3] font-mono border-[#4edea3]/30 whitespace-nowrap">
                            {loc.name || loc.gps_tag_id}
                          </div>
                        </div>
                      );
                    })}

                    {locations.length === 0 && (
                      <div className="text-center text-[#bbcabf] z-10">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-[#bbcabf]/50" />
                        <p>No GPS locations recorded yet.</p>
                        <p className="text-xs mt-1">
                          Click "Record GPS Ping" to add one.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Side Panel (Selected Animal Details) */}
                <div className="lg:col-span-4 glass-card rounded-xl p-6 flex flex-col border border-[#3c4a42] relative overflow-hidden">
                  {selectedAnimal ? (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-[#d4e4fa]">
                              {selectedAnimal.name}
                            </h2>
                            <span className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 px-2 py-0.5 rounded-full text-xs font-mono">
                              {selectedAnimal.species}
                            </span>
                          </div>
                          <p className="text-xs text-[#bbcabf] flex items-center gap-1">
                            <span className="font-mono">
                              Tag: {selectedAnimal.gps_tag_id}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#0d1c2d] p-3 rounded-lg border border-[#3c4a42]/50">
                          <span className="block text-xs text-[#bbcabf] mb-1">
                            Status
                          </span>
                          <div className="flex items-center gap-1.5 text-[#4edea3] text-sm font-semibold">
                            <div className="w-2 h-2 bg-[#4edea3] rounded-full pulse-dot"></div>{" "}
                            Active
                          </div>
                        </div>
                        <div className="bg-[#0d1c2d] p-3 rounded-lg border border-[#3c4a42]/50">
                          <span className="block text-xs text-[#bbcabf] mb-1">
                            Exams Logged
                          </span>
                          <div className="flex items-center gap-1.5 text-[#d4e4fa] text-sm font-semibold">
                            {
                              healthExams.filter(
                                (e) => e.animal_id === selectedAnimal.id,
                              ).length
                            }{" "}
                            Entries
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#010f1f] p-4 rounded-lg border border-[#3c4a42] mb-auto">
                        <span className="font-semibold text-xs text-[#bbcabf] block mb-2">
                          Migration Pattern / History
                        </span>
                        <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                          {migrationPath && migrationPath.length > 0 ? (
                            migrationPath.map((pt, i) => (
                              <div
                                key={i}
                                className="text-xs flex justify-between border-b border-[#3c4a42]/30 pb-1"
                              >
                                <span className="text-[#bbcabf]">
                                  {new Date(pt.timestamp).toLocaleDateString()}
                                </span>
                                <span className="font-mono text-[#4edea3]">
                                  {parseFloat(pt.latitude).toFixed(4)},{" "}
                                  {parseFloat(pt.longitude).toFixed(4)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-[#bbcabf]/60 italic">
                              No migration history recorded for this animal.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-6">
                        <button
                          onClick={() => {
                            setNewExam({
                              ...newExam,
                              animal_id: selectedAnimal.id,
                            });
                            setShowExamModal(true);
                          }}
                          className="w-full bg-[#1c2b3c] text-[#d4e4fa] border border-[#3c4a42] font-semibold py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-[#2c3a4c] transition-colors"
                        >
                          <Heart className="w-4 h-4 text-[#ffb95f]" /> Log
                          Health Exam
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-[#bbcabf]">
                      <Activity className="w-12 h-12 mb-2 text-[#bbcabf]/30" />
                      <p>No animal selected.</p>
                      <button
                        onClick={() => setShowAnimalModal(true)}
                        className="mt-4 bg-[#10b981] text-[#00422b] font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#6ffbbe] transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Register Animal
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Quick Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Health Exams */}
                <div className="lg:col-span-2 glass-card rounded-xl border border-[#3c4a42] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-[#3c4a42] flex justify-between items-center bg-[#0d1c2d]/50">
                    <h3 className="font-bold text-lg text-[#d4e4fa]">
                      Recent Health Exams
                    </h3>
                    <button
                      onClick={() => setCurrentTab("health")}
                      className="text-[#4edea3] text-xs font-semibold hover:text-[#6ffbbe] transition-colors flex items-center gap-1"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#122131] border-b border-[#3c4a42] text-xs text-[#bbcabf]">
                          <th className="py-2 px-4 font-medium">Animal</th>
                          <th className="py-2 px-4 font-medium">Date</th>
                          <th className="py-2 px-4 font-medium">Vet</th>
                          <th className="py-2 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-[#d4e4fa]">
                        {healthExams.slice(0, 4).map((exam, idx) => {
                          const animal = animals.find(
                            (a) => a.id === exam.animal_id,
                          );
                          return (
                            <tr
                              key={exam.id || idx}
                              className="border-b border-[#3c4a42]/30 hover:bg-[#1c2b3c]/50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <span className="font-semibold block">
                                  {animal ? animal.name : "Unknown"}
                                </span>
                                <span className="text-xs text-[#bbcabf]">
                                  {animal ? animal.species : ""}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-xs font-mono text-[#bbcabf]">
                                {exam.examination_date}
                              </td>
                              <td className="py-3 px-4">{exam.veterinarian}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    exam.health_status.toLowerCase() ===
                                    "healthy"
                                      ? "bg-[#10b981]/10 text-[#4edea3] border-[#10b981]/20"
                                      : "bg-[#ffb95f]/10 text-[#ffb95f] border-[#ffb95f]/20"
                                  }`}
                                >
                                  {exam.health_status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {healthExams.length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="py-6 text-center text-[#bbcabf] italic"
                            >
                              No health examinations logged yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Protected Zones */}
                <div className="lg:col-span-1 glass-card rounded-xl border border-[#3c4a42] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-[#3c4a42] flex justify-between items-center bg-[#0d1c2d]/50">
                    <h3 className="font-bold text-lg text-[#d4e4fa]">
                      Protected Zones
                    </h3>
                    <button
                      onClick={() => setCurrentTab("zones")}
                      className="text-[#4edea3] text-xs font-semibold hover:text-[#6ffbbe] transition-colors"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {protectedZones.slice(0, 3).map((zone, idx) => (
                      <div
                        key={zone.id || idx}
                        className="bg-[#0d1c2d] border border-[#3c4a42]/50 p-3 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-semibold text-sm text-[#d4e4fa]">
                            {zone.name}
                          </h4>
                          <p className="text-xs text-[#bbcabf] mt-0.5">
                            {zone.area}
                          </p>
                        </div>
                        <Shield className="text-[#4edea3] w-5 h-5" />
                      </div>
                    ))}
                    {protectedZones.length === 0 && (
                      <p className="text-sm text-[#bbcabf] italic text-center py-4">
                        No protected zones created yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: HEALTH RECORDS */}
          {currentTab === "health" && (
            <div className="glass-card rounded-xl border border-[#3c4a42] p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#d4e4fa]">
                    Health Examination Records
                  </h2>
                  <p className="text-sm text-[#bbcabf]">
                    Log and monitor veterinary checkups for GPS-tagged wildlife.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewExam({ ...newExam, animal_id: animals[0]?.id || "" });
                    setShowExamModal(true);
                  }}
                  className="bg-[#10b981] text-[#00422b] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#6ffbbe] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Log New Examination
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#122131] border-b border-[#3c4a42] text-xs text-[#bbcabf]">
                      <th className="py-3 px-4 font-medium">Animal</th>
                      <th className="py-3 px-4 font-medium">
                        Examination Date
                      </th>
                      <th className="py-3 px-4 font-medium">Veterinarian</th>
                      <th className="py-3 px-4 font-medium">Health Status</th>
                      <th className="py-3 px-4 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#d4e4fa]">
                    {healthExams.map((exam, idx) => {
                      const animal = animals.find(
                        (a) => a.id === exam.animal_id,
                      );
                      return (
                        <tr
                          key={exam.id || idx}
                          className="border-b border-[#3c4a42]/30 hover:bg-[#1c2b3c]/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="font-semibold block">
                              {animal ? animal.name : "Unknown"}
                            </span>
                            <span className="text-xs text-[#bbcabf]">
                              {animal ? animal.species : ""}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-[#bbcabf]">
                            {exam.examination_date}
                          </td>
                          <td className="py-4 px-4">{exam.veterinarian}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                exam.health_status.toLowerCase() === "healthy"
                                  ? "bg-[#10b981]/10 text-[#4edea3] border-[#10b981]/20"
                                  : "bg-[#ffb95f]/10 text-[#ffb95f] border-[#ffb95f]/20"
                              }`}
                            >
                              {exam.health_status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-[#bbcabf] max-w-xs truncate">
                            {exam.notes || "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                    {healthExams.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-[#bbcabf] italic"
                        >
                          No health examinations logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ZONE MANAGEMENT */}
          {currentTab === "zones" && (
            <div className="glass-card rounded-xl border border-[#3c4a42] p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#d4e4fa]">
                    Protected Zone Management
                  </h2>
                  <p className="text-sm text-[#bbcabf]">
                    Define and monitor ecological boundaries and conservation
                    zones.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingZone(null);
                    setNewZone({ name: "", area: "" });
                    setShowZoneModal(true);
                  }}
                  className="bg-[#10b981] text-[#00422b] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#6ffbbe] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create Protected Zone
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {protectedZones.map((zone, idx) => (
                  <div
                    key={zone.id || idx}
                    className="bg-[#0d1c2d] border border-[#3c4a42] rounded-xl p-5 flex flex-col justify-between hover:border-[#10b981]/50 transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] flex items-center justify-center border border-[#3c4a42]">
                          <Shield className="text-[#4edea3] w-5 h-5" />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingZone(zone);
                              setNewZone({ name: zone.name, area: zone.area });
                              setShowZoneModal(true);
                            }}
                            className="p-1.5 hover:bg-[#273647] rounded text-[#bbcabf] hover:text-[#d4e4fa] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteZone(zone.id)}
                            className="p-1.5 hover:bg-[#93000a]/20 rounded text-[#ffb4ab] hover:text-[#ffdad6] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[#d4e4fa] mb-1">
                        {zone.name}
                      </h3>
                      <p className="text-sm text-[#bbcabf] font-mono bg-[#010f1f] p-2.5 rounded border border-[#3c4a42]/50 mt-2">
                        {zone.area}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#3c4a42]/30 flex justify-between text-xs text-[#bbcabf]">
                      <span>
                        Created:{" "}
                        {new Date(zone.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {protectedZones.length === 0 && (
                  <div className="col-span-full text-center py-12 text-[#bbcabf] italic">
                    No protected zones defined yet. Click "Create Protected
                    Zone" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: REPORTS */}
          {currentTab === "reports" && (
            <div className="glass-card rounded-xl border border-[#3c4a42] p-6 max-w-2xl mx-auto text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#10b981]" />
              <h2 className="text-2xl font-bold text-[#d4e4fa] mb-2">
                Conservation Reports
              </h2>
              <p className="text-sm text-[#bbcabf] mb-6">
                Generate a comprehensive summary of active GPS tags, health
                examinations, and protected zones.
              </p>
              <button
                onClick={handleExportReport}
                className="bg-[#10b981] text-[#00422b] font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-[#6ffbbe] transition-colors emerald-glow"
              >
                <FileText className="w-5 h-5" /> Export Conservation Report
                (JSON)
              </button>
            </div>
          )}

          {/* TAB: PASSWORD RESET */}
          {currentTab === "password-reset" && (
            <div className="glass-card rounded-xl border border-[#3c4a42] p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 mx-auto mb-2 text-[#10b981]" />
                <h2 className="text-xl font-bold text-[#d4e4fa]">
                  Secure Password Reset
                </h2>
                <p className="text-xs text-[#bbcabf] mt-1">
                  Follow the multi-factor verification steps to reset your
                  credentials.
                </p>
              </div>

              {resetError && (
                <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-3 rounded-lg text-xs mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {/* Step 1: Initiate */}
              {resetStep === 1 && (
                <form onSubmit={handleResetInitiate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                      Login ID / Username
                    </label>
                    <input
                      type="text"
                      required
                      value={resetForm.login_id}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, login_id: e.target.value })
                      }
                      placeholder="e.g. admin"
                      className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                      Registered Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={resetForm.mobile_number}
                      onChange={(e) =>
                        setResetForm({
                          ...resetForm,
                          mobile_number: e.target.value,
                        })
                      }
                      placeholder="e.g. +1234567890"
                      className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#10b981] text-[#00422b] font-semibold py-2 rounded-lg hover:bg-[#6ffbbe] transition-colors text-sm"
                  >
                    Send OTP Verification
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {resetStep === 2 && (
                <form onSubmit={handleResetVerifyOtp} className="space-y-4">
                  <div className="bg-[#1c2b3c] p-3 rounded-lg border border-[#3c4a42] text-xs text-[#bbcabf] mb-2">
                    <p>
                      OTP Session ID:{" "}
                      <span className="font-mono text-[#d4e4fa]">
                        {resetForm.otp_session_id}
                      </span>
                    </p>
                    <p className="mt-1 text-[#ffb95f]">
                      * For testing, enter any 6-digit code (e.g. 123456)
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={resetForm.otp_code}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, otp_code: e.target.value })
                      }
                      placeholder="123456"
                      className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none font-mono tracking-widest text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#10b981] text-[#00422b] font-semibold py-2 rounded-lg hover:bg-[#6ffbbe] transition-colors text-sm"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              {/* Step 3: Security Question */}
              {resetStep === 3 && (
                <form
                  onSubmit={handleResetVerifySecurityQuestion}
                  className="space-y-4"
                >
                  <div className="bg-[#1c2b3c] p-4 rounded-lg border border-[#3c4a42] mb-2">
                    <span className="block text-[10px] text-[#bbcabf] uppercase tracking-wider mb-1">
                      Security Question
                    </span>
                    <p className="text-sm font-semibold text-[#d4e4fa]">
                      {resetForm.security_question}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      required
                      value={resetForm.answer}
                      onChange={(e) =>
                        setResetForm({ ...resetForm, answer: e.target.value })
                      }
                      placeholder="Enter answer"
                      className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#10b981] text-[#00422b] font-semibold py-2 rounded-lg hover:bg-[#6ffbbe] transition-colors text-sm"
                  >
                    Verify Answer
                  </button>
                </form>
              )}

              {/* Step 4: New Password */}
              {resetStep === 4 && (
                <form
                  onSubmit={handleResetSetNewPassword}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                      Enter New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={resetForm.new_password}
                      onChange={(e) =>
                        setResetForm({
                          ...resetForm,
                          new_password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#10b981] text-[#00422b] font-semibold py-2 rounded-lg hover:bg-[#6ffbbe] transition-colors text-sm"
                  >
                    Set New Password
                  </button>
                </form>
              )}

              {/* Step 5: Success */}
              {resetStep === 5 && (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 mx-auto text-[#10b981]" />
                  <h3 className="text-lg font-bold text-[#d4e4fa]">
                    Password Reset Complete
                  </h3>
                  <p className="text-sm text-[#bbcabf]">
                    Your password has been successfully updated.
                  </p>
                  {resetForm.login_link && (
                    <a
                      href={resetForm.login_link}
                      className="inline-block bg-[#0566d9] text-[#e6ecff] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Go to Login
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: REGISTER ANIMAL */}
      {showAnimalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1c2d] border border-[#3c4a42] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-4">
              Register GPS-Tagged Animal
            </h3>
            <form onSubmit={handleCreateAnimal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Animal Name
                </label>
                <input
                  type="text"
                  required
                  value={newAnimal.name}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, name: e.target.value })
                  }
                  placeholder="e.g. Elara"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Species
                </label>
                <input
                  type="text"
                  required
                  value={newAnimal.species}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, species: e.target.value })
                  }
                  placeholder="e.g. Elephant"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  GPS Tag ID
                </label>
                <input
                  type="text"
                  required
                  value={newAnimal.gps_tag_id}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, gps_tag_id: e.target.value })
                  }
                  placeholder="e.g. GPS-EL-902"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnimalModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#bbcabf] hover:bg-[#1c2b3c] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#10b981] text-[#00422b] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#6ffbbe] transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG HEALTH EXAM */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1c2d] border border-[#3c4a42] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-4">
              Log Health Examination
            </h3>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Select Animal
                </label>
                <select
                  required
                  value={newExam.animal_id}
                  onChange={(e) =>
                    setNewExam({ ...newExam, animal_id: e.target.value })
                  }
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                >
                  <option value="" disabled>
                    -- Select Animal --
                  </option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.species})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Examination Date
                </label>
                <input
                  type="date"
                  required
                  value={newExam.examination_date}
                  onChange={(e) =>
                    setNewExam({ ...newExam, examination_date: e.target.value })
                  }
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Veterinarian
                </label>
                <input
                  type="text"
                  required
                  value={newExam.veterinarian}
                  onChange={(e) =>
                    setNewExam({ ...newExam, veterinarian: e.target.value })
                  }
                  placeholder="Dr. E. Rostova"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Health Status
                </label>
                <select
                  required
                  value={newExam.health_status}
                  onChange={(e) =>
                    setNewExam({ ...newExam, health_status: e.target.value })
                  }
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Observation">Observation</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Notes / Findings
                </label>
                <textarea
                  value={newExam.notes}
                  onChange={(e) =>
                    setNewExam({ ...newExam, notes: e.target.value })
                  }
                  placeholder="Enter clinical notes..."
                  rows="3"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#bbcabf] hover:bg-[#1c2b3c] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#10b981] text-[#00422b] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#6ffbbe] transition-colors"
                >
                  Log Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE/EDIT PROTECTED ZONE */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1c2d] border border-[#3c4a42] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-4">
              {editingZone ? "Edit Protected Zone" : "Create Protected Zone"}
            </h3>
            <form onSubmit={handleCreateOrUpdateZone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  required
                  value={newZone.name}
                  onChange={(e) =>
                    setNewZone({ ...newZone, name: e.target.value })
                  }
                  placeholder="e.g. Serengeti North"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  Area Coordinates / Description
                </label>
                <input
                  type="text"
                  required
                  value={newZone.area}
                  onChange={(e) =>
                    setNewZone({ ...newZone, area: e.target.value })
                  }
                  placeholder="POLYGON((34.8 -1.5, 35.2 -1.5, ...))"
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowZoneModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#bbcabf] hover:bg-[#1c2b3c] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#10b981] text-[#00422b] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#6ffbbe] transition-colors"
                >
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD GPS LOCATION */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1c2d] border border-[#3c4a42] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-4">
              Record GPS Location Ping
            </h3>
            <form onSubmit={handleRecordLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                  GPS Tag ID
                </label>
                <select
                  required
                  value={newLocation.gps_tag_id}
                  onChange={(e) =>
                    setNewLocation({
                      ...newLocation,
                      gps_tag_id: e.target.value,
                    })
                  }
                  className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                >
                  <option value="" disabled>
                    -- Select Tag --
                  </option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.gps_tag_id}>
                      {a.name} ({a.gps_tag_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newLocation.latitude}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    placeholder="-1.2921"
                    className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#bbcabf] mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newLocation.longitude}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    placeholder="36.8219"
                    className="w-full bg-[#1c2b3c] border border-[#3c4a42] rounded-lg px-3 py-2 text-sm text-[#d4e4fa] focus:border-[#10b981] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#bbcabf] hover:bg-[#1c2b3c] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#10b981] text-[#00422b] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#6ffbbe] transition-colors"
                >
                  Record Ping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
