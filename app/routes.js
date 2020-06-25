const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

  require('./routes/1-0/v1.js')(router);
  require('./routes/2-0/v2.js')(router);
  require('./routes/3-0/v3.js')(router);
  require('./routes/4-0/v4.js')(router);
  require('./routes/5-0/v5.js')(router);

module.exports = router
