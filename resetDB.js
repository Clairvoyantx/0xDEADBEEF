/**
 * This script will reset the local MongoDB database on this machine.
 * Note: The 'local_database_name' variable should match its corresponding
 * value in app.js - a different database will be initialized otherwise.
 */
var mongoose = require('mongoose');
var models = require('./models');

var localHost = true;   // Flag to test on local machine.

// Create two URIs, one for the local machine, and the other for Heroku.
var localDatabaseURI = "mongodb://localhost/dejamoo";
var herokuDatabaseURI = (localHost) ? null : "mongodb://dejamoo:0xDEADBEEF@ds153719.mlab.com:53719/heroku_wv684s23";

mongoose.connect(herokuDatabaseURI || localDatabaseURI);

// Step 1: load the JSON data
var markersJSON = [{
        "topic": "Pizza Hut",
        "type": "Food",
        "numComments": 0,
        "lat": 32.8698645954428,
        "lng": -117.22189486026764,
        "date": new Date("11/20/2014 04:11")
    },
    {
        "topic": "Geisel 1st Floor",
        "type": "Event",
        "numComments": 0,
        "lat": 32.8799645954428,
        "lng": -117.22199486026761,
        "date": new Date("11/20/2014 04:11")
    }
];

// Step 2: Remove all existing documents.
models.ModelComment
    .find()
    .remove()
    .exec(insertComment);
models.ModelMarker
    .find()
    .remove()
    .exec(loadData);

/**
 * Inits some comments and saves them to the database, which should be empty.
 * @param {object} err - If it is not null, then an error has occurred in
 *      the execution of clearComment.
 */
function insertComment(err) {
    if (err) {
        console.log(err);
    }

    var newCommentA = new models.ModelComment({
        "content": "It's great",
        "score": 0,
        "index": 0,
        "lat": 32.8698645954428,
        "lng": -117.22189486026764,
        "date": new Date("11/20/2014 04:11")
    });
    newCommentA.save();

    var newCommentB = new models.ModelComment({
        "content": "Amazing",
        "score": 0,
        "index": 0,
        "lat": 32.8698645954428,
        "lng": -117.22189486026764,
        "date": new Date("11/20/2014 04:11")
    });
    newCommentB.save();
}

// Step 3: load the data from the JSON file

/**
 * Loads and stores data into the database.
 * @param {object} err - If it is not null, then an error has occurred in
 *      the execution of loadData;
 */
function loadData(err) {
    if (err) {
        console.log(err);
    }

    // Loop over markers, construct and save an object for each one.
    for(var i = 0; i < markersJSON.length; ++i) {
        var markerContent = markersJSON[i];
        var markerModel = new models.ModelMarker(markerContent);

        markerModel.save(function(markerError) {
            if(markerError) {
                console.log(markerError);
            }
        });
    }
    mongoose.connection.close();
}