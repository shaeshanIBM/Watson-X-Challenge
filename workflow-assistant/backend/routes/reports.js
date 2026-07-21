const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/manager/:managerId/weekly', reportController.getWeeklyReport);
router.get('/manager/:managerId/vacations', reportController.getUpcomingVacations);
router.get('/manager/:managerId/training-compliance', reportController.getTrainingCompliance);

module.exports = router;
