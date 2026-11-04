import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Edit,
  Trash2,
  Sparkles,
  Award,
  Globe,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isNGO, isVolunteer } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Completed');
  const [peopleHelped, setPeopleHelped] = useState(50);
  const [impactNotes, setImpactNotes] = useState('');

  const fetchTaskDetails = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (err) {
      setMessage({ text: 'Failed to load task details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const isOwner =
    task &&
    user &&
    (task.createdBy?._id === user._id || task.createdBy?._id === user.id || user.role === 'admin');

  const myApplication =
    task?.applicants?.find(
      (app) => (app.user?._id || app.user) === (user?._id || user?.id)
    );

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post(`/tasks/${id}/apply`);
      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setMessage({ text: res.data.message, type: 'success' });
        await fetchTaskDetails();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to apply for task.',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw from this task?')) return;

    setActionLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post(`/tasks/${id}/withdraw`);
      if (res.data.success) {
        setMessage({ text: 'You have withdrawn from this task.', type: 'info' });
        await fetchTaskDetails();
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to withdraw.',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.data.success) {
        navigate('/tasks');
      }
    } catch (err) {
      setMessage({ text: 'Failed to delete task.', type: 'error' });
    }
  };

  const handleUpdateStatus = async (statusToSet) => {
    if (statusToSet === 'Completed') {
      setShowStatusModal(true);
      return;
    }

    try {
      const res = await api.patch(`/tasks/${id}/status`, { status: statusToSet });
      if (res.data.success) {
        setMessage({ text: res.data.message, type: 'success' });
        await fetchTaskDetails();
      }
    } catch (err) {
      setMessage({ text: 'Failed to update status.', type: 'error' });
    }
  };

  const handleCompleteTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/tasks/${id}/status`, {
        status: 'Completed',
        peopleHelped,
        impactNotes,
      });
      if (res.data.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
        setMessage({ text: 'Task completed! Volunteers rewarded with points and hours.', type: 'success' });
        setShowStatusModal(false);
        await fetchTaskDetails();
      }
    } catch (err) {
      setMessage({ text: 'Failed to complete task.', type: 'error' });
    }
  };

  const handleUpdateApplicantStatus = async (volunteerId, status) => {
    try {
      const res = await api.patch(`/tasks/${id}/applicants/${volunteerId}`, { status });
      if (res.data.success) {
        setMessage({ text: res.data.message, type: 'success' });
        await fetchTaskDetails();
      }
    } catch (err) {
      setMessage({ text: 'Failed to update volunteer status.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: '#64748b' }}>Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>Task not found</h2>
        <Link to="/tasks" className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Back to Tasks
        </Link>
      </div>
    );
  }

  const assignedCount =
    task.applicants?.filter((a) => a.status === 'assigned' || a.status === 'completed').length || 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back link */}
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
          <ChevronLeft size={18} /> Back to all tasks
        </Link>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Main Task Header Card */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-community" style={{ fontSize: '0.86rem', padding: '6px 14px' }}>
              {task.category}
            </span>
            <span className="badge badge-status-open" style={{ fontSize: '0.86rem', padding: '6px 14px' }}>
              Status: {task.status}
            </span>
          </div>

          {/* Owner Quick Actions */}
          {isOwner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to={`/edit-task/${task._id}`} className="btn btn-outline btn-sm">
                <Edit size={15} /> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {task.title}
        </h1>

        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          marginBottom: '28px',
          border: '1px solid #e2e8f0',
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Calendar size={14} color="#0284c7" /> Date
            </span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.96rem' }}>
              {new Date(task.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Clock size={14} color="#0d9488" /> Duration
            </span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.96rem' }}>
              {task.durationHours} Hours ({task.durationHours * 10 + 20} pts upon completion)
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <MapPin size={14} color="#f59e0b" /> Location
            </span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.96rem' }}>
              {task.location} {task.isRemote ? '(Remote / Online)' : ''}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Users size={14} color="#7c3aed" /> Volunteer Spots
            </span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.96rem' }}>
              {assignedCount} / {task.requiredVolunteers} spots taken
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
            About This Activity
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {task.description}
          </p>
        </div>

        {/* Skills Needed */}
        {task.skillsNeeded?.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>
              Preferred Skills / Attributes
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {task.skillsNeeded.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Application Action Bar */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div>
            {myApplication ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  backgroundColor: myApplication.status === 'completed' ? '#ecfdf5' : '#e0f2fe',
                  color: myApplication.status === 'completed' ? '#047857' : '#0369a1',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.9rem',
                }}>
                  <CheckCircle size={16} />
                  Status: {myApplication.status === 'completed' ? 'Completed (Hours logged!)' : 'Enrolled'}
                </span>
                {myApplication.status !== 'completed' && (
                  <button
                    onClick={handleWithdraw}
                    disabled={actionLoading}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444' }}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            ) : isNGO ? (
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                You are logged in with an NGO organizer profile.
              </span>
            ) : (
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Join this initiative to earn points, log volunteer hours, and support the community.
              </span>
            )}
          </div>

          {!myApplication && !isNGO && (
            <button
              onClick={handleApply}
              disabled={actionLoading || task.status === 'Completed' || task.status === 'Cancelled'}
              className="btn btn-primary btn-lg"
            >
              <Sparkles size={18} />
              {actionLoading ? 'Joining...' : 'Volunteer for this Task'}
            </button>
          )}

          {!isAuthenticated && (
            <Link to="/login" className="btn btn-primary btn-lg">
              Log in to Volunteer
            </Link>
          )}
        </div>
      </div>

      {/* NGO Status Management (If Owner) */}
      {isOwner && (
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
            Organizer Control Panel
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Change Task Status:</span>
            {['Open', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor: task.status === st ? '#0284c7' : '#f1f5f9',
                  color: task.status === st ? '#ffffff' : '#475569',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Volunteer Applicants Management */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
            Registered Volunteers ({task.applicants?.length || 0})
          </h3>

          {task.applicants?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>Volunteer</th>
                    <th style={{ padding: '10px 12px' }}>Contact</th>
                    <th style={{ padding: '10px 12px' }}>Badge</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {task.applicants.map((app) => (
                    <tr key={app.user?._id || app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{app.user?.name || 'Volunteer'}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{app.user?.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '9999px',
                          fontWeight: 700,
                        }}>
                          {app.user?.badge || 'Contributor'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: app.status === 'completed' ? '#059669' : '#0284c7',
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {app.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateApplicantStatus(app.user._id, 'completed')}
                              className="btn btn-secondary btn-sm"
                              style={{ backgroundColor: '#ecfdf5', color: '#047857' }}
                            >
                              <UserCheck size={14} /> Mark Completed
                            </button>
                          )}
                          {app.status === 'applied' && (
                            <button
                              onClick={() => handleUpdateApplicantStatus(app.user._id, 'assigned')}
                              className="btn btn-primary btn-sm"
                            >
                              Assign Spot
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No volunteers have signed up for this task yet.</p>
          )}
        </div>
      )}

      {/* NGO Organizer Info Box */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
          Organizing Non-Profit Organization
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              {task.createdBy?.organizationName || task.createdBy?.name}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', lineHeight: 1.5 }}>
              {task.createdBy?.mission || 'Committed to grassroots community betterment and collaborative volunteer empowerment.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: '0.85rem', color: '#475569' }}>
              {task.createdBy?.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#0284c7" /> {task.createdBy.email}
                </span>
              )}
              {task.createdBy?.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#0d9488" /> {task.createdBy.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Task Modal */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>
              🎉 Mark Task as Completed
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
              Completing this task will automatically grant volunteer hours and reward points to all enrolled participants!
            </p>

            <form onSubmit={handleCompleteTaskSubmit}>
              <div className="form-group">
                <label className="form-label">Estimated People Helped / Impacted</label>
                <input
                  type="number"
                  min="1"
                  value={peopleHelped}
                  onChange={(e) => setPeopleHelped(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brief Impact Summary / Accomplishments</label>
                <textarea
                  value={impactNotes}
                  onChange={(e) => setImpactNotes(e.target.value)}
                  placeholder="e.g. Cleared 100kg of waste and planted 40 native trees..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Reward Volunteers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
