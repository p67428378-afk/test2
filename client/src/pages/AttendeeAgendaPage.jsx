import React, { useState, useEffect } from "react";
import {
  conferenceApi,
  scheduleApi,
  registrationApi,
  sessionApi,
} from "../services/api";
import {
  Calendar,
  Ticket,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function AttendeeAgendaPage() {
  const [conferences, setConferences] = useState([]);
  const [selectedConfId, setSelectedConfId] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [sessionsMap, setSessionsMap] = useState({});
  const [ticketType, setTicketType] = useState("STANDARD");
  const [userRegistrations, setUserRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadConferences() {
      setLoading(true);
      try {
        const confs = await conferenceApi.listConferences();
        setConferences(confs || []);
        if (confs && confs.length > 0) {
          setSelectedConfId(confs[0].id);
        }

        // Fetch user object from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.id) {
            const regs = await registrationApi.getUserRegistrations(user.id);
            setUserRegistrations(regs || []);
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.detail || "Failed to fetch conference agenda.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadConferences();
  }, []);

  useEffect(() => {
    if (!selectedConfId) return;

    async function loadSchedule() {
      try {
        const schedData =
          await scheduleApi.getConferenceSchedule(selectedConfId);
        setSchedule(schedData || []);

        // Load sessions to map titles and tracks
        const allSessions = await sessionApi.listSessions(selectedConfId);
        const map = {};
        (allSessions || []).forEach((s) => {
          map[s.id] = s;
        });
        setSessionsMap(map);
      } catch (err) {
        setSchedule([]);
      }
    }
    loadSchedule();
  }, [selectedConfId]);

  const handleRegisterPass = async () => {
    if (!selectedConfId) return;
    setError(null);
    setSuccess(null);
    setRegistering(true);

    try {
      const reg = await registrationApi.registerConference({
        conference_id: selectedConfId,
        ticket_type: ticketType,
      });

      setSuccess(
        `Successfully registered pass (${ticketType})! Pass ID: ${reg.id}`,
      );

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const regs = await registrationApi.getUserRegistrations(user.id);
        setUserRegistrations(regs || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please make sure you are signed in.",
      );
    } finally {
      setRegistering(false);
    }
  };

  // Organizer helper: Auto-publish approved sessions into schedule if schedule is empty
  const handlePublishDefaultSchedule = async () => {
    if (!selectedConfId) return;
    setError(null);
    setSuccess(null);
    setPublishing(true);

    try {
      // Find all approved or submitted sessions for this conference
      const allSess = await sessionApi.listSessions(selectedConfId);
      if (!allSess || allSess.length === 0) {
        setError("No sessions available to schedule.");
        setPublishing(false);
        return;
      }

      const slots = allSess.slice(0, 5).map((s, idx) => ({
        session_id: s.id,
        hall_name: `Hall ${String.fromCharCode(65 + idx)}`,
        start_time: `2026-06-10T${String(9 + idx).padStart(2, "0")}:00:00Z`,
        end_time: `2026-06-10T${String(10 + idx).padStart(2, "0")}:00:00Z`,
      }));

      await scheduleApi.publishSchedule({
        conference_id: selectedConfId,
        slots,
      });

      setSuccess("Conference schedule published successfully!");
      const updatedSched =
        await scheduleApi.getConferenceSchedule(selectedConfId);
      setSchedule(updatedSched || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to publish schedule. Organizer role required.",
      );
    } finally {
      setPublishing(false);
    }
  };

  const selectedConf = conferences.find((c) => c.id === selectedConfId);
  const isUserRegistered = userRegistrations.some(
    (r) => r.conference_id === selectedConfId,
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Public Agenda & Pass Registration
        </h1>
        <p className="text-sm text-[#707a8c]">
          Explore published conference schedules and register your entry pass
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Conference Selector */}
      <div className="bg-white p-6 border border-[#e3e8f0] rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#171c29] uppercase">
            Select Conference
          </label>
          <select
            value={selectedConfId}
            onChange={(e) => setSelectedConfId(e.target.value)}
            className="px-4 py-2 border border-[#e3e8f0] rounded-md text-sm font-semibold text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            {conferences.map((conf) => (
              <option key={conf.id} value={conf.id}>
                {conf.title} ({conf.location})
              </option>
            ))}
          </select>
        </div>

        {selectedConf && (
          <div className="flex items-center gap-6 text-xs text-[#707a8c]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2663eb]" />
              <span className="font-medium text-[#171c29]">
                {selectedConf.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#2663eb]" />
              <span className="font-medium text-[#171c29]">
                {selectedConf.start_date} to {selectedConf.end_date}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2663eb]" />
              <span>Session Schedule</span>
            </h2>

            {/* Organizer Quick Publish Schedule Button */}
            <button
              onClick={handlePublishDefaultSchedule}
              disabled={publishing}
              className="text-xs text-blue-600 hover:underline font-semibold disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Organizer: Publish Schedule"}
            </button>
          </div>

          {schedule && schedule.length > 0 ? (
            <div className="space-y-3">
              {schedule.map((item) => {
                const sessionObj = sessionsMap[item.session_id];
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-[#2663eb] text-xs font-mono font-semibold rounded border border-blue-100">
                        {item.hall_name}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(item.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(item.end_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#171c29] text-base">
                      {sessionObj?.title || `Session ID: ${item.session_id}`}
                    </h3>

                    {sessionObj?.track && (
                      <span className="inline-block text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                        Track: {sessionObj.track}
                      </span>
                    )}

                    {sessionObj?.abstract && (
                      <p className="text-xs text-[#707a8c] line-clamp-2 leading-relaxed">
                        {sessionObj.abstract}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-[#707a8c] text-sm">
              Schedule has not been published yet for this conference.
            </div>
          )}
        </div>

        {/* Right: Registration Card */}
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2 border-b pb-3 border-[#e3e8f0]">
            <Ticket className="w-5 h-5 text-[#2663eb]" />
            <span>Attendee Pass Registration</span>
          </h2>

          {isUserRegistered ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm space-y-2 text-center">
              <ShieldCheck className="w-8 h-8 text-green-600 mx-auto" />
              <p className="font-bold">Entry Pass Confirmed!</p>
              <p className="text-xs text-green-700">
                You are registered for this conference.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                  Ticket Type
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                >
                  <option value="STANDARD">Standard Pass (All Sessions)</option>
                  <option value="VIP">
                    VIP All-Access Pass (Incl. Workshops)
                  </option>
                  <option value="STUDENT">Student Discount Pass</option>
                </select>
              </div>

              <button
                onClick={handleRegisterPass}
                disabled={registering}
                className="w-full py-2.5 bg-[#17a34a] text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {registering ? "Registering..." : "Register Entry Pass"}
              </button>
            </div>
          )}

          {/* User's Passes */}
          {userRegistrations.length > 0 && (
            <div className="pt-4 border-t border-[#e3e8f0] space-y-3">
              <h3 className="text-xs font-bold text-[#171c29] uppercase tracking-wider">
                Your Passes
              </h3>
              <div className="space-y-2">
                {userRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-[#171c29] block">
                        {reg.ticket_type}
                      </span>
                      <span className="text-gray-500 font-mono text-[10px]">
                        ID: {reg.id.slice(0, 8)}...
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 font-semibold rounded text-[10px]">
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
