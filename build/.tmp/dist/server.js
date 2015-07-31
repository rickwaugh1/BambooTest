// include Express
Express = require("express");

var server = Express();

//set up directory to serve documents files
server.use(Express.static('./'));
server.listen(8081);
console.log("info", "Environment listening on 8081...");