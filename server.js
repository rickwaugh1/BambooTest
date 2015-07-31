/* global Express */
/* global S */
/* global Async */
/* global _ */
// include additional libraries
_ = require("underscore");
Async = require("async");
S = require("string");

// include the globally available functions and objects
require("./global/logging.js");
require("./global/response.js");
require("./global/utility.js");

// include Express
var Express = require("express");
var server = Express();
var bodyParser = require("body-parser");

//Here we are configuring express to use body-parser as middle-ware.
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

//set up directory to serve view files
server.use(Express.static('./views'));

// translate the api spec into controller calls for Express

var API = require("./config/api").API;

for (var method in API)
{
	var calls = API[method];

	for (var path in calls)
	{
		var endpoint = calls[path].endpoint;
		var check = calls[path].check;

		if (method === "GET")
		{
			server.get(path, check, endpoint);
		}
		else if (method === "POST")
		{
			server.post(path, check, endpoint);
		}
		else if (method === "PUT")
		{
			server.put(path, check, endpoint);
		}
		else if (method === "DELETE")
		{
			server.delete(path, check, endpoint);
		}
	}
}

// begin listening for requests
// Note that the HTTPS option below only works when not using nginx, as you do in beanstalk
// To use SSL in beanstalk with nginx requires that nginx have it's config file set up to accept it.
// We only use this for the production management console, which is not in the same server as
// as the rest server.


server.listen(8081);
console.log("listening on 8081....");
