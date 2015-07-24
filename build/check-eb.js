var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

var params =
{
	ApplicationName: 'devtest',
	EnvironmentNames:
	[
	    'devtestx'
	]
};

var elasticbeanstalk = new AWS.ElasticBeanstalk();

var timeout = (1000 * 60 * 10);

var currentTimeout = 0;

checkEBS();

function checkEBS()
{
	elasticbeanstalk.describeEnvironments(params, function(err, data)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			var environments = data["Environments"];

			var environmentStatus = "Not Ready";

			environments.forEach(function(environment)
			{
				if (environment["EnvironmentName"] = params["EnvironmentNames"][0])
				{
					environmentStatus = environment["Status"];
				}
			});

			if (environmentStatus != "Ready" && currentTimeout >= timeout)
			{
				console.log("this puppy is broken");
			}
			else if (environmentStatus == "Ready")
			{
				console.log("It's good");
			}
			else
			{
				console.log("Status is " + environmentStatus + " timeout is at " + currentTimeout);
				setTimeout(function()
				{
					currentTimeout = currentTimeout + 1000;
					checkEBS();
				}, 1000);
			}
		}
	});
}