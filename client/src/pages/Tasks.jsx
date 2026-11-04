import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  BookOpen,
  Utensils,
  Leaf,
  Smile,
  ShieldAlert,
  HandHeart,
  Layers,
} from 'lucide-react';

const categories = [
  'All',
  'Education',
  'Food distribution',
  'Environment',
  'Elder support',
  'Disaster support',
  'Community service',
];

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isNGO } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus && selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedUrgency && selectedUrgency !== 'All') params.urgency = selectedUrgency;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTasks();
  }, [selectedCategory, selectedStatus, selectedUrgency]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedUrgency('All');
    setSearchParams({});
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Community Service Tasks
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Discover and apply to volunteer activities organized by verified local non-profits.
          </p>
        </div>

        {isNGO && (
          <Link to="/create-task" className="btn btn-primary">
            <PlusCircle size={18} /> Create New Task
          </Link>
        )}
      </div>

      {/* Category Pills Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
      }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                backgroundColor: isSelected ? '#0284c7' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Search by title, description or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '42px' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ height: '42px' }}>
            Search
          </button>
        </form>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="form-select"
          style={{ width: '140px', height: '42px' }}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Urgency Filter */}
        <select
          value={selectedUrgency}
          onChange={(e) => setSelectedUrgency(e.target.value)}
          className="form-select"
          style={{ width: '130px', height: '42px' }}
        >
          <option value="All">All Urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        {/* Reset */}
        <button
          onClick={handleResetFilters}
          className="btn btn-outline"
          style={{ height: '42px', padding: '0 12px' }}
          title="Reset Filters"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Tasks Grid or Loading/Empty state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid #e0f2fe',
            borderTopColor: '#0284c7',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p>Loading community tasks...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : tasks.length > 0 ? (
        <div>
          <div style={{ marginBottom: '14px', fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
            Showing {tasks.length} task{tasks.length === 1 ? '' : 's'}
          </div>
          <div className="grid-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} currentUserId={user?._id || user?.id} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '20px auto',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Layers size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            No tasks found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '20px' }}>
            We couldn't find any community tasks matching your filter criteria. Try clearing some filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
