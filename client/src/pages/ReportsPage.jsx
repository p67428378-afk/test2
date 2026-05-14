import React, { useState } from 'react';
import { getBestsellersReport, getSlowmoversReport, getProfitabilityReport } from '../services/api';
import Dropdown from '../components/common/Dropdown';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [headers, setHeaders] = useState([]);

  const reportOptions = [
    { value: 'bestsellers', label: 'Best-Selling Items' },
    { value: 'slowmovers', label: 'Slow-Moving Items' },
    { value: 'profitability', label: 'Profitability Report' },
  ];

  const generateReport = async () => {
    try {
      let res;
      let data;
      let reportHeaders;

      switch (reportType) {
        case 'bestsellers':
          res = await getBestsellersReport();
          data = res.data;
          reportHeaders = ['Item ID', 'Name', 'Total Quantity Sold'];
          break;
        case 'slowmovers':
          res = await getSlowmoversReport();
          data = res.data;
          reportHeaders = ['Item ID', 'Name', 'Stock Level', 'Last Sold Date'];
          break;
        case 'profitability':
          res = await getProfitabilityReport();
          data = [res.data]; // Profitability is an object, wrap in array for DataTable
          reportHeaders = ['Total Revenue', 'Total Cost', 'Total Profit'];
          break;
        default:
          return;
      }
      setReportData(data);
      setHeaders(reportHeaders);
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
    }
  };

  const renderRow = (row, index) => {
    if (!row) return null;
    return (
        <tr key={index}>
            {Object.values(row).map((val, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap">{typeof val === 'number' ? val.toFixed(2) : val}</td>
            ))}
        </tr>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      <div className="flex items-center space-x-4 mb-6">
        <Dropdown options={reportOptions} selected={reportType} onSelect={setReportType} placeholder="Select a Report" />
        <Button onClick={generateReport} disabled={!reportType}>Generate Report</Button>
      </div>

      {reportData && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{reportOptions.find(o => o.value === reportType)?.label}</h3>
          <DataTable headers={headers} data={reportData} renderRow={renderRow} />
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
