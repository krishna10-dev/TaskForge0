const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const masterSeed = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error(`Error: User ${email} not found. Please sign up first.`);
      process.exit(1);
    }

    // 1. Clear existing tasks
    await Task.destroy({ where: { UserId: user.id } });
    console.log(`Wiped data for ${email}. Creating fresh synchronized ecosystem...`);

    // 2. Define the Synchronized Task Set
    const tasks = [
      // Project: Infrastructure Expansion
      {
        title: 'Upgrade Tokyo Node Latency',
        description: 'Reduce inter-region latency by 40ms using new edge routing protocols.',
        status: 'In Progress',
        priority: 'High',
        project: 'Infrastructure Expansion',
        dueDate: new Date(),
        UserId: user.id
      },
      {
        title: 'Global Asset Load Balancing',
        description: 'Implement round-robin DNS for distributed asset delivery.',
        status: 'To Do',
        priority: 'Low',
        project: 'Infrastructure Expansion',
        dueDate: new Date(Date.now() + 86400000 * 5),
        UserId: user.id
      },
      // Project: Precision UI Revamp
      {
        title: 'Design System Typography Audit',
        description: 'Verify kerning and line-heights across all H1-H6 headers for the new brand guidelines.',
        status: 'Done',
        priority: 'Medium',
        project: 'Precision UI Revamp',
        dueDate: new Date(Date.now() - 86400000 * 2),
        UserId: user.id
      },
      {
        title: 'Refactor Kanban Draggable Logic',
        description: 'Optimize the movement of cards between columns to reduce re-render cycles.',
        status: 'In Progress',
        priority: 'Medium',
        project: 'Precision UI Revamp',
        dueDate: new Date(),
        UserId: user.id
      },
      // Project: Core Engine API
      {
        title: 'Implement JWT Cookie Auth',
        description: 'Transition from local storage tokens to HttpOnly cookies for enhanced security.',
        status: 'To Do',
        priority: 'High',
        project: 'Core Engine API',
        dueDate: new Date(Date.now() + 86400000 * 1),
        UserId: user.id
      },
      {
        title: 'Deploy v2.4 to Production',
        description: 'Final merge of the orchestration engine update to the main production branch.',
        status: 'Done',
        priority: 'High',
        project: 'Core Engine API',
        dueDate: new Date(Date.now() - 86400000 * 1),
        UserId: user.id
      },
      {
        title: 'Documentation: Internal API v2',
        description: 'Update the Swagger docs to reflect the new POST endpoints for tasks.',
        status: 'To Do',
        priority: 'Low',
        project: 'Core Engine API',
        dueDate: new Date(Date.now() + 86400000 * 7),
        UserId: user.id
      },
      // Project: Security Protocol 2.0
      {
        title: 'Penetration Test: Auth Middleware',
        description: 'Verify that the new protect middleware correctly blocks unauthorized access.',
        status: 'Done',
        priority: 'Medium',
        project: 'Security Protocol 2.0',
        dueDate: new Date(Date.now() - 86400000 * 3),
        UserId: user.id
      }
    ];

    await Task.bulkCreate(tasks);
    console.log('Master data populated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.error('Provide email.');
  process.exit(1);
}
masterSeed(email);
