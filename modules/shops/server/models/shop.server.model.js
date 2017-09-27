'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shop Schema
 */
var ShopSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shop name',
    trim: true
  },
  detail: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  tel: {
    type: String,
    default: ''
  },
  map: {
    lat: {
      type: String
    },
    long: {
      type: String
    }
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Shop', ShopSchema);
