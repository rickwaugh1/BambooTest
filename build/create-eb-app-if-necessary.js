/* Elastic Beanstalk status checker
   Loops and checks for the status of EB, and fails after a certain time if that status is not found
*/

var applicationName = process.argv[2];
var regionName = process.argv[3];

var AWS = require('aws-sdk');
AWS.config.update({region: regionName});

var params =
{
	ApplicationName: applicationName,
};

var elasticbeanstalk = new AWS.ElasticBeanstalk();

elasticbeanstalk.createApplication(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});