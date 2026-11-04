import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Sparkles, Clock, Award, CheckCircle, Save, Building2 } from 'lucide-react';

const Profile = () => {
  const { user, isNGO, isVolunteer, updateUserState } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    interests: '',
    organizationName: '',
    mission: '',
    website: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        interests: user.interests ? user.interests.join(', ') : '',
        organizationName: user.organizationName || '',
        mission: user.mission || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.put('/auth/update-profile', formData);
      if (res.data.success) {
        updateUserState(res.data.user);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update profile.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Profile Header */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: isNGO ? '#dbeafe' : '#ccfbf1',
            color: isNGO ? '#0284c7' : '#0d9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {user?.name}
              </h1>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: isNGO ? '#0284c7' : '#0d9488',
                color: '#ffffff',
              }}>
                {user?.role}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              {user?.email} • {user?.location || 'Community Region'}
            </p>
          </div>

          {isVolunteer && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              padding: '12px 18px',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', display: 'block' }}>
                Badge Tier
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>
                {user?.badge || 'Starter Samaritan'}
              </span>
            </div>
          )}
        </div>

        {/* Volunteer Stats */}
        {isVolunteer && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Points Earned</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                {user?.points || 0}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Hours Served</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>
                {user?.hoursContributed || 0} hrs
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed Tasks</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                {user?.completedTasksCount || 0}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
          Edit Profile Information
        </h2>

        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location / City</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {isNGO ? (
            <>
              <div className="form-group">
                <label className="form-label">NGO Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mission Statement</label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourorganization.org"
                  className="form-input"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Teaching, First Aid, Cooking"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share a few words about your volunteer motivation..."
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
