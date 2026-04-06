const sequelize = require('../config/db');
const User = require('./User');
const Task = require('./Task');
const Project = require('./Project');
const Subtask = require('./Subtask');
const Attachment = require('./Attachment');
const Ticket = require('./Ticket');
const Activity = require('./Activity');

// User <-> Task
User.hasMany(Task, { foreignKey: 'UserId' });
Task.belongsTo(User, { foreignKey: 'UserId' });

// User <-> Ticket
User.hasMany(Ticket, { foreignKey: 'UserId' });
Ticket.belongsTo(User, { foreignKey: 'UserId' });

// User <-> Activity
User.hasMany(Activity, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Activity.belongsTo(User, { foreignKey: 'UserId' });

// Project <-> Task (Optional at first, tasks have a string 'project' right now, but we can migrate)
Project.hasMany(Task, { foreignKey: 'ProjectId' });
Task.belongsTo(Project, { foreignKey: 'ProjectId' });

// Task <-> Subtask
Task.hasMany(Subtask, { foreignKey: 'TaskId', onDelete: 'CASCADE' });
Subtask.belongsTo(Task, { foreignKey: 'TaskId' });

// Task <-> Attachment
Task.hasMany(Attachment, { foreignKey: 'TaskId', onDelete: 'CASCADE' });
Attachment.belongsTo(Task, { foreignKey: 'TaskId' });

module.exports = {
  sequelize,
  User,
  Task,
  Project,
  Subtask,
  Attachment,
  Ticket,
  Activity
};