/* Elastic Beanstalk status checker
   Loops and checks for the status of EB, and fails after a certain time if that status is not found
*/

var statusToCheckFor = process.argv[2];
var applicationName = process.argv[3];
var environmentName = process.argv[4];
var regionName = process.argv[5];
var timeout = process.argv[6];

var AWS = require('aws-sdk');
AWS.config.update({region: regionName});

var params =
{
	ApplicationName: applicationName,
	EnvironmentNames:
	[
	    environmentName
	]
};

var elasticbeanstalk = new AWS.ElasticBeanstalk();

var currentTimeout = 0;

checkEBS();

function checkEBS()
{
	elasticbeanstalk.describeEnvironments(params, function(err, data)
	{
		if (err)
		{
			throw new Error(err.message);
		}
		else
		{
			var environments = data["Environments"];

			var environmentStatus = "";

			environments.forEach(function(environment)
			{
				if (environment["EnvironmentName"] = params["EnvironmentNames"][0])
				{
					environmentStatus = environment["Status"];
				}
			});

			if (environmentStatus != statusToCheckFor && currentTimeout >= timeout)
			{
				throw new Error("Checking for environment status " + statusToCheckFor + " timed out");
			}
			else if (environmentStatus == statusToCheckFor)
			{
				console.log("Status " + statusToCheckFor + " found after " + currentTimeout + " seconds");
			}
			else
			{
				setTimeout(function()
				{
					console.log("Status is " + environmentStatus + " after " + currentTimeout + " seconds");
					currentTimeout++;
					checkEBS();
				}, 1000);
			}
		}
	});
}