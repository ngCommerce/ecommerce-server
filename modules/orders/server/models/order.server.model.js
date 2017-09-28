'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  // name: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Order name',
  //   trim: true
  // },
  shipping: {
    type: [{
      name: {
        type: String,
        default: '',
        required: 'Please fill Shipping name',
        trim: true
      },
      detail: {
        type: String,
        required: 'Please fill Shipping detail'
      },
      price: {
        type: Number,
        default: 0,
        required: 'Please fill Shipping price'
      },
      duedate: {
        type: Number,
        default: 1,
        required: 'Please fill Shipping price'
      },
      created: {
        type: Date,
        default: Date.now
      }
    }]
  },
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
      status: {
        type: String,
        enum: ['waiting', 'accept', 'reject', 'sent', 'unreceived', 'received', 'complete', 'return'],
        default: 'waiting'
      },
      qty: Number,
      amount: Number,
      discount: Number,
      totalamount: Number,
      deliveryprice: Number
    }],
    required: 'Please fill Order items'
  },
  payment: {
    paymenttype: String,
    creditno: String,
    creditname: String,
    expdate: String,
    creditcvc: String,
    counterservice: String
  },
  amount: {
    type: Number,
    required: 'Please fill Order amount'
  },
  discount: {
    type: Number,
    required: 'Please fill Order discount'
  },
  totalamount: {
    type: Number,
    required: 'Please fill Order totalamount'
  },
  deliveryprice: {
    type: Number,
    required: 'Please fill Order tran'
  },
  discountcode: {
    type: String
  },
  status: {
    type: String,
    enum: ['confirm', 'paid', 'prepare', 'deliver', 'complete', 'cancel'],
    default: 'confirm'
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

mongoose.model('Order', OrderSchema);
