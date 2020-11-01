const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

require('./routes/1-0/v1.js')(router);
require('./routes/2-0/v2.js')(router);
require('./routes/3-0/v3.js')(router);
require('./routes/4-0/v4.js')(router);
require('./routes/5-0/v5.js')(router);
require('./routes/6-0/v6.js')(router);
require('./routes/7-0/v7.js')(router);
require('./routes/8-0/v8.js')(router);
require('./routes/9-0/v9.js')(router);
require('./routes/10-0/v10.js')(router);
require('./routes/mvs/mvs.js')(router);
require('./routes/11-0/v11.js')(router);
require('./routes/12-0/v12.js')(router);
require('./routes/13-0/v13.js')(router);
require('./routes/14-0/v14.js')(router);
require('./routes/15-0/v15.js')(router);

module.exports = router
