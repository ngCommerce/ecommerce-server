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
  products: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Product'
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
