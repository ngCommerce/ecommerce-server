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
      qty: Number,
      amount: Number,
      discount: Number,
      totalamount: Number
    }]
  },
  amount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalamount: { type: Number, default: 0 },
  user: {
    type: Schema.ObjectId,
    required: 'Please fill ref user',
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Cart', CartSchema);
