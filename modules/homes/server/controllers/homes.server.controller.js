'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Shop = mongoose.model('Shop'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Home
 */

exports.getCate = function (req, res, next) {
  Category.find().sort('-created').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('category' + categories.length);
      req.categories = categories;
      next();
    }
  });
};

exports.getProduct = function (req, res, next) {
  Product.find({}, '_id name images price promotionprice percentofdiscount currency categories rate').sort('-created').populate('categories').populate('shippings').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var productlist = [];
      products.forEach(function (element) {
        var categories = [];
        element.categories.forEach(function (cate) {
          categories.push({
            name: cate.name,
            _id: cate._id
          });
        });
        productlist.push({
          _id: element._id,
          name: element.name,
          image: element.images[0],
          price: element.price,
          promotionprice: element.promotionprice,
          percentofdiscount: element.percentofdiscount,
          currency: element.currency,
          categories: categories,
          rate: element.rate ? element.rate : 5
        });
      });
      console.log('productlist' + productlist.length);

      req.products = productlist;
      next();
    }
  });
};

exports.getShop = function (req, res, next) {
  Shop.find().limit(5).sort('-created').exec(function (err, shops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('shops' + shops.length);

      req.shops = shops;
      next();
    }
  });
};

exports.cookingData = function (req, res, next) {
  var items = [{
    name: 'highlight',
    popularproducts: req.products.slice(0, 5),
    popularshops: req.shops,
    bestseller: req.products.slice(0, 5)
  }];
  var item = {
    name: '',
    popularproducts: [],
    popularshops: req.shops,
    bestseller: []
  };
  req.categories.forEach(function (cate) {
    item = {
      name: cate.name,
      popularproducts: [],
      popularshops: req.shops,
      bestseller: []
    };
    req.products.forEach(function (product) {
      product.categories.forEach(function (catep) {
        if (cate._id.toString() === catep._id.toString()) {
          item.popularproducts.push(product);
          item.bestseller.push(product);
        }
      });
    });
    items.push(item);
  });
  req.home = items;
  next();
};

exports.list = function (req, res) {
  res.jsonp({
    categories: req.home
  });
};
