'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cart = mongoose.model('Cart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cart
 */
exports.create = function (req, res) {
  var cart = new Cart(req.body);
  cart.user = req.user;

  cart.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

/**
 * Show the current Cart
 */
exports.read = function (req, res) {
  res.jsonp();
};

exports.getCartByUser = function (req, res) {
  Cart.findOne({ 'user': req.userID })
    .populate('items.product')
    .exec(function (err, result) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(result);
      }
    });
};

/**
 * Update a Cart
 */
exports.update = function (req, res) {
  Cart.findByIdAndUpdate(req.cartID, { $set: { 'items': req.body } }).exec(function (err, cartRes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(req.body);
    }
  });
};

/**
 * Delete an Cart
 */
exports.delete = function (req, res) {
  var cart = req.cartID;

  cart.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

/**
 * List of Carts
 */
exports.list = function (req, res) {
  Cart.find().sort('-created').populate('user', 'displayName').exec(function (err, carts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carts);
    }
  });
};

/**
 * Cart middleware
 */
exports.cartByID = function (req, res, next, id) {
  req.cartID = id;
  next();
};

exports.cartByUserID = function (req, res, next, id) {
  req.userID = id;
  next();
};
