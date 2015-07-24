module.exports = function (grunt)
{
    	"use strict";

    	grunt.initConfig(
	{
         ebDeploy:
         {
            options:
            {
                application: process.env.applicationName,
                region: process.env.region
            },
            dev:
		  {
                options:
                {
                    environment: process.env.environmentName,
				version: process.env.revision
                },
                files:[
                  {cwd:'../config/',src:['**'],dest:'config/',expand:true},
                  {cwd:'../.ebextensions/',src:['*.config'],dest:'.ebextensions/',expand: true},
                  {cwd:'../controllers/',src:['**'],dest:'controllers/',expand: true},
                  {cwd:'../global/',src:['**'],dest:'global/',expand: true},
                  {cwd:'../',src:['*.json'],dest:'',expand: true},
                  {cwd:'../',src:['*.js'],dest:'',expand: true},
                ]
            }
        },
         replace:
	    {
            beanstalk_config:
		  {
			src: ["../.ebextensions/01BeanstalkSettings.config_dev.sub"],
			dest:["../.ebextensions/01BeanstalkSettings.config"],
			replacements:
			[
				{
					from: "#environment#",
					to: "development"
				},
			]
		  },
            general_json:
		  {
                src: ["../config/general.js.sub"],
                dest:["../config/general.js"],
                replacements:
			 [
	                {
	                    from: "#environment#",
	                    to: "dev"
	                },
	                {
	                    from: "#run_as_cluster#",
	                    to: "true"
	                },
				{
					from: "#winston_logging_level#",
	               	to: "error"
				}
			]
            }
        }
    	});

	grunt.loadNpmTasks("grunt-text-replace");
	grunt.loadNpmTasks('grunt-eb-deploy');

	grunt.registerTask("build", "Create Build and Load to Beanstalk", function()
	{
		grunt.task.run("replace");
		grunt.task.run("ebDeploy");
	});
};
