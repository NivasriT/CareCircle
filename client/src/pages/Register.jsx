import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Building2, UserPlus, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('volunteer'); // 'volunteer' or 'ngo'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    organizationName: '',
    registrationNumber: '',
    mission: '',
    skills: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      role,
    };

    const res = await register(payload);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '560px', margin: '30px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 12px',
          }}>
            <Heart size={24} fill="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Join the CareCircle Network
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            Empower communities as a volunteer or register your NGO initiative
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          backgroundColor: '#f1f5f9',
          padding: '6px',
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: role === 'volunteer' ? '#ffffff' : 'transparent',
              color: role === 'volunteer' ? '#0284c7' : '#64748b',
              boxShadow: role === 'volunteer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <User size={16} /> Volunteer
          </button>

          <button
            type="button"
            onClick={() => setRole('ngo')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: role === 'ngo' ? '#ffffff' : 'transparent',
              color: role === 'ngo' ? '#0d9488' : '#64748b',
              boxShadow: role === 'ngo' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Building2 size={16} /> NGO Organization
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name & Email */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{role === 'ngo' ? 'Representative Name *' : 'Full Name *'}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={role === 'ngo' ? 'Dr. Aruna Sundaram' : 'Nivasri T'}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.org"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Password & Phone */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                minLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="form-input"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">City / Region *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore, Karnataka"
              className="form-input"
              required
            />
          </div>

          {/* NGO Specific Fields */}
          {role === 'ngo' && (
            <>
              <div className="form-group">
                <label className="form-label">NGO / Organization Name *</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Asha Community Foundation"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">NGO Registration / Trust Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. NGO-KA-2018-8871"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mission Statement</label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  placeholder="Briefly state your primary community goals, causes, and target beneficiaries..."
                  className="form-textarea"
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Volunteer Specific Fields */}
          {role === 'volunteer' && (
            <>
              <div className="form-group">
                <label className="form-label">Skills & Interests (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Teaching, Cooking, First Aid, Gardening"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">About You / Volunteer Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="What inspires you to volunteer with community non-profits?"
                  className="form-textarea"
                  rows={2}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <UserPlus size={17} />
            {loading ? 'Registering...' : `Complete ${role === 'ngo' ? 'NGO' : 'Volunteer'} Registration`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
