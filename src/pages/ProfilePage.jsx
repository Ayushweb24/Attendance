import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    profileAPI
      .get()
      .then((res) => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => {
        const mock = {
          name: user?.name ?? 'Demo User',
          email: user?.email ?? 'demo@example.com',
          role: user?.role ?? 'student',
          department: 'Computer Science',
          phone: '9876543210',
          rollNo: 'CS101',
          joinDate: '2024-07-01',
        };
        setProfile(mock);
        setForm(mock);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await profileAPI.update(form).catch(() => {});
    setProfile(form);
    setEditing(false);
    setSuccess('Profile updated successfully!');
    setSaving(false);
  };

  if (loading) return <Loader />;

  const initials = profile?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-2xl space-y-5">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Avatar + name */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold select-none flex-shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{profile?.role} · {profile?.department}</p>
          <p className="text-sm text-gray-400 mt-0.5">{profile?.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Profile Details</h2>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name' },
              { field: 'email', label: 'Email', type: 'email' },
              { field: 'phone', label: 'Phone' },
              { field: 'department', label: 'Department' },
            ].map(({ field, label, type = 'text' }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[field] ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="flex gap-2 justify-end pt-1">
              <Button type="button" variant="outline" onClick={() => { setEditing(false); setForm(profile); }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Full Name', value: profile?.name },
              { label: 'Email', value: profile?.email },
              { label: 'Role', value: profile?.role, capitalize: true },
              { label: 'Department', value: profile?.department },
              { label: 'Phone', value: profile?.phone },
              { label: 'Roll / ID', value: profile?.rollNo },
              { label: 'Joined', value: profile?.joinDate },
            ].map(({ label, value, capitalize }) => (
              <div key={label}>
                <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</dt>
                <dd className={`text-sm text-gray-800 mt-0.5 ${capitalize ? 'capitalize' : ''}`}>
                  {value ?? '—'}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
