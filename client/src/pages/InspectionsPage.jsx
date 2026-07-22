import React, { useEffect, useState } from "react";
import { hiveService } from "../services/api";
import Badge from "../components/common/Badge";

export default function InspectionsPage() {
  const [hives, setHives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllData = async () => {
    try {
      const hivesData = await hiveService.getHives();
      // Fetch details for each hive to get inspections and disease reports
      const detailedHives = await Promise.all(
        hivesData.map(async (h) => {
          try {
            return await hiveService.getHiveDetail(h.id);
          } catch {
            return h;
          }
        }),
      );
      setHives(detailedHives);
    } catch (err) {
      console.error(err);
      setError("Failed to load inspections and disease reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Aggregate inspections and disease reports
  const allInspections = hives
    .flatMap((h) =>
      (h.inspections || []).map((i) => ({ ...i, hiveName: h.name })),
    )
    .sort((a, b) => new Date(b.inspection_date) - new Date(a.inspection_date));

  const allDiseaseReports = hives
    .flatMap((h) =>
      (h.disease_reports || []).map((r) => ({ ...r, hiveName: h.name })),
    )
    .sort((a, b) => new Date(b.report_date) - new Date(a.report_date));

  return (
    <div className="flex flex-col gap-lg">
      <header>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Inspections & Disease Reports
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Track upcoming hive inspections and log potential health issues.
        </p>
      </header>

      {error && (
        <div className="p-md rounded-lg bg-error/10 text-error border border-error/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-lg text-on-surface-variant">
          Loading data...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg">
          {/* Inspections Section */}
          <div className="bg-surface-container rounded-xl border border-outline-variant p-lg flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">
                fact_check
              </span>
              All Scheduled Inspections
            </h3>
            {allInspections.length > 0 ? (
              <div className="flex flex-col gap-md">
                {allInspections.map((inspect) => (
                  <div
                    key={inspect.id}
                    className="bg-surface p-md rounded-lg border border-outline-variant flex flex-col gap-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-on-surface">
                        {inspect.hiveName}
                      </span>
                      <Badge variant="info">
                        {inspect.focus_area || "General"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-[12px] text-on-surface-variant">
                      <span>Date: {inspect.inspection_date}</span>
                      <span>Inspector: {inspect.inspector || "N/A"}</span>
                    </div>
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

          {/* Disease Reports Section */}
          <div className="bg-surface-container rounded-xl border border-outline-variant p-lg flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-error">
                bug_report
              </span>
              All Disease Reports
            </h3>
            {allDiseaseReports.length > 0 ? (
              <div className="flex flex-col gap-md">
                {allDiseaseReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-surface p-md rounded-lg border border-error/20 bg-error/5 flex flex-col gap-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-error">
                        {report.hiveName}
                      </span>
                      <Badge variant="danger">{report.severity || "Low"}</Badge>
                    </div>
                    <div className="flex justify-between text-[12px] text-on-surface-variant">
                      <span>Date: {report.report_date}</span>
                      <span>Symptoms: {report.symptoms || "N/A"}</span>
                    </div>
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
      )}
    </div>
  );
}
