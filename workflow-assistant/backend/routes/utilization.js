const express = require('express');
const router = express.Router();
const utilizationController = require('../controllers/utilizationController');

router.get('/team/:managerId', utilizationController.getTeam);
router.get('/forecast/:employeeId', utilizationController.getForecast);
router.get('/:employeeId', utilizationController.getByEmployee);

module.exports = router;
