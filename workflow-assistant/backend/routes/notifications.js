const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:employeeId', notificationController.getByEmployee);
router.patch('/:id/read', notificationController.markRead);
router.patch('/read-all/:employeeId', notificationController.markAllRead);

module.exports = router;
