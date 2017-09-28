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

    shipping = {
      name: 'shipping1',
      detail: 'shiping detail1'
    };

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

    cart = new Cart({
      products: [],
      user: user
    });

    // Save a user to the test db and create new Cart
    user.save(function () {
      category.save(function () {
        shop.save(function () {
          product.save(function () {
            done();
          });
        });
      });
    });
  });

  it('should be able to get a Cart if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        if (signinErr) {
          return done(signinErr);
        }

        cart.save(function (err, cart) {
          agent.get('/api/carts/' + cart._id)
            .end(function (cartsGetErr, cartsGetRes) {
              if (cartsGetErr) {
                return done(cartsGetErr);
              }
              (cartsGetRes.body.products.length).should.equal(0);
              done();
            });
        });
      });
  });

  it('should be able to add product to Cart if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        if (signinErr) {
          return done(signinErr);
        }

        cart.products = [];

        cart.save(function (err, cartRes) {
          if (err) {
            return done(err);
          } else {
            product.save(function (err, prodRes) {
              if (err) {
                return done(err);
              } else {
                cart.products = [prodRes._id];
                agent.put('/api/carts/' + cartRes._id)
                  .send(cart)
                  .expect(200)
                  .end(function (cartUpdateErr, cartUpdateRes) {
                    if (cartUpdateErr) {
                      return done(cartUpdateErr);
                    }

                    (cartUpdateRes.body.products.length).should.equal(cart.products.length);

                    done();
                  });
              }
            });
          }
        });
      });
  });

  it('should be able to clear product to Cart after buy success if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        if (signinErr) {
          return done(signinErr);
        }

        cart.products = ['dsfsdkfowehfiwhfiphewhfw', 'dsbf74yr-t482quq9rq8gqry'];

        cart.save(function (err, cartRes) {
          if (err) {
            return done(err);
          } else {
            cart.products = [];
            agent.put('/api/carts/' + cartRes._id)
              .send(cart)
              .expect(200)
              .end(function (cartUpdateErr, cartUpdateRes) {
                if (cartUpdateErr) {
                  return done(cartUpdateErr);
                }

                (cartUpdateRes.body.products.length).should.equal(0);

                done();
              });
          }
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
