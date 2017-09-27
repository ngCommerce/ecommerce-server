'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 * id: string;
    name: string;
    detail: string;
    unitprice: number;
    image: Array<ImgsModel>;
    review: Array<ReviewsModel>;
    rate: number;
    qa: Array<QASModel>;
    promotions: Array<PromotionsModel>;
    qty: number;
    issize: boolean;
    size: ProductDataSize = new ProductDataSize();
    shipping: Array<ShippingModel>;
    shop: ShopModel = new ShopModel();
    relationProducts: Array<RelationProductsModel>;
    selectedsize: string;
    title: string;
 */

var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  detail: String,
  price: {
    type: Number,
    required: 'Please fill Product price'
  },
  promotionprice: {
    type: Number
  },
  percentofdiscount: {
    type: Number
  },
  currency: {
    type: String
  },
  images: {
    type: [String],
    required: 'Please fill Product images'
  },
  reviews: {
    type: [{
      topic: String,
      comment: String,
      rate: Number,
      created: {
        type: Date,
        default: Date.now
      }
    }]
  },
  shippings: {
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
  categories: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Category'
    }]
  },
  cod: {
    type: Boolean,
    default: false
  },
  shop: {
    type: Schema.ObjectId,
    ref: 'Shop'
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

mongoose.model('Product', ProductSchema);
