import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: null
    },

    qty: {
        type: Number,
        default: 0
    },

    unit: {
        type: String,
        default: "pcs"
    },

    buy_price: {
        type: Number,
        required: true
    },

    sell_price: {
        type: Number,
        required: true
    },

    low_stock_threshold: {
        type: Number,
        default: 5
    }

},
{
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;