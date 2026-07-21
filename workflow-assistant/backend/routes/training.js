const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

router.get('/overdue/all', trainingController.getAllOverdue);
router.get('/:employeeId', trainingController.getByEmployee);
router.patch('/:employeeId/:courseId/progress', trainingController.updateProgress);

module.exports = router;
