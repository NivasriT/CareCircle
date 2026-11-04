import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Save, ChevronLeft } from 'lucide-react';

const categories = [
  'Education',
  'Food distribution',
  'Environment',
  'Elder support',
  'Disaster support',
  'Community service',
];

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    location: '',
    isRemote: false,
    date: '',
    durationHours: 3,
    urgency: 'Medium',
    requiredVolunteers: 5,
    skillsNeeded: '',
    status: 'Open',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        if (res.data.success) {
          const t = res.data.task;
          setFormData({
            title: t.title,
            description: t.description,
            category: t.category,
            location: t.location,
            isRemote: t.isRemote,
            date: t.date ? new Date(t.date).toISOString().split('T')[0] : '',
            durationHours: t.durationHours || 3,
            urgency: t.urgency || 'Medium',
            requiredVolunteers: t.requiredVolunteers || 5,
            skillsNeeded: t.skillsNeeded ? t.skillsNeeded.join(', ') : '',
            status: t.status || 'Open',
          });
        }
      } catch (err) {
        setError('Failed to load task details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.put(`/tasks/${id}`, formData);
      if (res.data.success) {
        navigate(`/tasks/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: '#64748b' }}>Loading task...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Link
          to={`/tasks/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <ChevronLeft size={18} /> Cancel and return to task
        </Link>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Edit Community Task
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Update task details, schedule, or current status.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              required
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.88rem', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
              />
              This task is online / can be performed remotely
            </label>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Hours) *</label>
              <input
                type="number"
                min="1"
                max="24"
                name="durationHours"
                value={formData.durationHours}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Volunteers Needed *</label>
              <input
                type="number"
                min="1"
                max="100"
                name="requiredVolunteers"
                value={formData.requiredVolunteers}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills / Requirements (Comma-separated)</label>
            <input
              type="text"
              name="skillsNeeded"
              value={formData.skillsNeeded}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
            <Link to={`/tasks/${id}`} className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={18} />
              {saving ? 'Saving...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
