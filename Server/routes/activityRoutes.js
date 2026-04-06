const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, activityController.getActivities)
  .post(protect, activityController.createActivity);

module.exports = router;
