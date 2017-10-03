'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cart = mongoose.model('Cart'),
  Product = mongoose.model('Product'),
  Category = mongoose.model('Category'),
  Shop = mongoose.model('Shop'),
  Shipping = mongoose.model('Shipping'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  product,
  category,
  shop,
  shipping,
  cart;

/**
 * Cart routes tests
 */
describe('Cart CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    shipping = new Shipping({
      name: 'shipping1',
      detail: 'detail shipping1',
      price: 100,
      duedate: 10,
      user: user
    });

    category = new Category({
      name: 'category1',
      user: user
    });

    shop = new Shop({
      name: 'shop1',
      reviews: [{
        topic: 'toppic1',
        comment: 'comment1',
        rate: 5,
        user: user
      }],
      user: user
    });

    product = new Product({
      name: 'product1',
      detail: 'detail product1',
      price: 90,
      promotionprice: 59,
      percentofdiscount: 10,
      currency: 'บาท',
      images: ['image1.jpg', 'image2.jpg'],
      reviews: [{
        topic: 'toppic1',
        comment: 'comment1',
        rate: 5,
        user: user
      }],
      shippings: [shipping],
      categories: [category],
      cod: true,
      shop: shop,
      user: user
    });

    // Save a user to the test db and create new Cart
    user.save(function () {
      category.save(function () {
        shipping.save(function () {
          shop.save(function () {
            product.save(function () {
              cart = new Cart({
                items: [{
                  product: product._id,
                  qty: 1,
                  amount: 100,
                  discount: 10,
                  totalamount: 90
                }],
                amount: 100,
                discount: 10,
                totalamount: 90,
                user: user
              });
              cart.save(function () {
                done();
              });
            });
          });
        });
      });
    });
  });

  it('should be able to get a Cart if logged in by userID', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        if (signinErr) {
          return done(signinErr);
        }

        agent.get('/api/cartbyuser/' + user._id)
          .end(function (cartsGetErr, cartsGetRes) {
            if (cartsGetErr) {
              return done(cartsGetErr);
            }
            (cartsGetRes.body.items.length).should.equal(1);
            done();
          });
      });
  });

  it('should be able to update items a Cart if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        if (signinErr) {
          return done(signinErr);
        }

        agent.get('/api/cartbyuser/' + user._id)
          .end(function (cartsGetErr, cartsGetRes) {
            if (cartsGetErr) {
              return done(cartsGetErr);
            }

            var items = [];
            items = cartsGetRes.body.items;
            items.push(product);

            agent.put('/api/carts/' + cart._id)
              .send(items)
              .expect(200)
              .end(function (cartUpdateErr, cartUpdateRes) {
                if (cartUpdateErr) {
                  return done(cartUpdateErr);
                }

                var cart = cartUpdateRes.body;

                (cart.length).should.equal(items.length);

                done();
              });

          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Cart.remove().exec(function () {
        Category.remove().exec(function () {
          Shop.remove().exec(function () {
            Product.remove().exec(function () {
              done();
            });
          });
        });
      });
    });
  });
});
