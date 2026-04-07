const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, uploadTaskProof } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/proof')
  .post(protect, uploadTaskProof);

module.exports = router;
