const { sequelize, User, Task, Project, Subtask, Attachment, Ticket, Activity } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Sync database (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('Database synced. Old data cleared.');

    // 1. Create the Primary User (Krishna)
    const adminUser = await User.create({
      username: 'Krishna',
      email: 'admin@taskforge.com',
      password: 'password123',
      jobTitle: 'WebDeveloper',
      avatar: '' // "no profile photo"
    });

    console.log('Admin user created: admin@taskforge.com');

    // 2. Create Projects
    const projects = await Project.bulkCreate([
      {
        name: 'TaskForge Core',
        description: 'Main development for the TaskForge platform.',
        color: '#497cff'
      },
      {
        name: 'Personal Website',
        description: 'Portfolio and personal branding projects.',
        color: '#ff9800'
      }
    ]);

    console.log('Projects created.');

    // 3. Create Dummy Tasks for Krishna
    const tasks = await Task.bulkCreate([
      {
        title: 'Complete Database Seeding',
        description: 'Implement a robust seeding script for local development.',
        status: 'Done',
        priority: 'High',
        project: 'TaskForge Core',
        dueDate: new Date(),
        UserId: adminUser.id,
        ProjectId: projects[0].id
      },
      {
        title: 'Optimize React Components',
        description: 'Refactor the dashboard for better performance and reactivity.',
        status: 'In Progress',
        priority: 'Medium',
        project: 'TaskForge Core',
        dueDate: new Date(Date.now() + 86400000 * 2),
        UserId: adminUser.id,
        ProjectId: projects[0].id
      },
      {
        title: 'Update Portfolio Theme',
        description: 'Transition to a modern editorial design style.',
        status: 'To Do',
        priority: 'Low',
        project: 'Personal Website',
        dueDate: new Date(Date.now() + 86400000 * 7),
        UserId: adminUser.id,
        ProjectId: projects[1].id
      },
      {
        title: 'Integrate Socket.io',
        description: 'Add real-time notifications for task updates.',
        status: 'To Do',
        priority: 'High',
        project: 'TaskForge Core',
        dueDate: new Date(Date.now() + 86400000 * 3),
        UserId: adminUser.id,
        ProjectId: projects[0].id
      }
    ]);

    console.log('Dummy tasks created.');

    // 4. Create Subtasks for the active task
    await Subtask.bulkCreate([
      {
        title: 'Identify slow renders',
        isCompleted: true,
        TaskId: tasks[1].id
      },
      {
        title: 'Implement React.memo',
        isCompleted: false,
        TaskId: tasks[1].id
      }
    ]);

    // 5. Create some initial activity
    await Activity.bulkCreate([
      {
        type: 'complete',
        action: 'completed',
        target: 'Complete Database Seeding',
        content: 'Database is now fully seeded with fresh data.',
        UserId: adminUser.id
      }
    ]);

    console.log('Fresh dummy data seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
