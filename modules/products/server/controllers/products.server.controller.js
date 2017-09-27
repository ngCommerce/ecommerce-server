'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Get List Product
 */
exports.getProductList = function (req, res, next) {
  Product.find({}, '_id name images price promotionprice percentofdiscount currency').sort('-created').populate('user', 'displayName').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = products;
      next();
    }
  });

};

/**
 * Cooking List Product
 */
exports.cookingProductList = function (req, res, next) {
  var products = [];
  req.products.forEach(function (element) {
    // var categories = [];
    // element.categories.forEach(function (cate) {
    //   categories.push({ name: cate.name });
    // });
    products.push({
      _id: element._id,
      name: element.name,
      image: element.images[0],
      price: element.price,
      promotionprice: element.promotionprice,
      percentofdiscount: element.percentofdiscount,
      currency: element.currency,
      // categories: categories,
      rate: 5
    });
  });
  req.productsCookingList = products;
  next();
};

/**
 * List of Products
 */
exports.list = function (req, res) {
  res.jsonp({
    items: req.productsCookingList
  });
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
