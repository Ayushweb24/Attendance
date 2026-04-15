import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { dashboardAPI } from '../services/api';

// Fallback mock data when backend is unavailable
const MOCK_SUMMARY = {
  totalStudents: 120,
  present: 98,
  absent: 22,
  attendanceRate: 81.7,
  notifications: [
    { id: 1, text: 'Attendance submitted for today' },
    { id: 2, text: 'Leave request from Ravi Kumar pending' },
    { id: 3, text: 'Monthly report available' },
  ],
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardAPI
      .getSummary()
      .then((res) => setSummary(res.data))
      .catch(() => {
        setSummary(MOCK_SUMMARY);
        setError('Could not reach server – showing demo data.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const s = summary;
  const absPercent = s.totalStudents
    ? ((s.absent / s.totalStudents) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {error && <Alert type="warning" message={error} onClose={() => setError(null)} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Students"
          value={s.totalStudents}
          icon="👥"
          color="blue"
          subtitle="Enrolled this semester"
        />
        <Card
          title="Present Today"
          value={s.present}
          icon="✅"
          color="green"
          subtitle={`${((s.present / s.totalStudents) * 100).toFixed(1)}% attendance`}
        />
        <Card
          title="Absent Today"
          value={s.absent}
          icon="❌"
          color="red"
          subtitle={`${absPercent}% absent`}
        />
        <Card
          title="Attendance Rate"
          value={`${s.attendanceRate}%`}
          icon="📊"
          color="purple"
          subtitle="Overall this month"
        />
      </div>

      {/* Date + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Today&apos;s Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Attendance Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {((s.present / s.totalStudents) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(s.present / s.totalStudents) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{s.present} present</span>
              <span>{s.absent} absent</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Notifications</h2>
          {s.notifications?.length ? (
            <ul className="space-y-2">
              {s.notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-2 text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0"
                >
                  <span className="text-blue-400 mt-0.5">•</span>
                  {n.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}
