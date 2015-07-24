/*
    Mocha test suite for RX Networks API

    This script can be run locally, and calls the APIs on the target dev server.
    It requires mocha, and the should test framework, the request module.
    npm install should
    npm install mocha
    npm install request
    npm install assert

    It is run from the root directory of the application, with the command "mocha"
    (Commented out, as user is being deleted at the end. )it connectst to the mongo database, and deletes existing users.
    It calls the APIs, and tests the responses.
    Note that this is set up to run one at a time, in order. This requires the passing of the "done" function
    in to each test, and it"s being called at the end.

    Note: The tests affect what is going on later. For instance, after duplicating a node, we are adding the info about that
    node to the arrays of nodes and test_nodes that we use later.

    Note: This script does not call any APIs that write back to the services.

    To run the test: mocha -R spec
    Replace the tokens/id placeholders at the top of the script with current information. You need all three services.
*/

var request = require("request");
var assert = require("assert");
var should = require("should");
var j = request.jar();
var request = request.defaults({jar:j});

var url="http://devtestx.elasticbeanstalk.com";

var header_string = {"authorization": "Basic ZmZ1c2VyOmdnTm9yYkAh"};

describe("API Test for RX Networks API", function()
{

    // Following not needed now that we can delete the account at the end.
    // before(function(done)
    // {
        // MongoClient.connect(MongoConnectStringESP, function(err, db)
        // {
        //     if(err)
        //     {
        //         console.log('error on connect to Mongo for data ' + err.message);
        //     }

        //     else
        //     {
        //         db.collection("users").remove({},function(err,numberRemoved)
        //         {
        //             console.log("Removed users: " + numberRemoved);

        //             db.collection("articles").remove({},function(err,articlesRemoved)
        //             {
        //                 console.log("Removed articles: " + articlesRemoved);
        //                 db.close();
        //                 done();
        //             });
        //         });
        //     }
        // });

        // MongoClient.connect(MongoConnectStringSES, function(err, db)
        // {
          //   if(err)
          //   {
          //       console.log('error on connect to Mongo for sessions ' + err.message);
          //   }

          //   else
          //   {
          //       db.collection("sessions").remove({},function(err,numberRemoved)
          //       {
          //           console.log("Removed Sessions: " + numberRemoved);
          //           db.close();
          //           done();
          //       });
          //   }
        // });
    // });

    describe("GET /test", function()
    {
        it("Get test", function(done)
        {
            var calling_url = url + "/test";

            this.timeout(1000000);

            request(
            {
                timeout: 1000000,
                method: "GET",
                uri:calling_url,
                headers:header_string,
                json: true
            },
            function(err,resp,body)
            {
                body.status.should.equal("OK");
                assert(!err);
                done();
            });
        });
    });

});