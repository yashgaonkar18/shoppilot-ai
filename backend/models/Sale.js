import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
{
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },

    product_name: {
        type: String,
        required: true
    },

    qty: {
        type: Number,
        required: true
    },

    unit_price: {
        type: Number,
        required: true
    },

    line_total: {
        type: Number,
        required: true
    }

},
{
    _id: false
});

const saleSchema = new mongoose.Schema(
{
    customer_name: {
        type: String,
        default: null
    },

    customer_phone: {
        type: String,
        default: null
    },

    total: {
        type: Number,
        required: true
    },

    sold_at: {
        type: Date,
        default: Date.now
    },

    sale_items: [saleItemSchema]

},
{
    timestamps: true
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;