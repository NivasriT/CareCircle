import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart3,
  Users,
  Building2,
  Clock,
  HeartHandshake,
  CheckCircle,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';

const categoryColors = {
  Education: { bar: '#f59e0b', text: '#b45309', bg: '#fef3c7' },
  'Food distribution': { bar: '#ea580c', text: '#c2410c', bg: '#ffedd5' },
  Environment: { bar: '#16a34a', text: '#15803d', bg: '#dcfce7' },
  'Elder support': { bar: '#9333ea', text: '#7e22ce', bg: '#f3e8ff' },
  'Disaster support': { bar: '#dc2626', text: '#b91c1c', bg: '#fee2e2' },
  'Community service': { bar: '#4f46e5', text: '#4338ca', bg: '#e0e7ff' },
};

const ImpactDashboard = () => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await api.get('/stats/impact');
        if (res.data.success) {
          setImpactData(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load impact stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        <p>Loading community impact metrics...</p>
      </div>
    );
  }

  const stats = impactData || {
    totalVolunteers: 24,
    totalNGOs: 6,
    totalTasks: 14,
    completedTasks: 8,
    activeTasks: 6,
    totalHours: 140,
    peopleHelped: 820,
    categoryStats: [],
    recentImpactTasks: [],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
        border: '1px solid #bae6fd',
        borderRadius: '20px',
        padding: '36px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '12px',
          }}>
            <BarChart3 size={15} /> Real-Time Transparency
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            CareCircle Community Impact Dashboard
          </h1>
          <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.6 }}>
            Tracking every hour served, every meal delivered, every tree planted, and every life touched across our collaborative network.
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          minWidth: '220px',
        }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Estimated Lives Impacted</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
            {stats.peopleHelped}+
          </div>
          <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 600 }}>
            Beneficiaries Supported
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Total Volunteers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a' }}>
            {stats.totalVolunteers}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Active registered contributors</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Partner NGOs</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0d9488' }}>
            {stats.totalNGOs}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Verified organizations</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Hours Dedicated</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f59e0b' }}>
            {stats.totalHours} hrs
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Volunteer time invested</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Completed Drives</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#10b981' }}>
            {stats.completedTasks}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{stats.activeTasks} ongoing activities</span>
        </div>
      </div>

      {/* Category Breakdown Progress Meters */}
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Impact by Category Distribution
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '28px' }}>
          Visual breakdown of community initiatives across our 6 core social service pillars.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {stats.categoryStats?.map((cat) => {
            const colorScheme = categoryColors[cat.category] || { bar: '#0284c7', text: '#0284c7', bg: '#e0f2fe' };
            return (
              <div key={cat.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#0f172a',
                    }}>
                      {cat.category}
                    </span>
                    <span style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: colorScheme.bg,
                      color: colorScheme.text,
                    }}>
                      {cat.completed} Completed / {cat.total} Total
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    {cat.percentage}%
                  </span>
                </div>

                {/* Bar */}
                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${Math.max(5, cat.percentage)}%`,
                    height: '100%',
                    backgroundColor: colorScheme.bar,
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Success Stories / Completed Tasks */}
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Recent Community Success Milestones
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '24px' }}>
          Completed drives that delivered tangible benefit to neighborhoods.
        </p>

        {stats.recentImpactTasks?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.recentImpactTasks.map((task) => (
              <div
                key={task._id}
                style={{
                  padding: '18px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-community" style={{ fontSize: '0.74rem' }}>
                      {task.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={13} /> Completed
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    {task.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '4px' }}>
                    Organized by: <strong style={{ color: '#334155' }}>{task.createdBy?.organizationName || task.createdBy?.name}</strong> • {task.location}
                  </p>
                  {task.impactSummary?.notes && (
                    <p style={{ color: '#047857', fontSize: '0.84rem', marginTop: '6px', fontStyle: 'italic' }}>
                      "{task.impactSummary.notes}"
                    </p>
                  )}
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'right',
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Impact Created</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                    {task.impactSummary?.peopleHelped || 50}+ helped
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Newly completed tasks and verified impact metrics will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

export default ImpactDashboard;
