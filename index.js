const winston = require('winston');
const express = require('express');
const app = express();

app.use(function(req, res, next) 
{ res.header("Access-Control-Allow-Origin", "*"); 
res.header("Access-Control-Allow-Headers", "*"); 
next(); });

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;