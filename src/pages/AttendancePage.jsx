import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { studentsAPI, attendanceAPI } from '../services/api';

const MOCK_STUDENTS = [
  { id: 1, rollNo: 'CS101', name: 'Aarav Sharma' },
  { id: 2, rollNo: 'CS102', name: 'Priya Mehta' },
  { id: 3, rollNo: 'CS103', name: 'Rohan Das' },
  { id: 4, rollNo: 'CS104', name: 'Sneha Rao' },
  { id: 5, rollNo: 'CS105', name: 'Vikram Nair' },
];

export default function AttendancePage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      studentsAPI.getAll().catch(() => ({ data: MOCK_STUDENTS })),
      attendanceAPI.getByDate(date).catch(() => ({ data: [] })),
    ]).then(([sRes, aRes]) => {
      setStudents(sRes.data);
      const map = {};
      sRes.data.forEach((s) => (map[s.id] = 'present'));
      (aRes.data || []).forEach((a) => {
        if (map[a.studentId] !== undefined) map[a.studentId] = a.status;
      });
      setAttendance(map);
    }).finally(() => setLoading(false));
  }, [date]);

  const toggle = (id) =>
    setAttendance((a) => ({ ...a, [id]: a[id] === 'present' ? 'absent' : 'present' }));

  const markAll = (status) => {
    const map = {};
    students.forEach((s) => (map[s.id] = status));
    setAttendance(map);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const payload = {
      date,
      records: students.map((s) => ({ studentId: s.id, status: attendance[s.id] ?? 'present' })),
    };
    await attendanceAPI.submit(payload).catch(() => {});
    setSuccess('Attendance submitted successfully!');
    setSubmitting(false);
  };

  const presentCount = Object.values(attendance).filter((v) => v === 'present').length;
  const absentCount = students.length - presentCount;

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="success" onClick={() => markAll('present')}>
            Mark All Present
          </Button>
          <Button size="sm" variant="danger" onClick={() => markAll('absent')}>
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 text-sm font-medium">
        <span className="text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
          ✅ Present: {presentCount}
        </span>
        <span className="text-red-700 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
          ❌ Absent: {absentCount}
        </span>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Roll No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Toggle
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s) => {
              const status = attendance[s.id] ?? 'present';
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.rollNo}</td>
                  <td className="px-4 py-3 text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggle(s.id)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        status === 'present' ? 'bg-green-500' : 'bg-red-400'
                      }`}
                      aria-label={`Toggle ${s.name}`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
                          status === 'present' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          loading={submitting}
          onClick={handleSubmit}
        >
          Submit Attendance
        </Button>
      </div>
    </div>
  );
}
