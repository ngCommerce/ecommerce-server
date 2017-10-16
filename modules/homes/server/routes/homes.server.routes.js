'use strict';

/**
 * Module dependencies
 */
var homesPolicy = require('../policies/homes.server.policy'),
  homes = require('../controllers/homes.server.controller');

module.exports = function (app) {
  // Homes Routes
  app.route('/api/homes').all(homesPolicy.isAllowed)
    .get(homes.getCate, homes.getProducts, homes.historyProductsFilterOfMounth, homes.cookingShopPopular, homes.cookingHighlight, homes.cookingData, homes.list);

  app.route('/api/seeallproduct/:catename').all(homesPolicy.isAllowed)
    .get(homes.getProducts, homes.historyProductsFilterOfMounth, homes.cookingSeeAll, homes.seeAllProduct);

  app.route('/api/seeallshop/:catename').all(homesPolicy.isAllowed)
    .get(homes.getProducts, homes.historyProductsFilterOfMounth, homes.cookingSeeAll, homes.seeAllShop);

  // app.route('/api/homes/:homeId').all(homesPolicy.isAllowed)
  //   .get(homes.read)
  //   .put(homes.update)
  //   .delete(homes.delete);

  // Finish by binding the Home middleware
  app.param('catename', homes.cateName);
};
