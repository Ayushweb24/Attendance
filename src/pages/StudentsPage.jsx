import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { studentsAPI } from '../services/api';

const MOCK_STUDENTS = [
  { id: 1, rollNo: 'CS101', name: 'Aarav Sharma', email: 'aarav@example.com', class: 'CS-A', phone: '9876543210' },
  { id: 2, rollNo: 'CS102', name: 'Priya Mehta', email: 'priya@example.com', class: 'CS-A', phone: '9876543211' },
  { id: 3, rollNo: 'CS103', name: 'Rohan Das', email: 'rohan@example.com', class: 'CS-B', phone: '9876543212' },
  { id: 4, rollNo: 'CS104', name: 'Sneha Rao', email: 'sneha@example.com', class: 'CS-B', phone: '9876543213' },
  { id: 5, rollNo: 'CS105', name: 'Vikram Nair', email: 'vikram@example.com', class: 'CS-C', phone: '9876543214' },
];

const EMPTY_FORM = { rollNo: '', name: '', email: '', class: '', phone: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });

  const loadStudents = () => {
    setLoading(true);
    studentsAPI
      .getAll()
      .then((res) => setStudents(res.data))
      .catch(() => {
        setStudents(MOCK_STUDENTS);
        setError('Demo mode – showing sample data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadStudents, []);

  const openAdd = () => setModal({ open: true, mode: 'add', data: { ...EMPTY_FORM } });
  const openEdit = (row) => setModal({ open: true, mode: 'edit', data: { ...row } });
  const closeModal = () => setModal({ open: false, mode: 'add', data: null });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const res = await studentsAPI.create(modal.data).catch(() => {
          // mock
          const newS = { ...modal.data, id: Date.now() };
          setStudents((s) => [...s, newS]);
          return null;
        });
        if (res) setStudents((s) => [...s, res.data]);
      } else {
        const res = await studentsAPI.update(modal.data.id, modal.data).catch(() => {
          setStudents((s) => s.map((x) => (x.id === modal.data.id ? modal.data : x)));
          return null;
        });
        if (res) setStudents((s) => s.map((x) => (x.id === modal.data.id ? res.data : x)));
      }
      setSuccess(modal.mode === 'add' ? 'Student added successfully.' : 'Student updated.');
      closeModal();
    } catch {
      setError('Failed to save student.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await studentsAPI.delete(id).catch(() => {});
    setStudents((s) => s.filter((x) => x.id !== id));
    setSuccess('Student deleted.');
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.class?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'rollNo', label: 'Roll No' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'class', label: 'Class' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Del
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {error && <Alert type="warning" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by name, roll no or class…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button variant="primary" onClick={openAdd}>
          + Add Student
        </Button>
      </div>

      {loading ? <Loader /> : <Table columns={columns} data={filtered} emptyMessage="No students found." />}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.mode === 'add' ? 'Add Student' : 'Edit Student'}
      >
        <form onSubmit={handleSave} className="space-y-3">
          {['rollNo', 'name', 'email', 'class', 'phone'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === 'rollNo' ? 'Roll No' : field}
              </label>
              <input
                required={field !== 'phone'}
                type={field === 'email' ? 'email' : 'text'}
                value={modal.data?.[field] ?? ''}
                onChange={(e) =>
                  setModal((m) => ({ ...m, data: { ...m.data, [field]: e.target.value } }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {modal.mode === 'add' ? 'Add Student' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
