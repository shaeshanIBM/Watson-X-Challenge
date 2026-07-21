const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.get('/missing', timesheetController.getMissing);
router.get('/forecast/:employeeId', timesheetController.getForecast);
router.get('/:employeeId', timesheetController.getByEmployee);
router.post('/:employeeId/submit', timesheetController.submit);
router.post('/:employeeId/holiday', timesheetController.addHoliday);

module.exports = router;
