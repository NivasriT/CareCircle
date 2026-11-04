import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const getCategoryClass = (category) => {
  switch (category) {
    case 'Education': return 'badge-education';
    case 'Food distribution': return 'badge-food';
    case 'Environment': return 'badge-environment';
    case 'Elder support': return 'badge-elder';
    case 'Disaster support': return 'badge-disaster';
    case 'Community service': return 'badge-community';
    default: return 'badge-community';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Open': return 'badge-status-open';
    case 'In Progress': return 'badge-status-in-progress';
    case 'Completed': return 'badge-status-completed';
    case 'Cancelled': return 'badge-status-cancelled';
    default: return 'badge-status-open';
  }
};

const TaskCard = ({ task, currentUserId }) => {
  const assignedVolunteers = task.applicants?.filter(
    (a) => a.status === 'assigned' || a.status === 'completed'
  ) || [];

  const userApplication = task.applicants?.find(
    (a) => (a.user?._id || a.user) === currentUserId
  );

  const fillPercentage = Math.min(
    100,
    Math.round((assignedVolunteers.length / (task.requiredVolunteers || 1)) * 100)
  );

  const formattedDate = new Date(task.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card card-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}>
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <span className={`badge ${getCategoryClass(task.category)}`}>
            {task.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {task.urgency === 'Urgent' && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                padding: '2px 8px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}>
                <AlertCircle size={12} /> Urgent
              </span>
            )}
            <span className={`badge ${getStatusBadge(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        {/* Task Title */}
        <h3 style={{
          fontSize: '1.12rem',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '8px',
          lineHeight: 1.35,
        }}>
          <Link to={`/tasks/${task._id}`} style={{ color: '#0f172a' }}>
            {task.title}
          </Link>
        </h3>

        {/* Organization */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#0284c7',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '12px',
        }}>
          <Building2 size={15} />
          <span>{task.createdBy?.organizationName || task.createdBy?.name || 'CareCircle Partner NGO'}</span>
        </div>

        {/* Description snippet */}
        <p style={{
          color: '#64748b',
          fontSize: '0.88rem',
          lineHeight: 1.5,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {task.description}
        </p>

        {/* Info Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '0.82rem',
          color: '#475569',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#0284c7" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {task.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={14} color="#0d9488" /> {formattedDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#64748b" /> {task.durationHours} hrs
            </span>
          </div>
        </div>

        {/* Volunteers spots progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#64748b',
            marginBottom: '4px',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={13} /> Volunteers
            </span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              {assignedVolunteers.length} / {task.requiredVolunteers} spots
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e2e8f0',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${fillPercentage}%`,
              height: '100%',
              backgroundColor: fillPercentage >= 100 ? '#10b981' : '#0284c7',
              borderRadius: '9999px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid #f1f5f9',
      }}>
        {userApplication ? (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: userApplication.status === 'completed' ? '#059669' : '#0284c7',
            backgroundColor: userApplication.status === 'completed' ? '#ecfdf5' : '#eff6ff',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}>
            <CheckCircle2 size={14} />
            {userApplication.status === 'completed' ? 'Completed' : 'Enrolled'}
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {task.skillsNeeded?.length ? `${task.skillsNeeded.length} skills listed` : 'Open for all'}
          </span>
        )}

        <Link to={`/tasks/${task._id}`} className="btn btn-secondary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
