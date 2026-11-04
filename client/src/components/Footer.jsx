import React from 'react';
import { Heart, Globe, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '48px 20px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '36px',
        marginBottom: '36px',
      }}>
        {/* Col 1 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <Heart size={18} fill="#ffffff" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Care<span style={{ color: '#0284c7' }}>Circle</span>
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
            A collaborative platform bridging empathetic volunteers with registered NGOs and grassroots community initiatives to create measurable, sustainable social impact.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={18} />
            Verified Non-Profit Ecosystem
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Causes & Categories
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#64748b' }}>
            <li><Link to="/tasks?category=Education" style={{ hover: { color: '#0284c7' } }}>Education & Tutoring</Link></li>
            <li><Link to="/tasks?category=Food distribution">Food Distribution & Kitchens</Link></li>
            <li><Link to="/tasks?category=Environment">Environment & Cleanups</Link></li>
            <li><Link to="/tasks?category=Elder support">Elder Care & Senior Tech</Link></li>
            <li><Link to="/tasks?category=Disaster support">Disaster Support & First Aid</Link></li>
            <li><Link to="/tasks?category=Community service">Community Infrastructure</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Platform Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#64748b' }}>
            <li><Link to="/tasks">Browse Active Tasks</Link></li>
            <li><Link to="/impact">Live Impact Metrics</Link></li>
            <li><Link to="/leaderboard">Volunteer Hall of Fame</Link></li>
            <li><Link to="/register">Register your NGO</Link></li>
            <li><Link to="/register">Become a Volunteer</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Reach Out & Support
          </h4>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '12px' }}>
            Have questions about volunteering or registering your NGO on CareCircle?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#475569' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#0284c7" /> support@carecircle.org
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#0d9488" /> +91 (800) 227-3247
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#64748b" /> Bengaluru, Karnataka, India
            </span>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '0.82rem',
        color: '#94a3b8',
      }}>
        <span>© {new Date().getFullYear()} CareCircle. Built with MERN Stack for Community Service.</span>
        <span>Light Palette Design System • MongoDB • Express • React • Node.js</span>
      </div>
    </footer>
  );
};

export default Footer;
