/* Elastic Beanstalk status checker
   Loops and checks for the status of EB, and fails after a certain time if that status is not found
*/

var applicationName = process.argv[2];
var environmentName = process.argv[3];
var regionName = process.argv[4];

var AWS = require('aws-sdk');
AWS.config.update({region: regionName});

var applicationParams = {
  ApplicationName: applicationName
};

var environmentParams =
{
	ApplicationName: applicationName, /* required */
	EnvironmentName: environmentName, /* required */
	VersionLabel: 'initial',
	SolutionStackName: "64bit Amazon Linux 2015.03 v1.4.4 running Node.js",
	CNAMEPrefix: applicationName,
	Tier:
	{
		Version: " ",
		Type: "Standard",
		Name: "WebServer"
  	},
	OptionSettings:
	[
		{
			Namespace: 'aws:elasticbeanstalk:environment',
			OptionName: 'EnvironmentType',
			ResourceName: 'EType',
			Value: 'SingleInstance'
		},
		{
			Namespace: 'aws:autoscaling:launchconfiguration',
			OptionName: 'EC2KeyName',
			ResourceName: 'KeyPair',
			Value: 'FF-West-2'
		},
		{
			Namespace: 'aws:autoscaling:launchconfiguration',
			OptionName: 'IamInstanceProfile',
			ResourceName: 'IAMP',
			Value: 'aws-elasticbeanstalk-ec2-role'
		},
		{
			Namespace: 'aws:autoscaling:launchconfiguration',
			OptionName: 'InstanceType',
			ResourceName: 'IType',
			Value: 't1.micro'
		}
	],
 };

var versionParams =
{
	ApplicationName: applicationName, /* required */
	VersionLabel: 'initial', /* required */
	AutoCreateApplication: true,
	SourceBundle:
	{
		S3Bucket: 'beanstalk-test-ff',
		S3Key: 'RickBambooTestApp.zip'
	}
};

var elasticbeanstalk = new AWS.ElasticBeanstalk();

elasticbeanstalk.createApplication(applicationParams, function(err, data)
{
	console.log('Creating application');
	console.log(data);
	if (err) console.log(err, err.stack); // an error occurred
	else
	{
		elasticbeanstalk.createApplicationVersion(versionParams, function(err, data)
		{
			console.log('Creating application version....');
			console.log(data);
			if (err) console.log(err, err.stack); // an error occurred

			else
			{
				elasticbeanstalk.createEnvironment(environmentParams, function(err, data)
				{
					console.log('Creating application environment....');
					console.log(data);
					if (err) console.log(err, err.stack); // an error occurred

				});
			}
		});
	}
});