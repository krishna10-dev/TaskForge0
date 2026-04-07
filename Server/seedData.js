const { sequelize, User, Task, Project, Subtask, Attachment, Ticket, Activity } = require('./models');

const seedData = async () => {
  try {
    // Sync database (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('Database synced. Old data cleared.');

    // 1. Create Team Members
    const users = await User.bulkCreate([
      {
        username: 'Krishna',
        email: 'admin@taskforge.com',
        password: 'password123',
        jobTitle: 'Lead Web Architect',
        avatar: 'https://i.pravatar.cc/150?u=krishna'
      },
      {
        username: 'Sarah Chen',
        email: 'sarah@taskforge.com',
        password: 'password123',
        jobTitle: 'Senior UI/UX Designer',
        avatar: 'https://i.pravatar.cc/150?u=sarah'
      },
      {
        username: 'Marcus Thorne',
        email: 'marcus@taskforge.com',
        password: 'password123',
        jobTitle: 'DevOps Engineer',
        avatar: 'https://i.pravatar.cc/150?u=marcus'
      }
    ], { individualHooks: true }); // Ensure password hashing hooks run

    const krishna = users[0];
    const sarah = users[1];
    const marcus = users[2];

    console.log('Team members created: admin@taskforge.com, sarah@taskforge.com, marcus@taskforge.com');

    // 2. Create Projects
    const projects = await Project.bulkCreate([
      {
        name: 'Core Engine v2.0',
        description: 'Next-gen orchestration engine with improved throughput.',
        color: '#497cff'
      },
      {
        name: 'Infrastructure Expansion',
        description: 'Scaling to Asia-Pacific and South American regions.',
        color: '#0c9488'
      },
      {
        name: 'UI Revamp',
        description: 'Glassmorphism and editorial design system implementation.',
        color: '#ba1a1a'
      }
    ]);

    console.log('Projects created.');

    // 3. Create Diverse Tasks with Progress
    const tasks = await Task.bulkCreate([
      // Krishna's Tasks
      {
        title: 'Implement JWT Cookie Auth',
        description: 'Transition from local storage to HttpOnly cookies for security.',
        status: 'In Progress',
        priority: 'High',
        project: 'Core Engine v2.0',
        progress: 45,
        dueDate: new Date(Date.now() + 86400000 * 2),
        UserId: krishna.id,
        ProjectId: projects[0].id
      },
      {
        title: 'Deploy v2.4 to Production',
        description: 'Final production merge of the stable orchestration core.',
        status: 'Done',
        priority: 'High',
        project: 'Core Engine v2.0',
        progress: 100,
        dueDate: new Date(Date.now() - 86400000 * 1),
        UserId: krishna.id,
        ProjectId: projects[0].id
      },
      // Sarah's Tasks (Assigned to her UserId)
      {
        title: 'Design System Typography Audit',
        description: 'Audit all H1-H6 headers for brand consistency.',
        status: 'Done',
        priority: 'Medium',
        project: 'UI Revamp',
        progress: 100,
        dueDate: new Date(Date.now() - 86400000 * 3),
        UserId: sarah.id,
        ProjectId: projects[2].id
      },
      {
        title: 'Create Glassmorphism Components',
        description: 'Build reusable React components with backdrop-filter styles.',
        status: 'In Progress',
        priority: 'High',
        project: 'UI Revamp',
        progress: 75,
        dueDate: new Date(Date.now() + 86400000 * 4),
        UserId: sarah.id,
        ProjectId: projects[2].id
      },
      // Marcus's Tasks
      {
        title: 'Tokyo Node Optimization',
        description: 'Fine-tune edge routing for the new Tokyo data center.',
        status: 'In Progress',
        priority: 'High',
        project: 'Infrastructure Expansion',
        progress: 30,
        dueDate: new Date(Date.now() + 86400000 * 1),
        UserId: marcus.id,
        ProjectId: projects[1].id
      },
      {
        title: 'Wipe Legacy Logs',
        description: 'Clear S3 buckets of logs older than 365 days.',
        status: 'To Do',
        priority: 'Low',
        project: 'Infrastructure Expansion',
        progress: 0,
        dueDate: new Date(Date.now() + 86400000 * 10),
        UserId: marcus.id,
        ProjectId: projects[1].id
      }
    ]);

    console.log('Rich task set created.');

    // 4. Create Attachments (Proof of Work)
    await Attachment.bulkCreate([
      {
        fileName: 'typography-audit-complete.png',
        fileUrl: '/uploads/proof-1.png',
        fileSize: 1024 * 800,
        fileType: 'image/png',
        TaskId: tasks[2].id
      },
      {
        fileName: 'latency-test-results.mp4',
        fileUrl: '/uploads/proof-2.mp4',
        fileSize: 1024 * 1024 * 22,
        fileType: 'video/mp4',
        TaskId: tasks[4].id
      }
    ]);

    // 5. Create Activity Feed (to make dashboard feel alive)
    await Activity.bulkCreate([
      {
        type: 'complete',
        action: 'completed the task',
        target: 'Design System Typography Audit',
        content: 'Finalized typography specs for all breakpoints.',
        UserId: sarah.id
      },
      {
        type: 'comment',
        action: 'updated progress on',
        target: 'Implement JWT Cookie Auth',
        content: 'Halfway through the middleware refactor. Security looks solid.',
        UserId: krishna.id
      },
      {
        type: 'comment',
        action: 'started working on',
        target: 'Tokyo Node Optimization',
        content: 'Latency currently at 85ms. Targeting 40ms.',
        UserId: marcus.id
      }
    ]);

    console.log('Activity feed and attachments populated.');
    console.log('Fresh multi-user dummy data seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
