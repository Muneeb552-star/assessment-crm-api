import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pictures: { type: [String], validate: [arrayLimit, 'Must have at least 1, max 6 pictures'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

function arrayLimit(val) {
  return val.length > 0 && val.length <= 6;
}

const ProductModel = mongoose.model('Product', ProductSchema);
export default ProductModel;
