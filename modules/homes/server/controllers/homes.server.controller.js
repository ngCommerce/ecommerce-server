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
      req.categories = categories;
      next();
    }
  });
};

exports.getProducts = function (req, res, next) {
  Product.find({}, '_id name images price promotionprice percentofdiscount currency categories rate historylog shop').sort('-created').populate('categories').populate('shippings').populate('shop').exec(function (err, products) {
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

exports.historyProductsFilterOfMounth = function (req, res, next) {
  var products = req.products ? req.products : [];
  var items = [];
  var start = new Date();
  start.setDate(1);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  var end = new Date();
  end.setMonth(start.getMonth() + 1);
  end.setDate(0);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  products.forEach(function (product) {
    product = product ? product.toJSON() : {};
    product.mounthHistory = product.mounthHistory ? product.mounthHistory : [];
    product.historylog.forEach(function (his) {
      if (his.created >= start && his.created <= end) {
        product.mounthHistory.push(his);
      }
    });
    items.push(product);
  });

  items.sort((a, b) => { return (a.mounthHistory.length < b.mounthHistory.length) ? 1 : ((b.mounthHistory.length < a.mounthHistory.length) ? -1 : 0); });
  req.products = items;
  next();
};


exports.cookingShopPopular = function (req, res, next) {
  var shopsPopular = [];
  req.products.forEach(function (product) {
    if (product.shop) {
      if (shopsPopular.indexOf(product.shop._id.toString()) === -1) {
        shopsPopular.push(product.shop._id.toString());
      }
    }
  });
  Shop.find({
    '_id': {
      $in: shopsPopular
    }
  }, function (err, shops) {
    var datas = [];
    shops.forEach(function (shop) {
      datas.push({
        _id: shop._id,
        name: shop.name,
        image: shop.image
      });
    });
    req.shopPopular = datas;
    next();
  });
};


exports.cookingHighlight = function (req, res, next) {
  var items = [{
    name: 'highlight',
    popularproducts: req.products.slice(0, 5),
    popularshops: req.shopPopular.slice(0, 5)
  }];
  req.highlight = items;
  next();
};

exports.cookingData = function (req, res, next) {
  var items = [];
  items = items.concat(req.highlight);
  var item = {
    name: '',
    popularproducts: [],
    popularshops: []
  };
  req.categories.forEach(function (cate) {
    item = {
      name: cate.name,
      popularproducts: [],
      popularshops: []
    };
    req.products.forEach(function (product) {
      product.categories.forEach(function (catep) {
        if (cate._id.toString() === catep._id.toString()) {
          var categories = [];
          categories.push({
            name: catep.name,
            _id: catep._id
          });
          item.popularproducts.push({
            _id: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            promotionprice: product.promotionprice,
            percentofdiscount: product.percentofdiscount,
            currency: product.currency,
            categories: categories,
            rate: product.rate ? product.rate : 5
          });
          if (item.popularshops.length > 0) {
            var chkShop = false;
            item.popularshops.forEach(function (shopPop) {
              if (product.shop) {
                if (shopPop) {
                  if (product.shop._id.toString() === shopPop._id.toString()) {
                    chkShop = true;
                  }
                }
              }
            });
            if (!chkShop) {
              item.popularshops.push(product.shop);
            }
          } else {
            item.popularshops.push(product.shop);
          }
        }
      });
    });
    item.popularproducts.slice(0, 5);
    item.popularshops.slice(0, 5);
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
