const User = require('./models/User');
const sequelize = require('./config/db');

const check = async () => {
  const users = await User.findAll({ attributes: ['email'] });
  console.log('Registered emails:', users.map(u => u.email));
  process.exit();
};

check();
