/* Required Libraries */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require("fs");

// Always wear your helmet!
const helmet = require('helmet');
router.use(helmet());
router.use(bodyParser.json());
router.use(express.json());
/* ------------------ */

module.exports = router;