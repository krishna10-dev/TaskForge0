const { Task, Activity, User } = require('../models');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { UserId: req.user.id } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignee, tags } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignee,
      tags,
      UserId: req.user.id,
    });

    // Create Activity for task creation
    const activity = await Activity.create({
      type: 'comment',
      action: 'created a new task',
      target: task.title,
      content: `New objective initialized in project "${task.project}".`,
      metadata: { priority: task.priority, project: task.project },
      UserId: req.user.id
    });

    const activityWithUser = await Activity.findOne({
      where: { id: activity.id },
      include: [{ model: User, attributes: ['id', 'username'] }]
    });

    // Emit via socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_activity', activityWithUser);
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id, UserId: req.user.id } });

    if (task) {
      const oldStatus = task.status;
      await task.update(req.body);
      const newStatus = task.status;

      // Automatically create an Activity if task is marked as 'Done'
      if (oldStatus !== 'Done' && newStatus === 'Done') {
        const activity = await Activity.create({
          type: 'complete',
          action: 'completed the task',
          target: task.title,
          content: `Task in project "${task.project}" is now finalized.`,
          metadata: { priority: task.priority, project: task.project },
          UserId: req.user.id
        });

        const activityWithUser = await Activity.findOne({
          where: { id: activity.id },
          include: [{ model: User, attributes: ['id', 'username'] }]
        });

        // Emit via socket.io
        const io = req.app.get('socketio');
        if (io) {
          io.emit('new_activity', activityWithUser);
        }
      }

      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id, UserId: req.user.id } });

    if (task) {
      await task.destroy();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
