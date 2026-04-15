import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { leavesAPI } from '../services/api';

const MOCK_LEAVES = [
  { id: 1, reason: 'Medical emergency', from: '2026-04-01', to: '2026-04-02', status: 'approved' },
  { id: 2, reason: 'Family function', from: '2026-04-10', to: '2026-04-10', status: 'pending' },
  { id: 3, reason: 'Personal work', from: '2026-03-25', to: '2026-03-25', status: 'rejected' },
];

const STATUS_STYLES = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const today = new Date().toISOString().split('T')[0];

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ reason: '', from: today, to: today });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    leavesAPI
      .getAll()
      .then((res) => setLeaves(res.data))
      .catch(() => {
        setLeaves(MOCK_LEAVES);
        setError('Demo mode – showing sample data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.reason.trim()) errs.reason = 'Reason is required';
    if (!form.from) errs.from = 'From date required';
    if (!form.to) errs.to = 'To date required';
    if (form.from && form.to && form.to < form.from) errs.to = 'To date must be after from date';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    const newLeave = { ...form, id: Date.now(), status: 'pending' };
    await leavesAPI.apply(form).catch(() => {});
    setLeaves((l) => [newLeave, ...l]);
    setForm({ reason: '', from: today, to: today });
    setSuccess('Leave application submitted!');
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormErrors((f) => ({ ...f, [e.target.name]: '' }));
  };

  return (
    <div className="space-y-5">
      {error && <Alert type="warning" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Apply Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Apply for Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                name="reason"
                rows={3}
                value={form.reason}
                onChange={handleChange}
                placeholder="Brief reason for leave…"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  formErrors.reason ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {formErrors.reason && (
                <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.from ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {formErrors.from && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.from}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  name="to"
                  value={form.to}
                  min={form.from}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.to ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {formErrors.to && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.to}</p>
                )}
              </div>
            </div>
            <Button type="submit" variant="primary" loading={submitting} className="w-full">
              Submit Application
            </Button>
          </form>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">My Leave History</h2>
          {loading ? (
            <Loader size="sm" />
          ) : leaves.length === 0 ? (
            <p className="text-sm text-gray-400">No leave applications yet.</p>
          ) : (
            <ul className="space-y-3">
              {leaves.map((l) => (
                <li
                  key={l.id}
                  className="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{l.reason}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {l.from} → {l.to}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      STATUS_STYLES[l.status] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
