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
    .post(orders.create);

  app.route('/api/orders/:orderId').all(core.requiresLoginToken, ordersPolicy.isAllowed)
    .get(orders.read)
    .put(orders.update)
    .delete(orders.delete);

  app.route('/api/notibuyer/:message')
    .get(orders.sendNotiBuyer);
  app.route('/api/notiseller/:message')
    .get(orders.sendNotiSeller);


  // Finish by binding the Order middleware
  app.param('orderId', orders.orderByID);
  app.param('message', orders.message);
};
