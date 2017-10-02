'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  Category = mongoose.model('Category'),
  Shop = mongoose.model('Shop'),
  Shipping = mongoose.model('Shipping'),
  Cart = mongoose.model('Cart');

/**
 * Globals
 */
var user,
  product,
  category,
  shop,
  shipping,
  cart;

/**
 * Unit tests
 */
describe('Cart Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
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
              done();
            });
          });
        });
      });
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return cart.save(function (err) {
        should.not.exist(err);
        done();
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
