'use strict';

/**
 * Module dependencies
 */
var core = require('../../../core/server/controllers/core.server.controller'),
  ordersPolicy = require('../policies/orders.server.policy'),
  orders = require('../controllers/orders.server.controller');

module.exports = function (app) {
  // Orders Routes
  app.route('/api/orders').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .get(orders.list)
    .post(orders.create, orders.getCart, orders.clearCart);

  app.route('/api/orders/:orderId').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .get(orders.read)
    .put(orders.update)
    .delete(orders.delete);

  app.route('/api/orderbyshop').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .get(orders.getShopByUser, orders.getOrderList, orders.cookingOrderByShop, orders.orderByShops);

  app.route('/api/updateorderaccept/:orderId/:itemId').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .put(orders.waitingToAccept);

  app.route('/api/updateordersent/:orderId/:itemId').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .put(orders.acceptToSent);

  app.route('/api/updateordercomplete/:orderId/:itemId').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .put(orders.sentToComplete);

  app.route('/api/updateorderreject/:orderId/:itemId').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .put(orders.waitingToReject);

  app.route('/api/notibuyer/:message')
    .get(orders.sendNotiBuyer);
  app.route('/api/notiseller/:message')
    .get(orders.sendNotiSeller);


  // Finish by binding the Order middleware
  app.param('orderId', orders.orderByID);
  app.param('message', orders.message);
  app.param('itemId', orders.itemID);
};
