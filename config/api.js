function none(request, response, next)
{
	next();
}
// Controller definitions

var TestController = require("../controllers/test_controller");

// Call definitions

exports.API =
{
	"POST":
	{
	},
	"GET":
	{
		"/test":											    {endpoint: TestController.test,										check: none},
	},
	"PUT":
	{
	},
	"DELETE":
	{

	}
}