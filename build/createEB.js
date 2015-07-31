var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var elasticbeanstalk = new AWS.ElasticBeanstalk();

var params = {
  ApplicationName: 'devtestxxx', /* required */
  Description: 'devtestxxx description'
};

elasticbeanstalk.createApplication(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});