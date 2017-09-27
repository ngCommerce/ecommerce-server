'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shop = mongoose.model('Shop'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  token,
  shop;

/**
 * Shop routes tests
 */
describe('Shop CRUD tests', function () {

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

    // Save a user to the test db and create new Shop
    user.save(function () {
      shop = {
        name: 'Shop Name',
        detail: 'Shop Detail',
        email: 'Shop Email',
        image: 'https://www.onsite.org/assets/images/teaser/online-e-shop.jpg',
        tel: '097654321',
        map: {
          lat: '13.933954',
          long: '100.7157976'
        },
        user: user
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

  it('should be able to save a Shop if logged in with token', function (done) {
    // Save a new Product
    agent.post('/api/shops')
      .set('authorization', 'Bearer ' + token)
      .send(shop)
      .expect(200)
      .end(function (shopSaveErr, shopSaveRes) {
        // Handle Product save error
        if (shopSaveErr) {
          return done(shopSaveErr);
        }

        // Get a list of Products
        agent.get('/api/shops')
          .end(function (shopsGetErr, shopsGetRes) {
            // Handle Products save error
            if (shopsGetErr) {
              return done(shopsGetErr);
            }

            // Get Products list
            var shops = shopsGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            (shops[0].name).should.match(shop.name);

            // Call the assertion callback
            done();
          });
      });
  });

  it('get list shops', function (done) {
    var shops = new Shop(shop);
    shops.save();
    agent.get('/api/shops')
      .end(function (shopsGetErr, shopsGetRes) {
        // Handle Products save error
        if (shopsGetErr) {
          return done(shopsGetErr);
        }

        // Get Products list
        var shops = shopsGetRes.body;

        // Set assertions
        //(products[0].user.loginToken).should.equal(token);
        (shops[0].name).should.match(shop.name);
        (shops[0].image).should.match(shop.image);


        // Call the assertion callback
        done();
      });
  });





  afterEach(function (done) {
    User.remove().exec(function () {
      Shop.remove().exec(done);
    });
  });
});
