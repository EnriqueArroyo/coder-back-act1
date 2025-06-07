
const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
  products: [
    {
      product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1, min: 1 }
    }
  ]
}, { timestamps: true });

module.exports = model('Cart', cartSchema);
