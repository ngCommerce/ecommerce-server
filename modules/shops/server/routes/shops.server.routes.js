'use strict';

/**
 * Module dependencies
 */
var shopsPolicy = require('../policies/shops.server.policy'),
  core = require('../../../core/server/controllers/core.server.controller'),
  shops = require('../controllers/shops.server.controller');

module.exports = function (app) {
  // Shops Routes
  app.route('/api/shops').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .get(shops.cookingListShop, shops.list)
    .post(shops.create);

  app.route('/api/shops/:shopId').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .get(shops.read)
    .put(shops.update)
    .delete(shops.delete);

  app.route('/api/shops/review/:shopId').all(core.requiresLoginToken, shopsPolicy.isAllowed)
    .put(shops.updateReview);

  // Finish by binding the Shop middleware
  app.param('shopId', shops.shopByID);
};