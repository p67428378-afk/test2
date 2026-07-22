import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hiveService } from "../services/api";
import SensorGrid from "../components/hives/SensorGrid";
import TelemetryCharts from "../components/hives/TelemetryCharts";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import Badge from "../components/common/Badge";

export default function HiveDetailPage() {
  const { hiveId } = useParams();
  const [hive, setHive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [temp, setTemp] = useState("");
  const [hum, setHum] = useState("");

  const [showProdModal, setShowProdModal] = useState(false);
  const [prodDate, setProdDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [prodQty, setProdQty] = useState("");

  const [showPopModal, setShowPopModal] = useState(false);
  const [popDate, setPopDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [popEst, setPopPop] = useState("");

  const [showInspectModal, setShowInspectModal] = useState(false);
  const [inspectDate, setInspectDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [inspector, setInspector] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [inspectNotes, setInspectNotes] = useState("");

  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [diseaseDate, setDiseaseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("low");
  const [observations, setObservations] = useState("");

  const fetchHiveDetail = async () => {
    try {
      const data = await hiveService.getHiveDetail(hiveId);
      setHive(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load hive details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHiveDetail();
  }, [hiveId]);

  const handlePostSensor = async (e) => {
    e.preventDefault();
    try {
      await hiveService.postSensorData(hiveId, {
        temperature: parseFloat(temp),
        humidity: parseFloat(hum),
        timestamp: new Date().toISOString(),
      });
      setShowSensorModal(false);
      setTemp("");
      setHum("");
      fetchHiveDetail();
    } catch (err) {
      console.error(err);
      setError("Failed to post sensor data.");
    }
  };

  const handleCreateProdLog = async (e) => {
    e.preventDefault();
    try {
      await hiveService.createProductionLog(hiveId, {
        date: prodDate,
        quantity_kg: parseFloat(prodQty),
      });
      setShowProdModal(false);
      setProdQty("");
      fetchHiveDetail();
    } catch (err) {
      console.error(err);
      setError("Failed to log production.");
    }
  };

  const handleCreatePopLog = async (e) => {
    e.preventDefault();
    try {
      await hiveService.createPopulationLog(hiveId, {
        date: popDate,
        estimated_population: parseInt(popEst),
      });
      setShowPopModal(false);
      setPopPop("");
      fetchHiveDetail();
    } catch (err) {
      console.error(err);
      setError("Failed to log population.");
    }
  };

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    try {
      await hiveService.createInspection(hiveId, {
        inspection_date: inspectDate,
        inspector,
        focus_area: focusArea,
        notes: inspectNotes,
      });
      setShowInspectModal(false);
      setInspector("");
      setFocusArea("");
      setInspectNotes("");
      fetchHiveDetail();
    } catch (err) {
      console.error(err);
      setError("Failed to schedule inspection.");
    }
  };

  const handleCreateDiseaseReport = async (e) => {
    e.preventDefault();
    try {
      await hiveService.createDiseaseReport(hiveId, {
        report_date: diseaseDate,
        symptoms,
        severity,
        observations,
        status: "pending",
      });
      setShowDiseaseModal(false);
      setSymptoms("");
      setObservations("");
      fetchHiveDetail();
    } catch (err) {
      console.error(err);
      setError("Failed to submit disease report.");
    }
  };

  if (loading)
    return (
      <div className="p-lg text-center text-on-surface-variant">
        Loading hive details...
      </div>
    );
  if (!hive)
    return <div className="p-lg text-center text-error">Hive not found.</div>;

  return (
    <div className="flex flex-col gap-lg">
      <header className="flex justify-between items-center">
        <div>
          <Link
            to="/"
            className="text-primary hover:underline font-label-md text-label-md flex items-center gap-1 mb-xs"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>{" "}
            Back to Dashboard
          </Link>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            {hive.name}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {hive.location} • Status:{" "}
            <Badge variant={hive.status === "healthy" ? "success" : "danger"}>
              {hive.status}
            </Badge>
          </p>
        </div>
        <div className="flex gap-sm flex-wrap">
          <Button onClick={() => setShowSensorModal(true)} variant="secondary">
            Log Sensor Data
          </Button>
          <Button onClick={() => setShowProdModal(true)} variant="secondary">
            Log Honey
          </Button>
          <Button onClick={() => setShowPopModal(true)} variant="secondary">
            Log Population
          </Button>
          <Button onClick={() => setShowInspectModal(true)}>
            Schedule Inspection
          </Button>
          <Button onClick={() => setShowDiseaseModal(true)} variant="danger">
            Report Disease
          </Button>
        </div>
      </header>

      {error && (
        <div className="p-md rounded-lg bg-error/10 text-error border border-error/20">
          {error}
        </div>
      )}

      {/* Sensor Grid */}
      <SensorGrid hive={hive} />

      {/* Telemetry Charts */}
      <TelemetryCharts sensorHistory={hive.sensor_history_24h} />

      {/* Logs and Schedules */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg">
        {/* Honey Production Logs */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              water_drop
            </span>
            Honey Production Logs
          </h3>
          {hive.production_logs?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-[12px] uppercase">
                    <th className="py-sm">Date</th>
                    <th className="py-sm text-right">Quantity (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-body-md">
                  {hive.production_logs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-sm">{log.date}</td>
                      <td className="py-sm text-right font-mono-data">
                        {log.quantity_kg} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-on-surface-variant text-center py-md">
              No production logs yet.
            </p>
          )}
        </div>

        {/* Bee Population Logs */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary-container">
              hive
            </span>
            Bee Population Logs
          </h3>
          {hive.population_logs?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-[12px] uppercase">
                    <th className="py-sm">Date</th>
                    <th className="py-sm text-right">Est. Population</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-body-md">
                  {hive.population_logs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-sm">{log.date}</td>
                      <td className="py-sm text-right font-mono-data">
                        {(log.estimated_population / 1000).toFixed(0)}k
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-on-surface-variant text-center py-md">
              No population logs yet.
            </p>
          )}
        </div>

        {/* Upcoming Inspections */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              fact_check
            </span>
            Upcoming Inspections
          </h3>
          {hive.inspections?.length > 0 ? (
            <div className="flex flex-col gap-md">
              {hive.inspections.map((inspect) => (
                <div
                  key={inspect.id}
                  className="bg-surface p-md rounded-lg border border-outline-variant flex flex-col gap-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-on-surface">
                      {inspect.inspection_date}
                    </span>
                    <Badge variant="info">
                      {inspect.focus_area || "General"}
                    </Badge>
                  </div>
                  <span className="text-on-surface-variant text-[12px]">
                    Inspector: {inspect.inspector || "N/A"}
                  </span>
                  {inspect.notes && (
                    <p className="text-on-surface-variant mt-sm text-body-md">
                      {inspect.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant text-center py-md">
              No inspections scheduled.
            </p>
          )}
        </div>

        {/* Disease Reports */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-error">
              bug_report
            </span>
            Disease Reports
          </h3>
          {hive.disease_reports?.length > 0 ? (
            <div className="flex flex-col gap-md">
              {hive.disease_reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-surface p-md rounded-lg border border-error/20 bg-error/5 flex flex-col gap-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-error">
                      {report.report_date}
                    </span>
                    <Badge variant="danger">{report.severity || "Low"}</Badge>
                  </div>
                  <span className="text-on-surface-variant text-[12px]">
                    Symptoms: {report.symptoms || "N/A"}
                  </span>
                  {report.observations && (
                    <p className="text-on-surface-variant mt-sm text-body-md">
                      {report.observations}
                    </p>
                  )}
                  <div className="mt-sm flex justify-between items-center">
                    <span className="text-[10px] text-outline uppercase">
                      Status
                    </span>
                    <Badge variant="warning">{report.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant text-center py-md">
              No disease reports submitted.
            </p>
          )}
        </div>
      </div>

      {/* Log Sensor Data Modal */}
      {showSensorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-md">
          <div className="bg-surface-container p-lg rounded-xl border border-outline-variant w-full max-w-md flex flex-col gap-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">
                Log Sensor Data
              </h3>
              <button
                onClick={() => setShowSensorModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handlePostSensor} className="flex flex-col gap-md">
              <InputField
                label="Temperature (°C)"
                id="temp"
                type="number"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                required
              />
              <InputField
                label="Humidity (%)"
                id="hum"
                type="number"
                value={hum}
                onChange={(e) => setHum(e.target.value)}
                required
              />
              <div className="flex gap-md mt-md">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowSensorModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Honey Modal */}
      {showProdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-md">
          <div className="bg-surface-container p-lg rounded-xl border border-outline-variant w-full max-w-md flex flex-col gap-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">
                Log Honey Production
              </h3>
              <button
                onClick={() => setShowProdModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleCreateProdLog}
              className="flex flex-col gap-md"
            >
              <InputField
                label="Date"
                id="prodDate"
                type="date"
                value={prodDate}
                onChange={(e) => setProdDate(e.target.value)}
                required
              />
              <InputField
                label="Quantity (kg)"
                id="prodQty"
                type="number"
                value={prodQty}
                onChange={(e) => setProdQty(e.target.value)}
                required
              />
              <div className="flex gap-md mt-md">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowProdModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Population Modal */}
      {showPopModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-md">
          <div className="bg-surface-container p-lg rounded-xl border border-outline-variant w-full max-w-md flex flex-col gap-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">
                Log Bee Population
              </h3>
              <button
                onClick={() => setShowPopModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleCreatePopLog}
              className="flex flex-col gap-md"
            >
              <InputField
                label="Date"
                id="popDate"
                type="date"
                value={popDate}
                onChange={(e) => setPopDate(e.target.value)}
                required
              />
              <InputField
                label="Estimated Population"
                id="popEst"
                type="number"
                value={popEst}
                onChange={(e) => setPopEst(e.target.value)}
                required
              />
              <div className="flex gap-md mt-md">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPopModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {showInspectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-md">
          <div className="bg-surface-container p-lg rounded-xl border border-outline-variant w-full max-w-md flex flex-col gap-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">
                Schedule Inspection
              </h3>
              <button
                onClick={() => setShowInspectModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleCreateInspection}
              className="flex flex-col gap-md"
            >
              <InputField
                label="Inspection Date"
                id="inspectDate"
                type="date"
                value={inspectDate}
                onChange={(e) => setInspectDate(e.target.value)}
                required
              />
              <InputField
                label="Inspector"
                id="inspector"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                required
              />
              <InputField
                label="Focus Area"
                id="focusArea"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                required
              />
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="inspectNotes"
                  className="font-label-md text-label-md text-on-surface-variant"
                >
                  Notes
                </label>
                <textarea
                  id="inspectNotes"
                  value={inspectNotes}
                  onChange={(e) => setInspectNotes(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  rows="3"
                />
              </div>
              <div className="flex gap-md mt-md">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowInspectModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Disease Modal */}
      {showDiseaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-md">
          <div className="bg-surface-container p-lg rounded-xl border border-outline-variant w-full max-w-md flex flex-col gap-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-error">
                Report Potential Disease
              </h3>
              <button
                onClick={() => setShowDiseaseModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleCreateDiseaseReport}
              className="flex flex-col gap-md"
            >
              <InputField
                label="Report Date"
                id="diseaseDate"
                type="date"
                value={diseaseDate}
                onChange={(e) => setDiseaseDate(e.target.value)}
                required
              />
              <InputField
                label="Symptoms"
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="severity"
                  className="font-label-md text-label-md text-on-surface-variant"
                >
                  Severity
                </label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="observations"
                  className="font-label-md text-label-md text-on-surface-variant"
                >
                  Observations
                </label>
                <textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  rows="3"
                />
              </div>
              <div className="flex gap-md mt-md">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDiseaseModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="danger" className="flex-1">
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
