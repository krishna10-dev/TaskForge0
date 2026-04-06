const { Activity, User } = require('../models');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{ model: User, attributes: ['id', 'username'] }], // Can add avatar if it exists
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const { type, action, target, content, metadata } = req.body;
    const newActivity = await Activity.create({
      type,
      action,
      target,
      content,
      metadata,
      UserId: req.user.id
    });
    
    const activityWithUser = await Activity.findOne({
      where: { id: newActivity.id },
      include: [{ model: User, attributes: ['id', 'username'] }]
    });

    // Emit via socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_activity', activityWithUser);
    }

    res.status(201).json(activityWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
