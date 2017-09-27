'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  product,
  token;

/**
 * Product routes tests
 */
describe('Product CRUD tests with Token Base Authen', function () {

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

    token = '';

    // Save a user to the test db and create new Product
    user.save(function () {
      product = {
        name: 'Product name'
      };

      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          signinRes.body.loginToken.should.not.be.empty();
          token = signinRes.body.loginToken;
          done();
        });
    });
  });

  it('should be have Token logged in', function (done) {
    token.should.not.be.empty();
    done();
  });

  it('should be able to save a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        // Get a list of Products
        agent.get('/api/products')
          .end(function (productsGetErr, productsGetRes) {
            // Handle Products save error
            if (productsGetErr) {
              return done(productsGetErr);
            }

            // Get Products list
            var products = productsGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            (products[0].name).should.match('Product name');

            // Call the assertion callback
            done();
          });
      });
  });
  it('should be able to update a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        product.name = "test Product";
        agent.put('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .send(product)
          .expect(200)
          .end(function (productUpdateErr, productUpdateRes) {
            // Handle Product save error
            if (productUpdateErr) {
              return done(productUpdateErr);
            }
            // Get a list of Products
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle Products save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get Products list
                var products = productsGetRes.body;

                // Set assertions
                //(products[0].user.loginToken).should.equal(token);
                (products[0].name).should.match('test Product');

                // Call the assertion callback
                done();
              });
          });
      });
  });
  it('should be able to delete a Product if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .set('authorization', 'Bearer ' + token)
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        agent.delete('/api/products/' + productSaveRes.body._id)
          .set('authorization', 'Bearer ' + token)
          .send(product)
          .expect(200)
          .end(function (productUpdateErr, productUpdateRes) {
            // Handle Product save error
            if (productUpdateErr) {
              return done(productUpdateErr);
            }
            // Get a list of Products
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle Products save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get Products list
                var products = productsGetRes.body;

                // Set assertions
                //(products[0].user.loginToken).should.equal(token);
                (products.length).should.match(0);

                // Call the assertion callback
                done();
              });
          });
      });
  });
  afterEach(function (done) {
    User.remove().exec(function () {
      Product.remove().exec(done);
    });
  });
});
