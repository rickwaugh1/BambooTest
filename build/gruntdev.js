module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
         ebDeploy:
         {
            options:
            {
                application: 'devtest',
                profile: "default",
                region: "us-west-2"
            },
            dev: {
                options:
                {
                    environment: 'devtestx'
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
         replace: {
            beanstalk_config: {
                src: ["../.ebextensions/01BeanstalkSettings.config_dev.sub"],
                dest:["../.ebextensions/01BeanstalkSettings.config"],
                replacements: [
                {
                    from: "#environment#",
                    to: "development"
                },
            ]},
            general_json: {
                src: ["../config/general.js.sub"],
                dest:["../config/general.js"],
                replacements: [
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
				}]
            }
        }
    });


    grunt.loadNpmTasks("grunt-text-replace");
    //grunt.loadNpmTasks("grunt-zip");
   // grunt.loadNpmTasks('grunt-awsebtdeploy');
    grunt.loadNpmTasks('grunt-eb-deploy');

    /**
     * Build Project
     * grunt build will create a copy of the application, cleaned and zipped and ready for elastic bean stalk
     * Check out the build direcotry into it"s own directory.
     * Go to the build directory.
     * Edit the grunt file of the release you are building, (dev, prod, etc.)
     * You will need to change the parameters at the top of the file to match your environment. In particular, you"ll need to specify
     * the repository URL where the version you wish to promote resides.
     * Enter the command grunt build --gruntfile gruntdev.js (for dev)
     * This will:
     * Clean up old directories.
     * Create /var/codeBase.
     * Create /var/codeBaseClean.
     * Check out the branch you specified into /var/codeBase.
     * Change all the parameter files, (they are set up as config.js.sub,) then save these changes over top of the existing parameter files.
     * Rsync the updated code to /var/codeBaseClean/codeBase, cleaning out all unneccassery files.
     * Create the zip file with the name specified above, in the /var/codeBaseClean/codeBase directory.
     * You can test your application in the /var/codeBaseClean/codeBase directory, to make sure it"s working correctly.
     * You can then upload the zip file into elastic beanstalk.
     */

    grunt.registerTask("build", "Create Build Zip File", function() {

        grunt.task.run("replace");
        //grunt.task.run("zip");
        //grunt.task.run("awsebtdeploy");
        grunt.task.run("ebDeploy");

    });
};
