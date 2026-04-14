const express = require('express');
const { fetchUserData } = require('./user-data.controller');
const asyncHandler = require('../middleware/asyncHandler');
const { StatusCodes } = require('http-status-codes');
const router = express.Router();

router.get('/api/profiles', asyncHandler(fetchUserData));

// router.get('/health', (req, res) => {
//     res.status(StatusCodes.OK).send('Server is up and running!');
// })


module.exports = router;