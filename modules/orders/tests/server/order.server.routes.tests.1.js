'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order'),
  Product = mongoose.model('Product'),
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
  order,
  product,
  shop,
  shipping,
  token;

/**
 * Order routes tests
 */
describe('Order CRUD tests with Token Base Authen', function () {

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

    shipping = new Shipping([
      {
        shipping: {
          detail: 'วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี',
          name: 'ส่งแบบส่งด่วน',
          price: 0
        }
      },
      {
        shipping: {
          detail: 'วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี',
          name: 'ส่งแบบธรรมดา',
          price: 0
        }
      }
    ]);

    shop = new Shop({
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
    });

    product = new Product([
      {
        product: {
          _id: '1',
          name: 'Crossfit WorldWide Event',
          image: 'https://images-eu.ssl-images-amazon.com/images/G/02/AMAZON-FASHION/2016/SHOES/SPORT/MISC/Nikemobilefootball',
          price: 20000,
          promotionprice: 18000,
          percentofdiscount: 10,
          currency: 'THB',
          shop: shop,
          shippings: [shipping]
        },
        qty: 1,
        amount: 20000,
        discount: 2000,
        deliveryprice: 0,
        totalamount: 18000,
        delivery: {
          detail: 'วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี',
          name: 'ส่งแบบส่งด่วน',
          price: 0
        }
      },
    ]);

    token = '';

    // Save a user to the test db and create new Product
    user.save(function () {
      shipping.save(function () {
        shop.save(function () {
          product.save(function () {
            order = {
              shippings: [{
                name: 'Product shippings name',
                detail: 'Product shippings detail',
                price: 100,
                duedate: 3,
                created: new Date()
              }],
              items: [
                {
                  product: product[0],
                  qty: 1,
                  delivery: {
                    detail: "วันอังคาร, 1 - วัน อังคาร, 2 ส.ค. 2017 ฟรี",
                    name: "ส่งแบบส่งด่วน",
                    price: 0
                  },
                  amount: 20000,
                  discount: 2000,
                  deliveryprice: 0,
                  totalamount: 18000,
                }
              ],
              amount: 30000,
              discount: 2000,
              totalamount: 28000,
              deliveryprice: 0,
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
      });
    });
  });

  it('should be have Token logged in', function (done) {
    token.should.not.be.empty();
    done();
  });

  

  afterEach(function (done) {
    User.remove().exec(function () {
      Shop.remove().exec(function () {
        Shipping.remove().exec(function () {
          Product.remove().exec(function () {
            Order.remove().exec(done);
          });
        });
      });
    });
  });
});
