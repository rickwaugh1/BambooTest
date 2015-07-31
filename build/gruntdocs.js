module.exports = function (grunt)
{
    	"use strict";

    	grunt.initConfig(
	{
         ebDeploy:
         {
            options:
            {
                application: "devAppDoc",
                region: "us-west-2"
            },
            dev:
		  {
                options:
                {
                    environment: "devappdoc",
				version: "1"
                },
                files:[
                  {cwd:'docs/',src:['**'],dest:'',expand:true},
                  {cwd:'docs/.ebextensions/',src:['*.config'],dest:'.ebextensions/',expand: true}
                ]
            }
        },
	   apidoc:
	   {
		  myapp: {
		    src: "../controllers/",
		    dest: "docs/"
		  }
		}
    	});

	grunt.loadNpmTasks("grunt-apidoc");
	grunt.loadNpmTasks('grunt-eb-deploy');

	grunt.registerTask("build", "Create Build and Load to Beanstalk", function()
	{
		grunt.task.run("apidoc");
		grunt.task.run("ebDeploy");
	});
};
