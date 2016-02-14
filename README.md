# An API built to show off hapi.js

___PLEASE NOTE: in Feb 2016 `hapi-swagger` updated the version of swagger-ui used and increased the options that are available. To do this the code for custom pages was changed. Please make sure you have
the latest version of this project and if you are using custom pages in your own project you update all the code as per the Readme on the [hapi-swagger](https://github.com/glennjones/hapi-swagger) repo.___

This web API was built to demonstrate some of the [hapi](hapijs.com) features and functionality. It was part of a talk given at [Asyncjs](http://asyncjs.com/be-more-hapi/) on the 10 October 2013.
The API is a simple calculator that allows you to add, subtract, divide or multiple two numbers. To demonstrate a more common set of API calls I also added methods to store sums into a mongodb database.

## hapi-swagger
The project makes use of a hapi.js plugin [hapi-swagger](https://github.com/glennjones/hapi-swagger) which self documents the API using the [Swagger UI](https://github.com/wordnik/swagger-ui) interface. It provides simple forms which developers can use to quickly interact with your API and learn how it works. The forms and documentation are built from the standard hapi.js routes object.


## Install
You first need to install [node.js](http://nodejs.org/) and [mongodb](http://www.mongodb.org/downloads) if you do not already have them on your computer. Then download the code from github:
```
    $ git clone https://github.com/glennjones/be-more-hapi.git
```
or
```
    $ curl -L https://github.com/glennjones/be-more-hapi/tarball/master | tar zx
```


## Run

1. Move into the project directory `$ cd be-more-hapi`
2. Run `$ npm install`
3. Start the mongodb server `$ mongod`
4. Run `$ node bin/be-more-hapi`
5. Connect to the server using `http://localhost:3003`


## Example of using tags to show a subset of an API
HAPI-Swagger plugin allows you [tag](https://github.com/glennjones/hapi-swagger#tagging-your-api-routes) API enpoints into groups that can be displayed independently. The reduced example page [http://localhost:3000/reduced](http://localhost:3000/reduced) demostrates this.


## Sums
All the sum endpoints are http PUT requests. Where the two numbers are the last two fragments of the URL:

    http://localhost:3000/sum/multiple/5/6

If the sum is completed without error the response is also a simple format:
```javascript
    {
        "equals": 30
    }
```

## Errors

The error format always has 3 properties; code, error and message. There is an optional fourth property validation which is added if the input is in the incorrect format.
```javascript
    {
      	"code": 400,
  		"error": "Bad Request",
  		"message": "the value of b must be a number",
  		"validation": {
    		"source": "path",
    		"keys": [
      		"b"
    		]
  		}
	}
```


## Mocha integration test
The project has example integration and unit tests. To run the test within the project type the following command
```
    $ mocha --reporter list
```


