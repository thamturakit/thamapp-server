'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Accountchart = mongoose.model('Accountchart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Accountchart
 */
exports.create = function(req, res) {
  var accountchart = new Accountchart(req.body);
  accountchart.user = req.user;

  accountchart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountchart);
    }
  });
};

/**
 * Show the current Accountchart
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var accountchart = req.accountchart ? req.accountchart.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  accountchart.isCurrentUserOwner = req.user && accountchart.user && accountchart.user._id.toString() === req.user._id.toString();

  res.jsonp(accountchart);
};

/**
 * Update a Accountchart
 */
exports.update = function(req, res) {
  var accountchart = req.accountchart;

  accountchart = _.extend(accountchart, req.body);

  accountchart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountchart);
    }
  });
};

/**
 * Delete an Accountchart
 */
exports.delete = function(req, res) {
  var accountchart = req.accountchart;

  accountchart.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountchart);
    }
  });
};

/**
 * List of Accountcharts
 */
exports.list = function(req, res) {
  Accountchart.find().sort('accountno').populate('user', 'displayName').exec(function(err, accountcharts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(accountcharts);
    }
  });
};

/**
 * Accountchart middleware
 */
exports.accountchartByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Accountchart is invalid'
    });
  }

  Accountchart.findById(id).populate('user', 'displayName').exec(function (err, accountchart) {
    if (err) {
      return next(err);
    } else if (!accountchart) {
      return res.status(404).send({
        message: 'No Accountchart with that identifier has been found'
      });
    }
    req.accountchart = accountchart;
    next();
  });
};
