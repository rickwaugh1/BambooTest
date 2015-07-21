function test(request, response, next)
{
	// var params =
	// {
	// 	"platform" : request.params.platform,
	// 	"version" : request.params.version,
	// };

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
