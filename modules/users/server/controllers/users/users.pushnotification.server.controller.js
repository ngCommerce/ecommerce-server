'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User');

/**
 * User middleware
 */
exports.notificationUser = function (req, res) {
  if (req.user) {
    User.findById(req.user._id).exec(function (err, user) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      user.pushnotifications = user.pushnotifications ? user.pushnotifications : [];
      console.log(req.body);
      console.log(user.pushnotifications);
      console.log(user.pushnotifications.indexOf(req.body));
    
      if (user.pushnotifications.indexOf(req.body) === -1) {
        user.pushnotifications.push(req.body[i]);
      }
      console.log(user.pushnotifications);
      
      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(user);
        }
      });
    });
  }
};
