import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

// @route   GET /api/stats/leaderboard
// @desc    Get volunteer rankings based on points, hours, and completed tasks
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' })
      .select('name email location points hoursContributed completedTasksCount badge skills createdAt')
      .sort({ points: -1, hoursContributed: -1, completedTasksCount: -1 })
      .limit(20);

    const rankedVolunteers = volunteers.map((vol, index) => {
      let rankTier = 'Contributor';
      if (index === 0) rankTier = 'Champion 🏆';
      else if (index === 1) rankTier = 'Silver Star 🥈';
      else if (index === 2) rankTier = 'Bronze Star 🥉';
      else if (index < 10) rankTier = 'Top 10 Hero ⭐';

      return {
        rank: index + 1,
        tier: rankTier,
        ...vol.toObject(),
      };
    });

    res.json({
      success: true,
      count: rankedVolunteers.length,
      leaderboard: rankedVolunteers,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard rankings.' });
  }
});

// @route   GET /api/stats/impact
// @desc    Get aggregate community impact metrics & category breakdown
// @access  Public
router.get('/impact', async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const activeTasks = await Task.countDocuments({ status: { $in: ['Open', 'In Progress'] } });

    // Aggregate total volunteer hours
    const hoursAggregate = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $group: { _id: null, totalHours: { $sum: '$hoursContributed' }, totalPoints: { $sum: '$points' } } },
    ]);

    const totalHours = hoursAggregate[0]?.totalHours || 0;
    const totalPoints = hoursAggregate[0]?.totalPoints || 0;

    // Aggregate category distribution
    const categories = [
      'Education',
      'Food distribution',
      'Environment',
      'Elder support',
      'Disaster support',
      'Community service',
    ];

    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Task.countDocuments({ category: cat });
        const completed = await Task.countDocuments({ category: cat, status: 'Completed' });
        return {
          category: cat,
          total: count,
          completed,
          percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
        };
      })
    );

    // Calculate approximate people impacted / helped
    const impactAggregate = await Task.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalPeopleHelped: { $sum: '$impactSummary.peopleHelped' } } },
    ]);

    const peopleHelped = (impactAggregate[0]?.totalPeopleHelped || 0) + (completedTasks * 45);

    // Recent completed tasks
    const recentImpactTasks = await Task.find({ status: 'Completed' })
      .populate('createdBy', 'name organizationName location')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalVolunteers,
        totalNGOs,
        totalTasks,
        completedTasks,
        activeTasks,
        totalHours,
        totalPoints,
        peopleHelped,
        categoryStats,
        recentImpactTasks,
      },
    });
  } catch (error) {
    console.error('Impact stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch impact metrics.' });
  }
});

export default router;
