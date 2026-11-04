import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Sparkles,
  Trophy,
  Medal,
  Clock,
  CheckCircle,
  MapPin,
  TrendingUp,
} from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/stats/leaderboard');
        if (res.data.success) {
          setVolunteers(res.data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topThree = volunteers.slice(0, 3);
  const remaining = volunteers.slice(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 50%, #f0fdf4 100%)',
        border: '1px solid #fde68a',
        borderRadius: '20px',
        padding: '36px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid #fde68a',
            color: '#b45309',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '12px',
          }}>
            <Trophy size={15} /> Community Hall of Fame
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Volunteer Rankings & Leaderboard
          </h1>
          <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.6 }}>
            Celebrating dedicated community members who invest their time, skills, and heart to create real social change.
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          textAlign: 'center',
          minWidth: '200px',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Champions</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
            {volunteers.length} Recognized
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
            + Points awarded dynamically
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p>Loading leaderboard rankings...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              alignItems: 'stretch',
            }}>
              {topThree.map((vol, index) => {
                const isGold = index === 0;
                const isSilver = index === 1;
                const isBronze = index === 2;

                const medalColor = isGold ? '#eab308' : isSilver ? '#94a3b8' : '#b45309';
                const medalBg = isGold ? '#fef9c3' : isSilver ? '#f1f5f9' : '#ffedd5';

                return (
                  <div
                    key={vol._id}
                    className="card card-hover"
                    style={{
                      borderTop: `4px solid ${medalColor}`,
                      textAlign: 'center',
                      padding: '32px 24px',
                      position: 'relative',
                    }}
                  >
                    {/* Rank Badge */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: medalBg,
                      color: medalColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                      {isGold ? '🥇' : isSilver ? '🥈' : '🥉'}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                      {vol.name}
                    </h3>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      backgroundColor: '#e0f2fe',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      display: 'inline-block',
                      marginBottom: '16px',
                    }}>
                      {vol.badge || 'Community Pillar'}
                    </span>

                    {/* Stats Box */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      marginTop: '8px',
                    }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Points</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>
                          {vol.points}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Hours</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>
                          {vol.hoursContributed}h
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Tasks</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>
                          {vol.completedTasksCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
              Full Community Rankings
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Rank</th>
                    <th style={{ padding: '12px' }}>Volunteer</th>
                    <th style={{ padding: '12px' }}>Tier Badge</th>
                    <th style={{ padding: '12px' }}>Location</th>
                    <th style={{ padding: '12px' }}>Tasks Done</th>
                    <th style={{ padding: '12px' }}>Hours Contributed</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((vol) => {
                    const isCurrentUser = user && (user._id === vol._id || user.id === vol._id);
                    return (
                      <tr
                        key={vol._id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isCurrentUser ? '#f0fdf4' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '14px 12px', fontWeight: 800, color: '#0f172a' }}>
                          #{vol.rank}
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{vol.name}</span>
                            {isCurrentUser && (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '1px 6px',
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                fontWeight: 700,
                              }}>
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '9999px',
                          }}>
                            {vol.badge || 'Starter Samaritan'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#64748b', fontSize: '0.85rem' }}>
                          {vol.location || 'Local Community'}
                        </td>
                        <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 600 }}>
                          {vol.completedTasksCount || 0}
                        </td>
                        <td style={{ padding: '14px 12px', color: '#0284c7', fontWeight: 600 }}>
                          {vol.hoursContributed || 0} hrs
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 800, color: '#f59e0b', fontSize: '1rem' }}>
                          {vol.points} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
