const sequelize = require('./config/db');
const User = require('./models/User');
const Activity = require('./models/Activity');

const seedActivities = async () => {
  try {
    await sequelize.sync();
    const user = await User.findOne({ where: { email: 'admin@taskforge.com' } });

    if (!user) {
      console.log('No user found to seed activities for.');
      process.exit(1);
    }

    await Activity.destroy({ where: {} });

    const activities = [
      {
        type: 'comment',
        action: 'commented on',
        target: 'Precision UI Revamp',
        content: '"The typography audit is nearly complete. I am seeing a few minor alignment issues in the H3 headers on mobile views."',
        metadata: { priority: "Urgent" },
        UserId: user.id
      },
      {
        type: 'file',
        action: 'attached a file to',
        target: 'Core Engine API',
        content: 'Uploaded internal_api_docs_v2.pdf',
        metadata: { 
          fileName: "internal_api_docs_v2.pdf",
          fileSize: "4.8 MB",
          fileType: "pdf",
          fileUrl: "/uploads/dummy.pdf",
          priority: "Medium"
        },
        UserId: user.id
      },
      {
        type: 'complete',
        action: 'completed',
        target: 'Infrastructure Expansion',
        content: 'Successfully optimized Tokyo region node latency by 45ms.',
        metadata: { priority: "High" },
        UserId: user.id
      }
    ];

    await Activity.bulkCreate(activities);
    console.log('Dummy activities populated successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedActivities();
