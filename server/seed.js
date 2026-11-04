import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Task from './models/Task.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🧹 Cleared existing users and tasks');

    // Create NGOs
    const ngos = await User.create([
      {
        name: 'Dr. Aruna Sundaram',
        email: 'asha.foundation@carecircle.org',
        password: 'password123',
        role: 'ngo',
        phone: '+91 98450 11223',
        location: 'Bangalore, Karnataka',
        organizationName: 'Asha Community Foundation',
        registrationNumber: 'NGO-KA-2018-8871',
        mission: 'Empowering underprivileged communities through equitable education, elder care, and foundational health support.',
        website: 'https://ashafoundation.example.org',
        bio: 'Established in 2018, operating community centers across 12 suburban zones.',
      },
      {
        name: 'Vikas Deshmukh',
        email: 'greenearth@carecircle.org',
        password: 'password123',
        role: 'ngo',
        phone: '+91 97654 33445',
        location: 'Pune, Maharashtra',
        organizationName: 'Green Earth Initiative',
        registrationNumber: 'NGO-MH-2020-4109',
        mission: 'Restoring urban biodiversity, planting native trees, and promoting sustainable waste management.',
        website: 'https://greenearthinitiative.example.org',
        bio: 'Grassroots environmental activist group with over 1,500 tree plantation drives completed.',
      },
      {
        name: 'Farida Khan',
        email: 'annapoorna@carecircle.org',
        password: 'password123',
        role: 'ngo',
        phone: '+91 98112 77889',
        location: 'Chennai, Tamil Nadu',
        organizationName: 'Annapoorna Relief & Care',
        registrationNumber: 'NGO-TN-2016-1944',
        mission: 'Eradicating hunger and deploying rapid nutrition relief during disasters and seasonal crises.',
        website: 'https://annapoornarelief.example.org',
        bio: 'Operating 4 community kitchens serving warm nutritious meals to vulnerable populations.',
      },
    ]);

    console.log(`✅ Created ${ngos.length} sample NGOs`);

    // Create Volunteers
    const volunteers = await User.create([
      {
        name: 'Nivasri T',
        email: 'nivasri@carecircle.org',
        password: 'password123',
        role: 'volunteer',
        phone: '+91 98765 43210',
        location: 'Bangalore, Karnataka',
        bio: 'Passionate about digital literacy for children and active tree plantation programs.',
        skills: ['Teaching', 'Project Management', 'First Aid', 'Public Speaking'],
        interests: ['Education', 'Environment', 'Elder support'],
        points: 420,
        hoursContributed: 32,
        completedTasksCount: 8,
        badge: 'Care Champion',
      },
      {
        name: 'Priya Sharma',
        email: 'priya@carecircle.org',
        password: 'password123',
        role: 'volunteer',
        phone: '+91 98221 44556',
        location: 'Mumbai, Maharashtra',
        bio: 'Healthcare student enthusiastic about elder assistance and disaster relief kits.',
        skills: ['Nursing', 'Elder Care', 'Organization'],
        interests: ['Elder support', 'Disaster support'],
        points: 240,
        hoursContributed: 18,
        completedTasksCount: 5,
        badge: 'Community Pillar',
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@carecircle.org',
        password: 'password123',
        role: 'volunteer',
        phone: '+91 99100 55443',
        location: 'Delhi NCR',
        bio: 'Environmental enthusiast who loves lake cleanups and cycling marathons.',
        skills: ['Event Coordination', 'Heavy Lifting', 'Waste Segregation'],
        interests: ['Environment', 'Community service'],
        points: 180,
        hoursContributed: 15,
        completedTasksCount: 4,
        badge: 'Community Pillar',
      },
      {
        name: 'Ananya Rao',
        email: 'ananya@carecircle.org',
        password: 'password123',
        role: 'volunteer',
        phone: '+91 97400 66778',
        location: 'Bangalore, Karnataka',
        bio: 'Software engineer dedicating weekends to community service and educational mentoring.',
        skills: ['Basic Coding', 'Mathematics Tutoring', 'Photography'],
        interests: ['Education', 'Food distribution'],
        points: 95,
        hoursContributed: 8,
        completedTasksCount: 2,
        badge: 'Active Contributor',
      },
      {
        name: 'Karthik Raja',
        email: 'karthik@carecircle.org',
        password: 'password123',
        role: 'volunteer',
        phone: '+91 94440 12345',
        location: 'Chennai, Tamil Nadu',
        bio: 'Youth volunteer ready to lend a helping hand in relief distribution and logistics.',
        skills: ['Driving', 'Logistics', 'Cooking & Packaging'],
        interests: ['Food distribution', 'Disaster support'],
        points: 60,
        hoursContributed: 6,
        completedTasksCount: 2,
        badge: 'Active Contributor',
      },
    ]);

    console.log(`✅ Created ${volunteers.length} sample Volunteers`);

    // Create Tasks
    const now = new Date();

    const tasks = [
      {
        title: 'Weekend Math & Science Tutoring for Underprivileged Kids',
        description: 'Join us at the community learning center to guide students of grades 6-9 with fundamental mathematics and basic science concepts. Learning aids and study materials provided.',
        category: 'Education',
        location: 'Asha Learning Center, Jayanagar, Bangalore',
        isRemote: false,
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // in 3 days
        durationHours: 3,
        urgency: 'Medium',
        requiredVolunteers: 6,
        skillsNeeded: ['Mathematics', 'Science', 'Patience', 'English / Regional Language'],
        status: 'Open',
        createdBy: ngos[0]._id,
        applicants: [
          { user: volunteers[0]._id, status: 'assigned' },
          { user: volunteers[3]._id, status: 'assigned' },
        ],
      },
      {
        title: 'Community Kitchen Food Relief & Packaging Drive',
        description: 'Help prepare, sanitize, package, and load 500+ warm meal boxes for daily wage workers and shelter residents across the metropolitan area.',
        category: 'Food distribution',
        location: 'Annapoorna Kitchen Hub, T. Nagar, Chennai',
        isRemote: false,
        date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
        durationHours: 4,
        urgency: 'High',
        requiredVolunteers: 10,
        skillsNeeded: ['Food Handling', 'Packing', 'Hygiene Standards'],
        status: 'Open',
        createdBy: ngos[2]._id,
        applicants: [
          { user: volunteers[1]._id, status: 'assigned' },
          { user: volunteers[4]._id, status: 'assigned' },
        ],
      },
      {
        title: 'Lakeside Cleanup & Urban Tree Plantation',
        description: 'Restoration campaign to clear plastic waste from the lake perimeter and plant 100 native saplings with organic compost and protective tree guards.',
        category: 'Environment',
        location: 'Pashan Lake Conservation Zone, Pune',
        isRemote: false,
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        durationHours: 4,
        urgency: 'Medium',
        requiredVolunteers: 15,
        skillsNeeded: ['Gardening', 'Physical Stamina', 'Environmental Care'],
        status: 'Open',
        createdBy: ngos[1]._id,
        applicants: [
          { user: volunteers[0]._id, status: 'assigned' },
          { user: volunteers[2]._id, status: 'assigned' },
        ],
      },
      {
        title: 'Companionship & Tech Literacy Workshop for Seniors',
        description: 'Spend an uplifting Sunday morning with senior residents at the Golden Years home. Assist them in learning smartphone essentials, video calling grandchildren, and digital safety.',
        category: 'Elder support',
        location: 'Golden Years Retirement Residence, Indiranagar, Bangalore',
        isRemote: false,
        date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        durationHours: 2,
        urgency: 'Low',
        requiredVolunteers: 5,
        skillsNeeded: ['Smartphone Literacy', 'Active Listening', 'Empathy'],
        status: 'Open',
        createdBy: ngos[0]._id,
        applicants: [
          { user: volunteers[1]._id, status: 'assigned' },
        ],
      },
      {
        title: 'Emergency Monsoon Relief Kit Assembly',
        description: 'Assemble first aid boxes, clean drinking water pouches, dry rations, and waterproof tarpaulins for flood-prone low-lying coastal regions.',
        category: 'Disaster support',
        location: 'Central Relief Logistics Warehouse, Chennai',
        isRemote: false,
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        durationHours: 5,
        urgency: 'Urgent',
        requiredVolunteers: 12,
        skillsNeeded: ['Rapid Sorting', 'First Aid Knowledge', 'Logistics'],
        status: 'In Progress',
        createdBy: ngos[2]._id,
        applicants: [
          { user: volunteers[0]._id, status: 'assigned' },
          { user: volunteers[4]._id, status: 'assigned' },
        ],
      },
      {
        title: 'Public Park Wall Mural Painting & Cleanliness Drive',
        description: 'Revitalize a neglected public park with vibrant social awareness murals promoting cleanliness, girls education, and tree protection.',
        category: 'Community service',
        location: 'Shivaji Children Park, Pune',
        isRemote: false,
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        durationHours: 4,
        urgency: 'Low',
        requiredVolunteers: 8,
        skillsNeeded: ['Art / Painting', 'Creativity', 'Team Spirit'],
        status: 'Completed',
        createdBy: ngos[1]._id,
        applicants: [
          { user: volunteers[0]._id, status: 'completed', hoursLogged: 4 },
          { user: volunteers[2]._id, status: 'completed', hoursLogged: 4 },
        ],
        impactSummary: {
          peopleHelped: 400,
          notes: 'Transformed 200 feet of boundary wall with inspiring art, visited by over 400 neighborhood residents daily.',
        },
      },
      {
        title: 'Digital Literacy & Computer Basics for Rural Youth',
        description: 'Conduct interactive computer literacy sessions covering typing, browsing, and safe internet usage for rural high school students.',
        category: 'Education',
        location: 'Rural Community Skill Center, Hoskote',
        isRemote: false,
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        durationHours: 4,
        urgency: 'Medium',
        requiredVolunteers: 4,
        skillsNeeded: ['Basic Computer Skills', 'Communication'],
        status: 'Completed',
        createdBy: ngos[0]._id,
        applicants: [
          { user: volunteers[3]._id, status: 'completed', hoursLogged: 4 },
        ],
        impactSummary: {
          peopleHelped: 65,
          notes: 'Trained 65 rural youth in basic MS Office and web navigation.',
        },
      },
      {
        title: 'Daily Evening Meal Delivery for Homeless Shelters',
        description: 'Pick up surplus freshly cooked meals from partner catering kitchens and deliver hot food containers to three local night shelters.',
        category: 'Food distribution',
        location: 'Shelter Route #4, Central Railway Junction Area, Chennai',
        isRemote: false,
        date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        durationHours: 3,
        urgency: 'High',
        requiredVolunteers: 4,
        skillsNeeded: ['Vehicle / Two-wheeler', 'Punctuality', 'Care'],
        status: 'Completed',
        createdBy: ngos[2]._id,
        applicants: [
          { user: volunteers[4]._id, status: 'completed', hoursLogged: 3 },
        ],
        impactSummary: {
          peopleHelped: 180,
          notes: 'Delivered 180 nutritious meal packets to shelter guests.',
        },
      },
    ];

    await Task.create(tasks);
    console.log(`✅ Created ${tasks.length} sample Tasks across all categories`);

    console.log('✨ Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('Sample Logins for Testing:');
    console.log('NGO Login: asha.foundation@carecircle.org / password123');
    console.log('Volunteer Login: nivasri@carecircle.org / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
