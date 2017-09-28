'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cart Schema
 */
var CartSchema = new Schema({
  items: {
    type: [{
      product: {
        type: Schema.ObjectId,
        ref: 'Product'
      },
      delivery: {
        detail: String,
        name: String,
        price: Number
      },
      qty: Number,
      amount: Number,
      discount: Number,
      totalamount: Number,
      deliveryprice: Number
    }]
  },
  user: {
    type: Schema.ObjectId,
    required: 'Please fill ref user',
    ref: 'User'
  },
  totalPrice: { type: Number, default: 0 },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Cart', CartSchema);
