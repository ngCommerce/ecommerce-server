'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  request = require('request'),
  pushNotiUrl = process.env.PUSH_NOTI_URL || 'https://onesignal.com/api/v1/notifications';

/**
 * Create a Order
 */
exports.create = function (req, res) {
  var order = new Order(req.body);
  order.user = req.user;

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Show the current Order
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();

  res.jsonp(order);
};

/**
 * Update a Order
 */
exports.update = function (req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function (req, res) {
  var order = req.order;

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function (req, res) {
  Order.find().sort('-created').populate('user', 'displayName').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};

exports.message = function (req, res, next, message) {
  req.message = message;
  next();
};

exports.sendNotiBuyer = function (req, res) {
  //console.log(admtokens);
  request({
    url: pushNotiUrl,
    headers: {
      'Authorization': 'Basic ZWNkZWY0MmUtNGJiNC00ZThjLWIyOWUtNzdmNzAxZmMyZDMw'
    },
    method: 'POST',
    json: {
      app_id: 'd5d9533c-3ac8-42e6-bc16-a5984bef02ff',
      contents: { en: req.message },
      included_segments: ['All']
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
      res.jsonp({ message: error });

    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
      res.jsonp({ message: response.body.error });
    }
    res.jsonp({ message: 'sent noti success' });
  });
};

exports.sendNotiSeller = function (req, res) {
  //console.log(admtokens);
  request({
    url: pushNotiUrl,
    headers: {
      'Authorization': 'Basic ZWFkMjNkNDUtZDIyNy00MGU2LTg5ZjEtYmZlY2FkYjUxZDY2'
    },
    method: 'POST',
    json: {
      app_id: 'fdfae3dc-e634-47f4-b959-f04e60f4613b',
      contents: { en: req.message },
      included_segments: ['All']
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
      res.jsonp({ message: error });

    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
      res.jsonp({ message: response.body.error });
    }
    res.jsonp({ message: 'sent noti success' });
  });
};