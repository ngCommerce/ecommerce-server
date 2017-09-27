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
  unitprice: Number,
  images:{
    type: [{
      
    }]
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
