define({ "api": [  {    "type": "get",    "url": "/test/:id",    "title": "Request test information",    "name": "GetUser",    "group": "Test",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>Number</p> ",            "optional": false,            "field": "id",            "description": "<p>Users unique ID.</p> "          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "firstname",            "description": "<p>Firstname of the Test.</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "lastname",            "description": "<p>Lastname of the TEst.</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "../controllers/test_controller.js",    "groupTitle": "Test"  },  {    "type": "post",    "url": "/test",    "title": "Request User information",    "name": "PostUser",    "group": "User",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>Number</p> ",            "optional": false,            "field": "testName",            "description": "<p>test name.</p> "          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "TestStatus",            "description": "<p>Status of the Test.</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "../controllers/test_controller.js",    "groupTitle": "User"  }] });