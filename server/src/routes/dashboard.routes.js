const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

router.get('/stats', authenticateToken, getDashboardStats);

module.exports = router;
