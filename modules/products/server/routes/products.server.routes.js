'use strict';

/**
 * Module dependencies
 */
var core = require('../../../core/server/controllers/core.server.controller'),
  productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products Routes
  app.route('/api/products').all(core.requiresLoginToken, productsPolicy.isAllowed)
    .get(products.getProductList, products.cookingProductList, products.list)
    .post(products.create);

  app.route('/api/products/review/:productId').all(core.requiresLoginToken, productsPolicy.isAllowed)
    .put(products.updateReview);

  app.route('/api/products/:productId').all(core.requiresLoginToken, productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // app.route('/api/products/shipping/:shopId').all(core.requiresLoginToken.productsPolicy.isAllowed)
  //   .put(products.updateShipping);  

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
  // app.param('shopId',products.productByShipping);


};
