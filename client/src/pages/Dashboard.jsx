import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Award,
  Clock,
  CheckCircle,
  PlusCircle,
  Layers,
  Building2,
  Calendar,
  Users,
  ChevronRight,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';

const Dashboard = () => {
  const { user, isNGO, isVolunteer } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isNGO) {
        const res = await api.get('/tasks/ngo/my-tasks');
        if (res.data.success) {
          setTasks(res.data.tasks);
        }
      } else {
        const res = await api.get('/tasks/volunteer/my-tasks');
        if (res.data.success) {
          setTasks(res.data.tasks);
        }
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isNGO]);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      }
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  // Metrics calculation
  const totalTasksCount = tasks.length;
  const completedCount = isNGO
    ? tasks.filter((t) => t.status === 'Completed').length
    : tasks.filter((t) => t.myStatus === 'completed').length;
  const inProgressCount = isNGO
    ? tasks.filter((t) => t.status === 'In Progress').length
    : tasks.filter((t) => t.myStatus === 'assigned' && t.status !== 'Completed').length;
  const totalApplicantsNGO = isNGO
    ? tasks.reduce((acc, t) => acc + (t.applicants?.length || 0), 0)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
        border: '1px solid #bae6fd',
        borderRadius: '18px',
        padding: '28px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: isNGO ? '#0284c7' : '#0d9488',
              color: '#ffffff',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}>
              {isNGO ? 'NGO Organization Panel' : 'Volunteer Portal'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '4px' }}>
            {isNGO
              ? `Managing activities for ${user?.organizationName || 'your community group'}`
              : `Making a tangible difference across communities`}
          </p>
        </div>

        {isNGO ? (
          <Link to="/create-task" className="btn btn-primary">
            <PlusCircle size={18} /> Post New Task
          </Link>
        ) : (
          <Link to="/tasks" className="btn btn-primary">
            <Layers size={18} /> Find More Tasks
          </Link>
        )}
      </div>

      {/* Metric Cards Row */}
      <div className="grid-4">
        {isNGO ? (
          <>
            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#0284c7" /> Total Tasks Created
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
                {totalTasksCount}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="#0d9488" /> Volunteer Signups
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0d9488', marginTop: '8px' }}>
                {totalApplicantsNGO}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" /> Completed Drives
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '8px' }}>
                {completedCount}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#f59e0b" /> Active / In Progress
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '8px' }}>
                {inProgressCount}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#f59e0b" /> Impact Points
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '8px' }}>
                {user?.points || 0}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#0284c7" /> Hours Volunteered
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', marginTop: '8px' }}>
                {user?.hoursContributed || 0} hrs
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" /> Tasks Completed
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '8px' }}>
                {user?.completedTasksCount || 0}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} color="#7c3aed" /> Current Badge
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7c3aed', marginTop: '8px' }}>
                {user?.badge || 'Starter Samaritan'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Table / Tasks List Card */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {isNGO ? 'Managed Tasks & Volunteer Roster' : 'My Volunteering Missions'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              {isNGO
                ? 'Review signups, update execution statuses, and award volunteer credit'
                : 'Track tasks you have enrolled in, active schedules, and logged hours'}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <p>Loading your dashboard records...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 14px' }}>Task Title</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  {isNGO ? (
                    <th style={{ padding: '12px 14px' }}>Volunteers</th>
                  ) : (
                    <th style={{ padding: '12px 14px' }}>My Status</th>
                  )}
                  <th style={{ padding: '12px 14px' }}>Overall Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>
                      <Link to={`/tasks/${task._id}`} style={{ color: '#0f172a' }}>
                        {task.title}
                      </Link>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-community" style={{ fontSize: '0.78rem' }}>
                        {task.category}
                      </span>
                    </td>

                    <td style={{ padding: '14px', color: '#475569', fontSize: '0.85rem' }}>
                      {new Date(task.date).toLocaleDateString()}
                    </td>

                    {isNGO ? (
                      <td style={{ padding: '14px', color: '#0284c7', fontWeight: 600 }}>
                        {task.applicants?.length || 0} / {task.requiredVolunteers}
                      </td>
                    ) : (
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: task.myStatus === 'completed' ? '#ecfdf5' : '#eff6ff',
                          color: task.myStatus === 'completed' ? '#047857' : '#0369a1',
                        }}>
                          {task.myStatus}
                        </span>
                      </td>
                    )}

                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-status-open" style={{ fontSize: '0.78rem' }}>
                        {task.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link to={`/tasks/${task._id}`} className="btn btn-outline btn-sm">
                          View
                        </Link>
                        {isNGO && (
                          <>
                            <Link to={`/edit-task/${task._id}`} className="btn btn-outline btn-sm" title="Edit">
                              <Edit size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <p style={{ marginBottom: '16px' }}>
              {isNGO
                ? "You haven't posted any community tasks yet."
                : "You haven't enrolled in any tasks yet."}
            </p>
            {isNGO ? (
              <Link to="/create-task" className="btn btn-primary btn-sm">
                Create Your First Task
              </Link>
            ) : (
              <Link to="/tasks" className="btn btn-primary btn-sm">
                Explore Available Tasks
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
