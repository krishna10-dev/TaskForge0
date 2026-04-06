const sequelize = require('./config/db');
const { User, Task, Activity } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database wiped clean.');

    const admin = await User.create({
      username: 'Marcus Thorne',
      email: 'admin@taskforge.com',
      password: 'password123',
      jobTitle: 'Lead Orchestrator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    });
    console.log('User created: admin@taskforge.com / password123 (ID: ' + admin.id + ')');

    const freshTasks = [
      {
        title: 'Neural Engine API v2.0',
        description: 'Complete the documentation and endpoint testing for the core AI orchestration engine.',
        status: 'In Progress',
        priority: 'High',
        project: 'Core Engine',
        dueDate: new Date(),
        UserId: admin.id
      },
      {
        title: 'Global Asset Load Balancing',
        description: 'Implement round-robin DNS for distributed asset delivery across Tokyo and London nodes.',
        status: 'To Do',
        priority: 'Low',
        project: 'Infrastructure',
        dueDate: new Date(Date.now() + 86400000 * 5),
        UserId: admin.id
      },
      {
        title: 'Design System Typography Audit',
        description: 'Verify kerning and line-heights across all H1-H6 headers for the new brand guidelines.',
        status: 'Done',
        priority: 'Medium',
        project: 'UI Revamp',
        dueDate: new Date(Date.now() - 86400000 * 2),
        UserId: admin.id
      },
      {
        title: 'Refactor Kanban Draggable Logic',
        description: 'Optimize the movement of cards between columns to reduce re-render cycles.',
        status: 'In Progress',
        priority: 'Medium',
        project: 'UI Revamp',
        dueDate: new Date(),
        UserId: admin.id
      },
      {
        title: 'Implement JWT Cookie Auth',
        description: 'Transition from local storage tokens to HttpOnly cookies for enhanced security.',
        status: 'To Do',
        priority: 'High',
        project: 'Security Protocol',
        dueDate: new Date(Date.now() + 86400000 * 1),
        UserId: admin.id
      },
      {
        title: 'Security Audit: Auth Middleware',
        description: 'Perform a full penetration test on the new protect middleware.',
        status: 'Done',
        priority: 'High',
        project: 'Security Protocol',
        dueDate: new Date(Date.now() - 86400000 * 3),
        UserId: admin.id
      },
      {
        title: 'Tokyo Node Latency Optimization',
        description: 'Reduce inter-region latency by 40ms using new edge routing protocols.',
        status: 'Done',
        priority: 'Medium',
        project: 'Infrastructure',
        dueDate: new Date(Date.now() - 86400000 * 1),
        UserId: admin.id
      },
      {
        title: 'Update Internal API v2 Docs',
        description: 'Update the Swagger docs to reflect the new POST endpoints for tasks.',
        status: 'To Do',
        priority: 'Low',
        project: 'Core Engine',
        dueDate: new Date(Date.now() + 86400000 * 7),
        UserId: admin.id
      }
    ];

    // Using a loop to ensure associations are handled correctly by Sequelize
    for (const taskData of freshTasks) {
      await Task.create(taskData);
    }
    console.log('8 fresh tasks added and linked to admin.');

    const freshActivities = [
      {
        type: 'comment',
        action: 'posted an update to',
        target: 'UI Revamp',
        content: '"The typography audit is nearly complete. I am seeing a few minor alignment issues in the H3 headers on mobile views."',
        metadata: { priority: "Urgent", project: "UI Revamp" },
        UserId: admin.id
      },
      {
        type: 'file',
        action: 'attached a file to',
        target: 'Core Engine',
        content: 'Uploaded internal_api_docs_v2.pdf',
        metadata: { 
          fileName: "internal_api_docs_v2.pdf",
          fileSize: "4.8 MB",
          fileType: "pdf",
          fileUrl: "/uploads/dummy.pdf",
          priority: "Medium",
          project: "Core Engine"
        },
        UserId: admin.id
      },
      {
        type: 'complete',
        action: 'completed',
        target: 'Infrastructure Expansion',
        content: 'Successfully optimized Tokyo region node latency by 45ms.',
        metadata: { priority: "High", project: "Infrastructure" },
        UserId: admin.id
      }
    ];

    for (const activityData of freshActivities) {
      await Activity.create(activityData);
    }
    console.log('Fresh activity feed populated and linked to admin.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
