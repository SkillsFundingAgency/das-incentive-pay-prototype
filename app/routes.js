const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// V1
  require('./routes/1-0/v1.js')(router);

module.exports = router
