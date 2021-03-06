var models = require('../models');

/**
 * Used to render index.handlebar.
 */
exports.view = function(req, res) {
    res.render('index');
};

/************************* DATABASE GET FUNCTIONS START ***********************/

/**
 * GET function: Obtains all markers in database.
 * @param {object} req - The GET request.
 * @param {object} res - The resulting markers.
 */
exports.getMarkers = function(req, res) {
    models.ModelMarker
        .find()
        .exec(function(err, markers) {
            if (err) {
                console.log(err);
                res.send(400);
            } else {
                res.send(markers);
            }
        });
};

/************************** DATABASE GET FUNCTIONS END ************************/


/************************ DATABASE POST FUNCTIONS START ***********************/

/**
 * POST function: Obtains a specific marker in the datebase.
 * @param {object} req - The POST request.
 * @param {object} res - The resulting marker.
 */
exports.getMarker = function(req, res) {
    models.ModelMarker
        .find({
            lat: req.body.lat,
            lng: req.body.lng
        })
        .exec(function(err, marker) {
            if (err) {
                console.log(err);
                res.send(400);
            } else {
                res.send(marker);
            }
        });
};

/**
 * POST function: Obtains all markers of a certain type.
 * @param {object} req - Contains the type.
 * @param {object} res - The resulting markers of that type.
 */
 exports.getMarkersByType = function(req, res) {
     models.ModelMarker
         .find({
             type: req.body.type
         })
         .exec(function(err, markers) {
             if (err) {
                 console.log(err);
                 res.send(400);
             } else {
                 res.send(markers);
             }
         });
 };

/**
 * POST function: Grabs all comments at a certain coordinate location.
 * @param {object} req - The location of the comments.
 * @param {object} res - The comments found in the database.
 */
exports.getComments = function(req, res) {
    models.ModelComment
        .find({
            lat: req.body.lat,
            lng: req.body.lng
        })
        .exec(function(err, comments) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(comments);
            }
        });
};

/**
 * POST function: Grabs all comments at a certain coordinate location.
 * @param {object} req - The location of the comments.
 * @param {object} res - The comments found in the database.
 */
exports.getCommentsSorted = function(req, res) {
    models.ModelComment
        .find({
            lat: req.body.lat,
            lng: req.body.lng
        })
        .sort('-score')
        .exec(function(err, comments) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(comments);
            }
        });
};

/**
 * POST function: Updates the marker's number of commnets
 * @param {object} req - The number of comments.
 * @param {object} res - Should be null
 */

 exports.updateNumComments = function(req, res) {
    models.ModelMarker
        .find({
            lat: req.body.lat,
            lng: req.body.lng
        })
        .update({
            numComments: req.body.numComments
        })
        .exec(function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.end()
            }
        })
 }

/**
 * POST function: Gets a specific comment at a certain location.
 * @param {object} req - The location, contents, score, and date of creation of the comment.
 * @param {object} res - The comment found in the database.
 */
exports.getComment = function(req, res) {
    models.ModelComment
        .find({
            index: req.body.index,
            lat: req.body.lat,
            lng: req.body.lng
        })
        .exec(function(err, comment) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(comment);
            }
        });
};

/**
 * POST function: Used to save a marker that was placed on the map.
 * @param {object} req - The information to be stored in the database.
 * @param {object} res - The result of the POST request.
 */
exports.addMarker = function(req, res) {
    var newMarker = new models.ModelMarker({
        topic: req.body.topic,
        type: req.body.type,
        numComments: req.body.numComments,
        lat: req.body.lat,
        lng: req.body.lng,
        date: req.body.date,
        userID: req.body.userID,
        expireDate: req.body.expireDate
    })

    // Save marker document to the database.
    newMarker.save(function(err) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.redirect('/');
            res.end();
        }
    });
};

/**
 * POST request: Deletes a marker at a specified coordinate point.
 * @param {object} req - Contains the latitude and longtitude coordinates.
 * @param {object} res - Should be empty if the deletion was successful.
 */
exports.deleteMarker = function(req, res) {
    models.ModelMarker
        .find({
            lat: req.body.lat,
            lng: req.body.lng
        })
        .remove()
        .exec(function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            }
            res.end();
        });
};

/**
 * POST request: Updates the comment score.
 * @param {object} req - Contains info on the comment to update.
 * @param {object} res - The result of the post request.
 */
exports.updateScore = function(req, res) {
    models.ModelComment
        .find({
            index: req.body.index,
            lat: req.body.lat,
            lng: req.body.lng
        })
        .update({
            score: req.body.score
        })
        .exec(function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            }
            res.end();
        });
};

/**
 * POST request: Saves an added comment to the database.
 * @param {object} req - The details of the comment.
 * @param {object} res - Should be empty if successful.
 */
exports.addComment = function(req, res) {
    var newComment = new models.ModelComment({
        content: req.body.content,
        score: req.body.score,
        index: req.body.index,
        lat: req.body.lat,
        lng: req.body.lng,
        date: req.body.date
    });

    models.ModelMarker
        .find({
            lat: req.body.lat,
            lng: req.body.lng
        })
        .update({
            numComments: req.body.numComments
        });

    newComment.save(function(err) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.redirect('/');
            res.end();
        }
    });
};

/**
 * POST request: Saves an added user to the database
 * @param {object} req - The details of the user.
 * @param {object} res - Should be empty if successful.
 */

exports.addUser = function(req, res) {
    var newUser = new models.ModelUser({
        username: req.body.username,
        password: req.body.password
    });

    // Save user document to the database.
    newUser.save(function(err) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.redirect('/');
            res.end();
        }
    });
};

/**
 * POST request: Gets username from database
 * @param {object} req - The username
 * @param {object} res - Should contain the user if successful
 */

exports.getUser = function(req, res) {
    models.ModelUser
        .find({
            username: req.body.username
        })
        .exec(function(err, user) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(user);
            }
        });
};

/**
 * POST request: Attempts user login given username and password
 * @param {object} req - The details of the user.
 * @param {object} res - Should contain user if successful
 */

exports.login = function(req, res) {
    models.ModelUser
        .find({
            username: req.body.username,
            password: req.body.password
        })
        .exec(function(err, user) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(user);
            }
        });
};

/**
 * POST request: Saves an added vote to the database
 * @param {object} req - The details of the vote.
 * @param {object} res - Should contain the vote if successful
 */

exports.getVote = function(req, res) {
    models.ModelVote
        .find({
            commentID: req.body.commentID,
            username: req.body.username,

        })
        .exec(function(err, vote) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(vote);
            }
        });
};


/**
 * POST request: Saves an added vote to the database
 * @param {object} req - The details of the vote.
 * @param {object} res - Should be empty if successful
 */

exports.addVote = function(req, res) {
    var newVote = new models.ModelVote({
            commentID: req.body.commentID,
            username: req.body.username,
            score: req.body.score
    });
    newVote.save(function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            }
            res.end();
        });
};

/**
 * POST request: Updates the vote score.
 * @param {object} req - Contains info on the comment to update.
 * @param {object} res - The result of the post request.
 */
exports.updateVote = function(req, res) {
    models.ModelVote
        .find({
            commentID: req.body.commentID,
            username: req.body.username
        })
        .update({
            score: req.body.score
        })
        .exec(function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            }
            res.end();
        });
};
/************************* DATABASE POST FUNCTIONS END ************************/
