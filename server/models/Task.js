import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
    },
    category: {
      type: String,
      required: [true, 'Task category is required'],
      enum: [
        'Education',
        'Food distribution',
        'Environment',
        'Elder support',
        'Disaster support',
        'Community service',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location or venue is required'],
      trim: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: [true, 'Event or task date is required'],
    },
    durationHours: {
      type: Number,
      required: [true, 'Duration in hours is required'],
      default: 3,
      min: 1,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    requiredVolunteers: {
      type: Number,
      required: [true, 'Required number of volunteers is required'],
      default: 5,
      min: 1,
    },
    skillsNeeded: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['applied', 'assigned', 'completed', 'rejected'],
          default: 'applied',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        feedback: {
          type: String,
          default: '',
        },
        hoursLogged: {
          type: Number,
          default: 0,
        },
      },
    ],
    impactSummary: {
      peopleHelped: { type: Number, default: 0 },
      notes: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
taskSchema.index({ category: 1, status: 1 });
taskSchema.index({ createdBy: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
