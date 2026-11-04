import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks with optional filters (category, search, status)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, status, urgency, page = 1, limit = 50 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (urgency && urgency !== 'All') {
      query.urgency = urgency;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name organizationName email phone location avatar')
      .populate('applicants.user', 'name email badge points hoursContributed')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      tasks,
    });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
});

// @route   GET /api/tasks/ngo/my-tasks
// @desc    Get all tasks created by the logged in NGO
// @access  Private (NGO)
router.get('/ngo/my-tasks', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
      .populate('applicants.user', 'name email phone skills badge points hoursContributed')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve NGO tasks.' });
  }
});

// @route   GET /api/tasks/volunteer/my-tasks
// @desc    Get tasks where logged-in volunteer has applied / assigned
// @access  Private (Volunteer)
router.get('/volunteer/my-tasks', protect, authorize('volunteer', 'admin'), async (req, res) => {
  try {
    const tasks = await Task.find({
      'applicants.user': req.user._id,
    })
      .populate('createdBy', 'name organizationName email phone location')
      .sort({ createdAt: -1 });

    // Format response to include user's specific status in each task
    const myTasks = tasks.map((task) => {
      const userApp = task.applicants.find(
        (app) => app.user.toString() === req.user._id.toString()
      );
      return {
        ...task.toObject(),
        myStatus: userApp ? userApp.status : 'unknown',
        appliedAt: userApp ? userApp.appliedAt : null,
      };
    });

    res.json({
      success: true,
      count: myTasks.length,
      tasks: myTasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve volunteer tasks.' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name organizationName email phone location mission website')
      .populate('applicants.user', 'name email phone badge points hoursContributed skills');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch task details.' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task (NGO)
// @access  Private (NGO)
router.post('/', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      isRemote,
      date,
      durationHours,
      urgency,
      requiredVolunteers,
      skillsNeeded,
    } = req.body;

    if (!title || !description || !category || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, description, category, location, date).',
      });
    }

    const task = await Task.create({
      title,
      description,
      category,
      location,
      isRemote: Boolean(isRemote),
      date,
      durationHours: Number(durationHours) || 3,
      urgency: urgency || 'Medium',
      requiredVolunteers: Number(requiredVolunteers) || 5,
      skillsNeeded: Array.isArray(skillsNeeded)
        ? skillsNeeded
        : skillsNeeded
        ? skillsNeeded.split(',').map((s) => s.trim())
        : [],
      createdBy: req.user._id,
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Community service task created successfully!',
      task,
    });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating task.' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task details (NGO owner)
// @access  Private (NGO)
router.put('/:id', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Verify ownership
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this task.',
      });
    }

    const {
      title,
      description,
      category,
      location,
      isRemote,
      date,
      durationHours,
      urgency,
      requiredVolunteers,
      skillsNeeded,
      status,
      impactSummary,
    } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (category) task.category = category;
    if (location) task.location = location;
    if (isRemote !== undefined) task.isRemote = isRemote;
    if (date) task.date = date;
    if (durationHours) task.durationHours = Number(durationHours);
    if (urgency) task.urgency = urgency;
    if (requiredVolunteers) task.requiredVolunteers = Number(requiredVolunteers);
    if (skillsNeeded) {
      task.skillsNeeded = Array.isArray(skillsNeeded)
        ? skillsNeeded
        : skillsNeeded.split(',').map((s) => s.trim());
    }
    if (status) task.status = status;
    if (impactSummary) task.impactSummary = impactSummary;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating task.' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task (NGO owner)
// @access  Private (NGO)
router.delete('/:id', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Verify ownership
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this task.',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
});

// @route   POST /api/tasks/:id/apply
// @desc    Volunteer applies / joins a task
// @access  Private (Volunteer)
router.post('/:id/apply', protect, authorize('volunteer', 'admin'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (task.status === 'Completed' || task.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot apply to a task with status '${task.status}'.`,
      });
    }

    // Check if already applied
    const alreadyApplied = task.applicants.some(
      (app) => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied or registered for this task.',
      });
    }

    // Auto-assign if spots are available
    const assignedCount = task.applicants.filter(
      (a) => a.status === 'assigned' || a.status === 'completed'
    ).length;

    const initialStatus = assignedCount < task.requiredVolunteers ? 'assigned' : 'applied';

    task.applicants.push({
      user: req.user._id,
      status: initialStatus,
      appliedAt: new Date(),
    });

    await task.save();

    res.json({
      success: true,
      message:
        initialStatus === 'assigned'
          ? 'Congratulations! You have been successfully assigned to this community task.'
          : 'Application received! You are on the waitlist/pending review.',
      taskStatus: task.status,
      userStatus: initialStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to apply for task.' });
  }
});

// @route   POST /api/tasks/:id/withdraw
// @desc    Volunteer withdraws from a task
// @access  Private (Volunteer)
router.post('/:id/withdraw', protect, authorize('volunteer', 'admin'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.applicants = task.applicants.filter(
      (app) => app.user.toString() !== req.user._id.toString()
    );

    await task.save();

    res.json({
      success: true,
      message: 'You have withdrawn from this task.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to withdraw from task.' });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status (Open, In Progress, Completed, Cancelled)
// @access  Private (NGO owner)
router.patch('/:id/status', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const { status, impactNotes, peopleHelped } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (!['Open', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    task.status = status;

    if (impactNotes) task.impactSummary.notes = impactNotes;
    if (peopleHelped) task.impactSummary.peopleHelped = Number(peopleHelped);

    // If marked Completed, automatically mark all assigned volunteers as completed and grant them points
    if (status === 'Completed') {
      for (const app of task.applicants) {
        if (app.status === 'assigned') {
          app.status = 'completed';
          app.hoursLogged = task.durationHours;

          // Award points & hours to the volunteer
          const vol = await User.findById(app.user);
          if (vol) {
            vol.points += task.durationHours * 10 + 20; // 10 pts per hr + 20 bonus for completion
            vol.hoursContributed += task.durationHours;
            vol.completedTasksCount += 1;
            vol.updateBadge();
            await vol.save();
          }
        }
      }
    }

    await task.save();

    res.json({
      success: true,
      message: `Task status updated to '${status}'.`,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating status.' });
  }
});

// @route   PATCH /api/tasks/:id/applicants/:userId
// @desc    Update volunteer applicant status (assigned, completed, rejected)
// @access  Private (NGO owner)
router.patch('/:id/applicants/:userId', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const applicant = task.applicants.find(
      (a) => a.user.toString() === req.params.userId.toString()
    );

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Volunteer applicant not found.' });
    }

    const previousStatus = applicant.status;
    applicant.status = status;
    if (feedback) applicant.feedback = feedback;

    // If newly marked 'completed', reward volunteer
    if (status === 'completed' && previousStatus !== 'completed') {
      applicant.hoursLogged = task.durationHours;
      const vol = await User.findById(req.params.userId);
      if (vol) {
        vol.points += task.durationHours * 10 + 20;
        vol.hoursContributed += task.durationHours;
        vol.completedTasksCount += 1;
        vol.updateBadge();
        await vol.save();
      }
    }

    await task.save();

    res.json({
      success: true,
      message: `Volunteer status updated to '${status}'.`,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating applicant status.' });
  }
});

export default router;
