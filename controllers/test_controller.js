inspect = require('eyes').inspector({maxLength:75000});
/**
 * @api {get} /test/:id Request test information
 * @apiName GetUser
 * @apiGroup Test
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the Test.
 * @apiSuccess {String} lastname  Lastname of the TEst.
 */
function test(request, response, next)
{

	var params =
	{
		"test" : request.body.test
	};

	inspect(params);

	var test_arr = [];

	for (var x=0;x<10;x++)
	{
		var testit_label = {};
		testit_label.label = 'Test' + x;
		test_arr.push(testit_label);
	}

	respond(null,test_arr);

	function respond(err, data)
	{
		respond_to_HTTP_request(response, err, data);
	}
}
exports.test = test;

/**
 * @api {post} /test Request User information
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam {Number} testName test name.
 *
 * @apiSuccess {String} TestStatus Status of the Test.
 */
function test2(request, response, next)
{
	// var params =
	// {
	// 	"platform" : request.params.platform,
	// 	"version" : request.params.version,
	// };

	var test_arr = [];
}
exports.test2 = test2;
