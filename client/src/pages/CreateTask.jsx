import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, ChevronLeft, Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

const categories = [
  'Education',
  'Food distribution',
  'Environment',
  'Elder support',
  'Disaster support',
  'Community service',
];

const CreateTask = () => {
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/tasks', formData);
      if (res.data.success) {
        navigate(`/tasks/${res.data.task._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Link
          to="/tasks"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <ChevronLeft size={18} /> Back to tasks
        </Link>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Create a Community Service Task
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Publish a volunteering opportunity for community members to sign up and assist your NGO.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Weekend Science Mentorship Drive for Kids"
              className="form-input"
              required
            />
          </div>

          {/* Category & Urgency */}
          <div className="grid-2">
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
              <label className="form-label">Urgency Level</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Low">Low - Planned ongoing activity</option>
                <option value="Medium">Medium - Regular volunteer drive</option>
                <option value="High">High - Approaching schedule</option>
                <option value="Urgent">Urgent - Emergency / immediate need</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what the volunteers will do, schedule outline, and any preparation needed..."
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          {/* Location & Remote */}
          <div className="form-group">
            <label className="form-label">Location / Address *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Asha Community Center, 4th Block, Koramangala"
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

          {/* Date, Duration & Volunteers */}
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

          {/* Skills Needed */}
          <div className="form-group">
            <label className="form-label">Skills / Requirements (Comma-separated)</label>
            <input
              type="text"
              name="skillsNeeded"
              value={formData.skillsNeeded}
              onChange={handleChange}
              placeholder="e.g. Teaching, Math, First Aid, Cooking"
              className="form-input"
            />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Separate multiple skills with commas.
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
            <Link to="/tasks" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <PlusCircle size={18} />
              {loading ? 'Creating Task...' : 'Publish Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
