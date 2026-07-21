const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAll);
router.get('/manager/:managerId', employeeController.getByManager);
router.get('/:id', employeeController.getById);

module.exports = router;
