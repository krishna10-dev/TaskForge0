const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const seedUserDatabase = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error(`Error: User with email ${email} not found. Please sign up first.`);
      process.exit(1);
    }

    // Clear existing tasks for THIS user only
    await Task.destroy({ where: { UserId: user.id } });
    console.log(`Cleared existing tasks for ${email}`);

    // Define dummy tasks for YOUR account
    const dummyTasks = [
      {
        title: 'Finalize Neural Engine API',
        description: 'Complete the documentation and endpoint testing for the core AI orchestration engine.',
        status: 'In Progress',
        priority: 'High',
        project: 'Precision Engine',
        dueDate: new Date(),
        UserId: user.id
      },
      {
        title: 'Redesign Login Architecture',
        description: 'Move from local storage to secure cookie-based session handling.',
        status: 'To Do',
        priority: 'Medium',
        project: 'Backend Orchestration',
        dueDate: new Date(Date.now() + 86400000 * 2),
        UserId: user.id
      },
      {
        title: 'Legacy Node Migration',
        description: 'Migrate all remaining nodes from v2 to v4 infrastructure.',
        status: 'To Do',
        priority: 'Low',
        project: 'Design System UI',
        dueDate: new Date(Date.now() + 86400000 * 5),
        UserId: user.id
      },
      {
        title: 'Initial Research & Moodboard',
        description: 'Gather references for the editorial precision design language.',
        status: 'Done',
        priority: 'Medium',
        project: 'Design System UI',
        dueDate: new Date(Date.now() - 86400000 * 1),
        UserId: user.id
      },
      {
        title: 'Edge Device Optimization',
        description: 'Reduce binary size for ARM-based edge deployments.',
        status: 'In Progress',
        priority: 'High',
        project: 'Precision Engine',
        dueDate: new Date(),
        UserId: user.id
      },
      {
        title: 'Security Audit v1.0',
        description: 'Perform a full penetration test on the auth middleware.',
        status: 'Done',
        priority: 'High',
        project: 'Backend Orchestration',
        dueDate: new Date(Date.now() - 86400000 * 3),
        UserId: user.id
      },
      {
        title: 'Update Global Scale expansion docs',
        description: 'Add EMEA and APAC regional data to the master document.',
        status: 'To Do',
        priority: 'Low',
        project: 'Market Integration',
        dueDate: new Date(Date.now() + 86400000 * 10),
        UserId: user.id
      },
      {
        title: 'Fix Latency Spikes in APAC',
        description: 'Investigate the recent 200ms jump in Tokyo region nodes.',
        status: 'To Do',
        priority: 'High',
        project: 'Market Integration',
        dueDate: new Date(),
        UserId: user.id
      }
    ];

    await Task.bulkCreate(dummyTasks);
    console.log(`Successfully added 8 dummy tasks to ${email}'s dashboard.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user database:', error);
    process.exit(1);
  }
};

const emailArg = process.argv[2];
if (!emailArg) {
  console.error('Please provide an email address.');
  process.exit(1);
}

seedUserDatabase(emailArg);
