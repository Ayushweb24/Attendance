import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Table from '../components/Table';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { attendanceAPI } from '../services/api';

const MOCK_REPORT = [
  { id: 1, rollNo: 'CS101', name: 'Aarav Sharma', total: 20, present: 18, percentage: 90 },
  { id: 2, rollNo: 'CS102', name: 'Priya Mehta', total: 20, present: 15, percentage: 75 },
  { id: 3, rollNo: 'CS103', name: 'Rohan Das', total: 20, present: 12, percentage: 60 },
  { id: 4, rollNo: 'CS104', name: 'Sneha Rao', total: 20, present: 19, percentage: 95 },
  { id: 5, rollNo: 'CS105', name: 'Vikram Nair', total: 20, present: 10, percentage: 50 },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const now = new Date();

export default function ReportsPage() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    attendanceAPI
      .getReport({ month, year })
      .then((res) => setReport(res.data))
      .catch(() => {
        setReport(MOCK_REPORT);
        setError('Demo mode – showing sample data.');
      })
      .finally(() => setLoading(false));
  }, [month, year]);

  const columns = [
    { key: 'rollNo', label: 'Roll No' },
    { key: 'name', label: 'Name' },
    { key: 'total', label: 'Total Days' },
    { key: 'present', label: 'Present' },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                row.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.percentage}%` }}
            />
          </div>
          <span
            className={`text-xs font-medium w-12 text-right ${
              row.percentage >= 75 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {row.percentage}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {error && <Alert type="warning" message={error} onClose={() => setError(null)} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Attendance Overview — {MONTHS[month - 1]} {year}
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={report} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
                <Bar dataKey="percentage" name="Attendance %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Student-wise Report</h2>
            <Table columns={columns} data={report} emptyMessage="No report data." />
          </div>
        </>
      )}
    </div>
  );
}
