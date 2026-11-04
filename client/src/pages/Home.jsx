import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Users,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Utensils,
  Leaf,
  Smile,
  ShieldAlert,
  HandHeart,
  CheckCircle,
} from 'lucide-react';

const categories = [
  { name: 'Education', icon: BookOpen, color: '#f59e0b', bg: '#fef3c7', count: 'Tutoring & Literacy' },
  { name: 'Food distribution', icon: Utensils, color: '#ea580c', bg: '#ffedd5', count: 'Meals & Kitchens' },
  { name: 'Environment', icon: Leaf, color: '#16a34a', bg: '#dcfce7', count: 'Cleanups & Plantation' },
  { name: 'Elder support', icon: Smile, color: '#9333ea', bg: '#f3e8ff', count: 'Care & Digital Literacy' },
  { name: 'Disaster support', icon: ShieldAlert, color: '#dc2626', bg: '#fee2e2', count: 'Relief & First Aid' },
  { name: 'Community service', icon: HandHeart, color: '#4f46e5', bg: '#e0e7ff', count: 'Civic & Infrastructure' },
];

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVolunteers: 12,
    totalNGOs: 5,
    completedTasks: 8,
    totalHours: 85,
    peopleHelped: 650,
  });
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/stats/impact').catch(() => null),
          api.get('/tasks?limit=3&status=Open').catch(() => null),
        ]);

        if (statsRes?.data?.stats) {
          setStats(statsRes.data.stats);
        }
        if (tasksRes?.data?.tasks) {
          setFeaturedTasks(tasksRes.data.tasks);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', paddingBottom: '40px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
        borderRadius: '24px',
        padding: '56px 32px',
        border: '1px solid #bae6fd',
        boxShadow: '0 4px 20px -2px rgba(2, 132, 199, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.86rem',
            fontWeight: 700,
            marginBottom: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
          }}>
            <Sparkles size={16} /> Bridging Compassion with Community Action
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.18,
            color: '#0f172a',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            Every Volunteer Action Sparks a <span style={{ color: '#0284c7' }}>Ripple of Hope</span>.
          </h1>

          <p style={{
            fontSize: '1.12rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '680px',
          }}>
            CareCircle unites passionate volunteers with registered NGOs to tackle Education, Food relief, Environmental conservation, Elder care, and Disaster recovery across communities.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <Link to="/tasks" className="btn btn-primary btn-lg">
              Explore Active Tasks <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ backgroundColor: '#ffffff' }}>
              Register Your NGO / Volunteer
            </Link>
          </div>
        </div>

        {/* Impact Highlights Bar */}
        <div style={{
          marginTop: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', display: 'block' }}>
              {stats.totalVolunteers || 24}+
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Volunteers</span>
          </div>

          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d9488', display: 'block' }}>
              {stats.totalNGOs || 6}+
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Partner NGOs</span>
          </div>

          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', display: 'block' }}>
              {stats.totalHours || 120}+ hrs
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Volunteered Time</span>
          </div>

          <div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', display: 'block' }}>
              {stats.peopleHelped || 850}+
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Lives Impacted</span>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Explore Community Causes
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Choose a domain where you want to make an immediate, meaningful difference
          </p>
        </div>

        <div className="grid-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/tasks?category=${encodeURIComponent(cat.name)}`}
                className="card card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: cat.bg,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    {cat.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tasks */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Urgent Community Drives
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
              Ready for immediate participation across local centers
            </p>
          </div>
          <Link to="/tasks" className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
            View All Tasks ({featuredTasks.length}+)
          </Link>
        </div>

        <div className="grid-3">
          {featuredTasks.map((task) => (
            <TaskCard key={task._id} task={task} currentUserId={user?._id || user?.id} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '44px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            How CareCircle Connects Communities
          </h2>
          <p style={{ color: '#64748b' }}>A transparent, rewarding cycle of service and social impact</p>
        </div>

        <div className="grid-3">
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontWeight: 800,
              fontSize: '1.3rem',
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>NGOs Post Needs</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Verified organizations publish community requirements specifying required volunteers, time, date, and domain.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ccfbf1',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontWeight: 800,
              fontSize: '1.3rem',
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Volunteers Step Up</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Individuals discover tasks matching their passions, apply in 1-click, and coordinate directly with task leads.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontWeight: 800,
              fontSize: '1.3rem',
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Earn Badges & Impact</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Upon task completion, volunteers log hours, earn points, climb the ranking ladder, and view community impact.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
        borderRadius: '20px',
        padding: '48px 32px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.3)',
      }}>
        <div style={{ maxWidth: '620px' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Ready to make an impact today?
          </h2>
          <p style={{ fontSize: '1rem', color: '#e0f2fe', lineHeight: 1.6 }}>
            Join hundreds of volunteers and grassroots organizers driving positive change in local neighborhoods.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/register" className="btn btn-lg" style={{ backgroundColor: '#ffffff', color: '#0284c7', fontWeight: 700 }}>
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
